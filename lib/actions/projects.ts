"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getNextDisplayOrder, getProjectByIdAdmin, isSlugTaken } from "@/lib/data/admin-projects";
import { removeProjectImage, uploadProjectImage } from "@/lib/data/storage";
import { projectSchema, validateImageFile } from "@/lib/validation/project";
import { slugify } from "@/lib/utils";
import type { ProjectInsert } from "@/types/database";

export interface ProjectActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function readList(formData: FormData, key: string): string[] {
  return formData
    .getAll(key)
    .map((v) => String(v).trim())
    .filter(Boolean);
}

function readFiles(formData: FormData, key: string): File[] {
  return formData
    .getAll(key)
    .filter((v): v is File => v instanceof File && v.size > 0);
}

function revalidatePublicPaths(slugs: string[]) {
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  for (const slug of slugs) {
    if (slug) revalidatePath(`/projects/${slug}`);
  }
}

async function parseAndValidate(formData: FormData, excludeId?: string) {
  const rawSlug = slugify(String(formData.get("slug") ?? "") || String(formData.get("title") ?? ""));

  const parsed = projectSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    slug: rawSlug,
    category: String(formData.get("category") ?? ""),
    sector: String(formData.get("sector") ?? ""),
    role: String(formData.get("role") ?? ""),
    year: String(formData.get("year") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    description: String(formData.get("description") ?? ""),
    challenge: String(formData.get("challenge") ?? ""),
    contributions: readList(formData, "contributions"),
    features: readList(formData, "features"),
    technologies: readList(formData, "technologies"),
    projectUrl: String(formData.get("projectUrl") ?? ""),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Please fix the highlighted fields.", fieldErrors } as const;
  }

  if (await isSlugTaken(parsed.data.slug, excludeId)) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: { slug: "This slug is already used by another project." },
    } as const;
  }

  return { values: parsed.data } as const;
}

export async function createProjectAction(
  _prevState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const result = await parseAndValidate(formData);
  if ("error" in result) return result;
  const { values } = result;

  const coverFile = readFiles(formData, "coverImageNew")[0];
  if (!coverFile) {
    return { error: "Please fix the highlighted fields.", fieldErrors: { coverImage: "A cover image is required." } };
  }
  const coverError = validateImageFile(coverFile);
  if (coverError) {
    return { error: "Please fix the highlighted fields.", fieldErrors: { coverImage: coverError } };
  }

  const galleryFiles = readFiles(formData, "galleryNew");
  for (const file of galleryFiles) {
    const err = validateImageFile(file);
    if (err) return { error: "Please fix the highlighted fields.", fieldErrors: { gallery: err } };
  }

  const supabase = await createClient();

  let coverImageUrl: string;
  const galleryUrls: string[] = [];
  try {
    coverImageUrl = await uploadProjectImage(supabase, coverFile, values.slug);
    for (const file of galleryFiles) {
      galleryUrls.push(await uploadProjectImage(supabase, file, values.slug));
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Image upload failed." };
  }

  const displayOrder = await getNextDisplayOrder();

  const insert: ProjectInsert = {
    slug: values.slug,
    title: values.title,
    category: values.category,
    sector: values.sector,
    role: values.role,
    year: values.year || null,
    summary: values.summary,
    description: values.description,
    challenge: values.challenge,
    contributions: values.contributions,
    features: values.features,
    technologies: values.technologies,
    project_url: values.projectUrl || null,
    cover_image_url: coverImageUrl,
    gallery_urls: galleryUrls,
    hue: Math.floor(Math.random() * 360),
    featured: values.featured,
    published: values.published,
    display_order: displayOrder,
  };

  const { error: insertError } = await supabase.from("projects").insert(insert);
  if (insertError) {
    return { error: `Could not save the project: ${insertError.message}` };
  }

  revalidatePublicPaths([values.slug]);
  revalidatePath("/admin");
  redirect("/admin?created=1");
}

export async function updateProjectAction(
  id: string,
  _prevState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const existing = await getProjectByIdAdmin(id);
  if (!existing) return { error: "Project not found." };

  const result = await parseAndValidate(formData, id);
  if ("error" in result) return result;
  const { values } = result;

  const supabase = await createClient();

  const coverCurrent = String(formData.get("coverImageCurrent") ?? "");
  const coverFile = readFiles(formData, "coverImageNew")[0];
  if (!coverFile && !coverCurrent) {
    return { error: "Please fix the highlighted fields.", fieldErrors: { coverImage: "A cover image is required." } };
  }

  const coverError = coverFile ? validateImageFile(coverFile) : null;
  if (coverError) return { error: "Please fix the highlighted fields.", fieldErrors: { coverImage: coverError } };

  const galleryNewFiles = readFiles(formData, "galleryNew");
  for (const file of galleryNewFiles) {
    const err = validateImageFile(file);
    if (err) return { error: "Please fix the highlighted fields.", fieldErrors: { gallery: err } };
  }

  // All input is valid from here on — safe to start mutating storage.
  let coverImageUrl = coverCurrent || existing.rawRow.cover_image_url || "";
  if (coverFile) {
    try {
      coverImageUrl = await uploadProjectImage(supabase, coverFile, values.slug);
      if (existing.rawRow.cover_image_url) await removeProjectImage(supabase, existing.rawRow.cover_image_url);
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Image upload failed." };
    }
  }

  const galleryKeepRaw = String(formData.get("galleryKeep") ?? "[]");
  let galleryKeep: string[] = [];
  try {
    const parsed = JSON.parse(galleryKeepRaw);
    if (Array.isArray(parsed)) galleryKeep = parsed.filter((v): v is string => typeof v === "string");
  } catch {
    galleryKeep = [];
  }

  const galleryNewUrls: string[] = [];
  try {
    for (const file of galleryNewFiles) {
      galleryNewUrls.push(await uploadProjectImage(supabase, file, values.slug));
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Image upload failed." };
  }

  const removedGalleryUrls = existing.rawRow.gallery_urls.filter((url) => !galleryKeep.includes(url));
  for (const url of removedGalleryUrls) {
    await removeProjectImage(supabase, url);
  }

  const update: Partial<ProjectInsert> = {
    slug: values.slug,
    title: values.title,
    category: values.category,
    sector: values.sector,
    role: values.role,
    year: values.year || null,
    summary: values.summary,
    description: values.description,
    challenge: values.challenge,
    contributions: values.contributions,
    features: values.features,
    technologies: values.technologies,
    project_url: values.projectUrl || null,
    cover_image_url: coverImageUrl,
    gallery_urls: [...galleryKeep, ...galleryNewUrls],
    featured: values.featured,
    published: values.published,
  };

  const { error: updateError } = await supabase.from("projects").update(update).eq("id", id);
  if (updateError) {
    return { error: `Could not save the project: ${updateError.message}` };
  }

  revalidatePublicPaths([values.slug, existing.slug]);
  revalidatePath("/admin");
  redirect("/admin?updated=1");
}

export async function deleteProjectAction(id: string): Promise<void> {
  const existing = await getProjectByIdAdmin(id);
  if (!existing) return;

  const supabase = await createClient();
  const imagesToRemove = [existing.rawRow.cover_image_url, ...existing.rawRow.gallery_urls].filter(
    (v): v is string => Boolean(v),
  );
  for (const url of imagesToRemove) {
    await removeProjectImage(supabase, url);
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(`Could not delete the project: ${error.message}`);

  revalidatePublicPaths([existing.slug]);
  revalidatePath("/admin");
}

export async function toggleProjectFlagAction(id: string, flag: "published" | "featured"): Promise<void> {
  const supabase = await createClient();
  const existing = await getProjectByIdAdmin(id);
  if (!existing) return;

  const { error } =
    flag === "published"
      ? await supabase.from("projects").update({ published: !existing.published }).eq("id", id)
      : await supabase.from("projects").update({ featured: !existing.featured }).eq("id", id);
  if (error) throw new Error(`Could not update the project: ${error.message}`);

  revalidatePublicPaths([existing.slug]);
  revalidatePath("/admin");
}

export async function moveProjectAction(id: string, direction: "up" | "down"): Promise<void> {
  const supabase = await createClient();
  const { data: rows, error: listError } = await supabase
    .from("projects")
    .select("id, display_order")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (listError) throw new Error(`Could not reorder the projects: ${listError.message}`);

  const ordered = rows ?? [];
  const index = ordered.findIndex((p) => p.id === id);
  if (index === -1) return;
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= ordered.length) return;

  const current = ordered[index];
  const swapWith = ordered[swapIndex];

  const { error: e1 } = await supabase
    .from("projects")
    .update({ display_order: swapWith.display_order })
    .eq("id", current.id);
  const { error: e2 } = await supabase
    .from("projects")
    .update({ display_order: current.display_order })
    .eq("id", swapWith.id);
  if (e1 || e2) throw new Error("Could not reorder the projects.");

  revalidatePublicPaths([]);
  revalidatePath("/admin");
}
