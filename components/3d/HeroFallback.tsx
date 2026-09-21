/** Pure CSS stand-in used when WebGL is unavailable. */
export function HeroFallback() {
  const panels = [
    { l: "58%", t: "22%", r: -18, d: 0, label: "BUILD" },
    { l: "70%", t: "44%", r: 14, d: 1, label: "TEST" },
    { l: "52%", t: "56%", r: -8, d: 2, label: "PASS" },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden [perspective:900px]">
      <div className="absolute left-[64%] top-[42%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-accent/60 bg-accent/5" />
      {panels.map((p) => (
        <div
          key={p.label}
          className="absolute h-28 w-44 border border-white/20 bg-[#0c141a]/70"
          style={{ left: p.l, top: p.t, transform: `rotateY(${p.r}deg) translateZ(${p.d * 20}px)` }}
        >
          <div className="h-3 border-b border-white/15 bg-accent/15" />
          <span className="m-3 inline-block font-mono text-[10px] tracking-[0.2em] text-accent">{p.label}</span>
        </div>
      ))}
    </div>
  );
}
