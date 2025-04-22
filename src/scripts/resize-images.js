import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFolder = path.join(__dirname, "../../public/images-original");
const outputFolder = path.join(__dirname, "../../public/images");

const sizes = [200, 400, 600, 800, 1200, 1400, 1600];

fs.readdirSync(inputFolder).forEach((file) => {
  const inputPath = path.join(inputFolder, file);
  const ext = path.extname(file);
  const name = path.basename(file, ext);

  sizes.forEach((size) => {
    const outputPath = path.join(outputFolder, `${name}-${size}${ext}`);
    sharp(inputPath)
      .resize({ width: size })
      .toFile(outputPath)
      .then(() => console.log(`Generated: ${outputPath}`))
      .catch((err) => console.error(`Error processing ${file}:`, err));
  });
});
