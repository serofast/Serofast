/**
 * SeroFast Image Optimization Utility
 * Converts any image format (JPG, PNG, GIF, HEIC, AVIF, BMP, WebP) to high-efficiency WebP
 * preserving near-lossless clarity (quality: 0.92) while drastically reducing file payload.
 */

/**
 * Convert an image File, Blob, or URL to optimized WebP.
 * @param {File|Blob|string} imageSource - The source file or image URL.
 * @param {number} [quality=0.92] - Image quality ratio (0.1 to 1.0, default 0.92).
 * @param {number} [maxDimension=2048] - Max width or height constraint to prevent oversized uploads.
 * @returns {Promise<{ file: File, blob: Blob, dataUrl: string, width: number, height: number }>}
 */
export async function convertToWebP(imageSource, quality = 0.92, maxDimension = 2048) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    let objectUrl = null;

    if (imageSource instanceof File || imageSource instanceof Blob) {
      objectUrl = URL.createObjectURL(imageSource);
      img.src = objectUrl;
    } else if (typeof imageSource === "string") {
      img.crossOrigin = "anonymous";
      img.src = imageSource;
    } else {
      reject(new Error("Invalid image source provided for WebP conversion"));
      return;
    }

    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Downscale oversized images while preserving exact aspect ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) {
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          reject(new Error("Canvas context could not be created"));
          return;
        }

        // High fidelity rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }

        const dataUrl = canvas.toDataURL("image/webp", quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              // Fallback to dataUrl conversion if toBlob fails
              fetch(dataUrl)
                .then((res) => res.blob())
                .then((fallbackBlob) => {
                  const originalName = imageSource instanceof File ? imageSource.name : "asset";
                  const cleanName = originalName.replace(/\.[^/.]+$/, "") + ".webp";
                  const webpFile = new File([fallbackBlob], cleanName, {
                    type: "image/webp",
                    lastModified: Date.now(),
                  });
                  resolve({ file: webpFile, blob: fallbackBlob, dataUrl, width, height });
                })
                .catch(reject);
              return;
            }

            const originalName = imageSource instanceof File ? imageSource.name : "asset";
            const cleanName = originalName.replace(/\.[^/.]+$/, "") + ".webp";
            const webpFile = new File([blob], cleanName, {
              type: "image/webp",
              lastModified: Date.now(),
            });

            resolve({
              file: webpFile,
              blob,
              dataUrl,
              width,
              height,
            });
          },
          "image/webp",
          quality
        );
      } catch (err) {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    img.onerror = (err) => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not load image for WebP conversion"));
    };
  });
}

export default convertToWebP;
