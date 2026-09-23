import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUp, Pencil } from "lucide-react";
import { DeleteProjectDialog } from "@/components/admin/DeleteProjectDialog";
import { FeaturedBadge, ProjectStatusBadge } from "@/components/admin/ProjectStatusBadge";
import { computeStats, getAllProjectsAdmin } from "@/lib/data/admin-projects";
import { categoryLabels } from "@/lib/project-constants";
import { moveProjectAction, toggleProjectFlagAction } from "@/lib/actions/projects";

export const metadata: Metadata = { title: "Dashboard" };

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-white/50">{label}</p>
    </div>
  );
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const { created, updated } = await searchParams;
  const projects = await getAllProjectsAdmin();
  const stats = computeStats(projects);

  return (
    <div>
      {(created || updated) && (
        <p className="mb-6 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          Project {created ? "created" : "updated"} successfully.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total projects" value={stats.total} />
        <StatCard label="Published" value={stats.published} />
        <StatCard label="Draft" value={stats.draft} />
        <StatCard label="Featured" value={stats.featured} />
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Projects</h2>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 p-10 text-center text-white/50">
            No projects yet. Click &ldquo;Add project&rdquo; to create your first one.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[860px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-left text-xs uppercase tracking-wide text-white/50">
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p, i) => (
                  <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border border-white/10 bg-bg-3">
                          {p.image ? (
                            <Image src={p.image} alt="" fill sizes="64px" className="object-cover" />
                          ) : (
                            <div
                              className="h-full w-full"
                              style={{ background: `hsl(${p.hue} 60% 30%)` }}
                              aria-hidden
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium leading-tight">{p.title}</p>
                          <p className="text-xs text-white/40">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/70">{categoryLabels[p.category]}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <ProjectStatusBadge published={Boolean(p.published)} />
                        {p.featured && <FeaturedBadge />}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-white/50">
                      {new Date(p.updatedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <form action={moveProjectAction.bind(null, p.id, "up")}>
                          <button
                            type="submit"
                            disabled={i === 0}
                            aria-label="Move up"
                            className="rounded border border-white/10 p-1 text-white/60 hover:border-white/30 hover:text-white disabled:opacity-30"
                          >
                            <ArrowUp size={14} />
                          </button>
                        </form>
                        <form action={moveProjectAction.bind(null, p.id, "down")}>
                          <button
                            type="submit"
                            disabled={i === projects.length - 1}
                            aria-label="Move down"
                            className="rounded border border-white/10 p-1 text-white/60 hover:border-white/30 hover:text-white disabled:opacity-30"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </form>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3 whitespace-nowrap">
                        <form action={toggleProjectFlagAction.bind(null, p.id, "published")}>
                          <button type="submit" className="text-xs font-medium text-white/70 hover:text-white hover:underline">
                            {p.published ? "Unpublish" : "Publish"}
                          </button>
                        </form>
                        <form action={toggleProjectFlagAction.bind(null, p.id, "featured")}>
                          <button type="submit" className="text-xs font-medium text-white/70 hover:text-white hover:underline">
                            {p.featured ? "Unfeature" : "Feature"}
                          </button>
                        </form>
                        <Link
                          href={`/admin/projects/${p.id}/edit`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                        >
                          <Pencil size={12} /> Edit
                        </Link>
                        <DeleteProjectDialog id={p.id} title={p.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
