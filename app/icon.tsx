import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          color: "#2DE2D0",
          fontSize: 30,
          fontWeight: 700,
          border: "3px solid #2DE2D0",
          borderRadius: 14,
          letterSpacing: -2,
        }}
      >
        NS
      </div>
    ),
    size,
  );
}
