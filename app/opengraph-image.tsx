import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          NEZHA SOUMER — MARRAKECH
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 150, fontWeight: 700, lineHeight: 0.95 }}>
          <span>BUILD.</span>
          <span style={{ color: "#2DE2D0" }}>TEST.</span>
          <span>PERFECT.</span>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#8B95A5" }}>{site.role}</div>
      </div>
    ),
    size,
  );
}
