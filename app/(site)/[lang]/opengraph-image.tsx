import { ImageResponse } from "next/og";
import { defaultLocale, getDictionary, isLocale } from "@/lib/i18n";
import { site } from "@/lib/site";

// Lives under [lang] so it only applies to the public site (which sets
// metadataBase) and can be rendered in the visitor's language.
export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : defaultLocale);
  const [first, second, third] = dict.hero.words;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050505",
          color: "#F5F7FA",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#2DE2D0", letterSpacing: 6 }}>
          {`${site.name} — Portfolio`.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 150, fontWeight: 700, lineHeight: 0.95 }}>
          <span>{first}</span>
          <span style={{ color: "#2DE2D0" }}>{second}</span>
          <span>{third}</span>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#8B95A5" }}>{dict.meta.role}</div>
      </div>
    ),
    size,
  );
}
