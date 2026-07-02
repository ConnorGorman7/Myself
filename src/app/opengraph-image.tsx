import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Connor Gorman — AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0b0c",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "2px",
            background: "#39ff88",
            marginBottom: "40px",
            opacity: 0.4,
          }}
        />
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#e8efe9",
            lineHeight: 1,
            letterSpacing: "-1px",
          }}
        >
          Connor Gorman
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#39ff88",
            marginTop: 20,
            fontFamily: "monospace",
          }}
        >
          AI Engineer
        </div>
        <div
          style={{
            fontSize: 18,
            color: "#8a9590",
            marginTop: 16,
          }}
        >
          connorgorman.ca
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
