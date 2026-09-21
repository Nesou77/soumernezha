import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <div className="container-x flex flex-col justify-between gap-3 font-mono text-xs uppercase tracking-[0.14em] text-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p>Designed &amp; built in {site.location.split(",")[0]}</p>
        <p>Build · Test · Perfect</p>
      </div>
    </footer>
  );
}
