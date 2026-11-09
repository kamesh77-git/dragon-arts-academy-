import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Dragon Ryu Arts Academy — Multiple Arts in One Place, Mannivakkam, Chennai";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/images/logo.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 56, background: "linear-gradient(135deg,#062830,#0d9488)", color: "#fff" }}>
        <img src={src} width={320} height={320} alt="" style={{ borderRadius: 160 }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>Dragon Ryu</div>
          <div style={{ fontSize: 76, fontWeight: 700, color: "#f5c518", lineHeight: 1.1 }}>Arts Academy</div>
          <div style={{ fontSize: 34, marginTop: 24, opacity: 0.9 }}>Multiple Arts in One Place</div>
          <div style={{ fontSize: 28, marginTop: 8, opacity: 0.8 }}>Mannivakkam, Chennai</div>
        </div>
      </div>
    ),
    size
  );
}
