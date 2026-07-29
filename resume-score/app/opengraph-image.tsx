import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ResuNexx - AI Resume Analysis & Feedback";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px",
          color: "#f3f0e9",
          background: "#151515",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 28, fontWeight: 700 }}>
          <span style={{ border: "2px solid #d7ff4f", borderRadius: "999px", marginRight: 16, padding: "6px 13px" }}>R</span>
          ResuNexx
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#d7ff4f", fontSize: 21, fontWeight: 700, letterSpacing: 4 }}>RESUME INTELLIGENCE</div>
          <div style={{ marginTop: 24, fontSize: 84, fontWeight: 700, lineHeight: 0.92, letterSpacing: -4 }}>
            See what recruiters see.
          </div>
          <div style={{ marginTop: 30, color: "#d8d4cb", fontSize: 28 }}>
            AI resume analysis and feedback for early-career job seekers.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#ff5a36", fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>
          <span>FREE RESUME SIGNAL CHECK</span>
          <span>PDF / DOCX</span>
        </div>
      </div>
    ),
    size
  );
}
