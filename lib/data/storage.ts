import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export const PROJECT_IMAGES_BUCKET = "project-images";

function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  return file.type.split("/")[1] ?? "bin";
}

/** Uploads one image to the project-images bucket and returns its public URL. */
export async function uploadProjectImage(
  supabase: SupabaseClient<Database>,
  file: File,
  slug: string,
): Promise<string> {
  const path = `${slug}/${crypto.randomUUID()}.${extensionFor(file)}`;
  const { error } = await supabase.storage.from(PROJECT_IMAGES_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(`Image upload failed: ${error.message}`);

  const { data } = supabase.storage.from(PROJECT_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Best-effort delete of a previously uploaded image, given its public URL. */
export async function removeProjectImage(supabase: SupabaseClient<Database>, publicUrl: string): Promise<void> {
  const marker = `/object/public/${PROJECT_IMAGES_BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const path = publicUrl.slice(idx + marker.length);
  if (!path) return;
  const { error } = await supabase.storage.from(PROJECT_IMAGES_BUCKET).remove([path]);
  if (error) console.error("Failed to remove project image:", error.message);
}
