import Image from "next/image";
import { hostname, cn } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectVisualProps {
  project: Project;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Screenshot when `project.image` is set (drop files in /public/images/projects),
 * otherwise a generated browser-window placeholder tinted by the project hue.
 */
export function ProjectVisual({ project, className, priority, sizes = "(min-width: 1024px) 50vw, 100vw" }: ProjectVisualProps) {
  const { hue, title, image, url, category } = project;
  const tint = `hsl(${hue} 80% 60%)`;
  return (
    <div
      className={cn("relative aspect-[16/10] w-full overflow-hidden border border-line bg-[#080b10]", className)}
      style={{ backgroundImage: `radial-gradient(80% 90% at 85% 0%, hsl(${hue} 70% 40% / 0.28), transparent 60%)` }}
    >
      {image ? (
        <Image
          src={image}
          alt={`${title} website screenshot`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-top"
        />
      ) : (
        <div role="img" aria-label={`${title} project preview (placeholder)`} className="absolute inset-0 p-[6%]">
          <div className="flex h-full flex-col border border-white/15 bg-[#0b0f14]/80">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
              <span className="h-2 w-2 rounded-full" style={{ background: tint }} />
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="ml-3 truncate font-mono text-[0.6rem] tracking-wide text-muted">
                {url ? hostname(url) : category === "qa" ? "test-report.local" : "preview"}
              </span>
            </div>
            <div className="grid flex-1 grid-cols-[1.4fr_1fr] gap-3 p-4">
              <div className="flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="block h-2 w-1/3" style={{ background: tint }} />
                  <span className="block h-5 w-[92%] bg-white/85" />
                  <span className="block h-5 w-[64%] bg-white/85" />
                </div>
                <div className="space-y-1.5">
                  <span className="block h-1.5 w-full bg-white/15" />
                  <span className="block h-1.5 w-4/5 bg-white/15" />
                  <span className="mt-3 block h-6 w-20 rounded-full" style={{ background: tint }} />
                </div>
              </div>
              <div className="relative border border-white/10" style={{ background: `linear-gradient(160deg, hsl(${hue} 70% 45% / 0.35), transparent 70%)` }}>
                <span className="absolute bottom-2 left-2 font-mono text-[0.55rem] text-white/60">{project.index}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
