export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  /** Force compression even if image is within bounds */
  forceCompress?: boolean;
  /** Target file size in KB (will reduce quality to achieve) */
  targetSizeKB?: number;
}

/**
 * Read an image File into a data URL and compress it to JPEG/WebP.
 * ALWAYS compresses to reduce file size for faster loading.
 */
export async function readAndCompressImageFile(
  file: File,
  options?: ImageCompressionOptions,
): Promise<string> {
  const {
    maxWidth = 1280,
    maxHeight = 720,
    quality = 0.7, // Reduced default quality for smaller files
    forceCompress = true, // Always compress by default
    targetSizeKB = 300 // Target ~300KB per image
  } = options ?? {};

  const originalDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Unable to read image file"));
      }
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error("Failed to read image file"));
    };

    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));

    img.src = originalDataUrl;
  });

  const { width, height } = image;

  if (!width || !height) {
    return originalDataUrl;
  }

  const scale = Math.min(maxWidth / width, maxHeight / height, 1);

  // ALWAYS compress - even if within bounds (removes metadata, reduces quality)
  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    return originalDataUrl;
  }

  // Enable image smoothing for better quality when scaling
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  context.drawImage(image, 0, 0, targetWidth, targetHeight);

  // Try WebP first (smaller), fallback to JPEG
  let compressedDataUrl: string;
  let currentQuality = quality > 0 && quality <= 1 ? quality : 0.7;

  // Try to achieve target file size by reducing quality iteratively
  const maxAttempts = 5;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Try WebP format (30-50% smaller than JPEG)
    compressedDataUrl = canvas.toDataURL("image/webp", currentQuality);

    // If WebP not supported, fallback to JPEG
    if (compressedDataUrl.startsWith("data:image/webp") === false) {
      compressedDataUrl = canvas.toDataURL("image/jpeg", currentQuality);
    }

    // Estimate file size from base64 (base64 is ~33% larger than binary)
    const estimatedSizeKB = (compressedDataUrl.length * 0.75) / 1024;

    // If within target or quality too low, stop
    if (estimatedSizeKB <= targetSizeKB || currentQuality <= 0.4) {
      break;
    }

    // Reduce quality for next attempt
    currentQuality -= 0.1;
  }

  return compressedDataUrl!;
}

