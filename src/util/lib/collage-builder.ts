import sharp from "sharp";
import axios from "axios";
import path from "path";
import fs from "fs/promises";

type ImageSource = string | Buffer;

interface CollageOptions {
  size?: { width: number; height: number };
  layout?: { cols: number; rows: number };
  spacing?: number;
  backgroundColor?: { r: number; g: number; b: number; alpha: number };
}

export async function createCollage(
  images: ImageSource[],
  options: CollageOptions = {}
): Promise<string> {
  if (!images || images.length === 0) {
    throw new Error("At least one image must be provided");
  }

  const {
    size = { width: 200, height: 200 },
    layout,
    spacing = 0,
    backgroundColor = { r: 255, g: 255, b: 255, alpha: 0 },
  } = options;

  const totalImages = images.length;
  const cols = layout?.cols ?? Math.ceil(Math.sqrt(totalImages));
  const rows = layout?.rows ?? Math.ceil(totalImages / cols);

  const maxImages = cols * rows;
  const imagesToProcess = images.slice(0, maxImages);

  try {
    const processedImages = await Promise.all(
      imagesToProcess.map(async (img, index) => {
        try {
          const buffer = await loadImageBuffer(img, index);
          return await sharp(buffer)
            .resize(size.width, size.height, { fit: "cover" })
            .toBuffer();
        } catch (err) {
          console.warn(`Image ${index + 1} failed:`, err);
          return createPlaceholder(
            size.width,
            size.height,
            `Error #${index + 1}`
          );
        }
      })
    );

    const totalWidth = cols * size.width + (cols - 1) * spacing;
    const totalHeight = rows * size.height + (rows - 1) * spacing;

    const emptySlot = await createPlaceholder(size.width, size.height);

    const compositeInputs = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = row * cols + col;
        const img = processedImages[i] || emptySlot;

        compositeInputs.push({
          input: img,
          top: row * (size.height + spacing),
          left: col * (size.width + spacing),
        });
      }
    }

    const collageBuffer = await sharp({
      create: {
        width: totalWidth,
        height: totalHeight,
        channels: 4,
        background: backgroundColor,
      },
    })
      .composite(compositeInputs)
      .png()
      .toBuffer();

    return `data:image/png;base64,${collageBuffer.toString("base64")}`;
  } catch (err) {
    console.error("Collage generation failed:", err);
    return createFallbackDataUrl(
      Math.max(size.width * cols, 200),
      Math.max(size.height * rows, 200)
    );
  }
}

async function loadImageBuffer(
  image: ImageSource,
  index: number,
  retries = 2
): Promise<Buffer> {
  if (Buffer.isBuffer(image)) return image;

  if (typeof image === "string") {
    if (image.startsWith("http://") || image.startsWith("https://")) {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const response = await axios.get(image, {
            responseType: "arraybuffer",
            timeout: 5000,
          });
          return Buffer.from(response.data);
        } catch (err) {
          if (attempt === retries) throw err;
        }
      }
    } else {
      const resolvedPath = image.startsWith("/")
        ? image
        : path.join(process.cwd(), image);
      return await fs.readFile(resolvedPath);
    }
  }

  throw new Error(`Unsupported image format at index ${index}`);
}

async function createPlaceholder(
  width: number,
  height: number,
  text = ""
): Promise<Buffer> {
  const safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" font-family="sans-serif" font-size="14"
        text-anchor="middle" fill="#888" dy=".3em">${safeText}</text>
    </svg>
  `;

  return await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 240, g: 240, b: 240, alpha: 1 },
    },
  })
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toBuffer();
}

async function createFallbackDataUrl(
  width: number,
  height: number
): Promise<string> {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" font-family="sans-serif" font-size="16"
            text-anchor="middle" fill="#888" dy=".3em">Image Placeholder</text>
    </svg>
  `;

  try {
    const buffer = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 240, g: 240, b: 240, alpha: 1 },
      },
    })
      .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
      .png()
      .toBuffer();

    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch {
    return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  }
}
