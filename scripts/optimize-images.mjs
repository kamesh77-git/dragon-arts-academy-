// Converts the source images in images/ to resized WebP copies under
// public/images/. The originals stay untouched; re-run after adding photos.
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "images";
const OUT = "public/images";

async function convertDir(dir) {
  const entries = await readdir(path.join(SRC, dir), { withFileTypes: true });
  await mkdir(path.join(OUT, dir), { recursive: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await convertDir(path.join(dir, entry.name));
      continue;
    }
    if (!/\.(png|jpe?g)$/i.test(entry.name)) continue;

    const input = path.join(SRC, dir, entry.name);
    const output = path.join(OUT, dir, entry.name.replace(/\.(png|jpe?g)$/i, ".webp"));
    const info = await sharp(input)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(output);
    console.log(`${output}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
  }
}

await convertDir("");
