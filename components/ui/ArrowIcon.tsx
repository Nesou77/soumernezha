import { ArrowUpRight } from "lucide-react";

export function ArrowIcon({ size = 18 }: { size?: number }) {
  return <ArrowUpRight aria-hidden className="arrow shrink-0" size={size} strokeWidth={1.75} />;
}
