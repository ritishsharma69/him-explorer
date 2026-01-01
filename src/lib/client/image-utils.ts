export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Read an image File into a data URL and, if it is larger than the target
 * dimensions, downscale it into a JPEG data URL. Intended for use in
 * client-side admin forms before persisting imageUrl strings.
 */
export async function readAndCompressImageFile(
  file: File,
  options?: ImageCompressionOptions,
): Promise<string> {
  const { maxWidth = 1280, maxHeight = 720, quality = 0.8 } = options ?? {};

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

  // If the image is already within bounds, don't touch it.
  if (scale >= 1) {
    return originalDataUrl;
  }

  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    return originalDataUrl;
  }

  context.drawImage(image, 0, 0, targetWidth, targetHeight);

  const safeQuality = quality > 0 && quality <= 1 ? quality : 0.8;

  return canvas.toDataURL("image/jpeg", safeQuality);
}

