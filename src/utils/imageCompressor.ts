/**
 * Utility to convert HEIC/HEIF images and compress/resize image files on the client side before uploading.
 * This prevents slow uploads, timeouts, unsupported formats (.heic), and Firestore size limit exceedances.
 */
export async function compressAndConvertImage(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.85
): Promise<File> {
  let activeFile = file;

  // 1. Handle HEIC / HEIF format conversion (common in Google Photos / iOS downloads)
  const isHeic =
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif") ||
    file.type === "image/heic" ||
    file.type === "image/heif";

  if (isHeic) {
    try {
      console.log(`HEIC/HEIF file detected: ${file.name}. Converting to JPEG...`);
      // Dynamic import heic2any to keep initial bundle size light
      const heic2anyModule = await import("heic2any");
      const heic2any = heic2anyModule.default;

      const converted = await heic2any({
        blob: activeFile,
        toType: "image/jpeg",
        quality: quality,
      });

      const jpegBlob = Array.isArray(converted) ? converted[0] : converted;
      const newName = file.name.replace(/\.(heic|heif)$/i, ".jpg");
      activeFile = new File([jpegBlob], newName, { type: "image/jpeg" });
      console.log(`Successfully converted ${file.name} to JPEG.`);
    } catch (err) {
      console.error("Failed to convert HEIC/HEIF image:", err);
      // Fallback: we will try to let it pass, but it might fail browser rendering.
    }
  }

  // If the file is not an image (or if conversion left us with non-image), return as-is
  if (!activeFile.type.startsWith("image/")) {
    return activeFile;
  }

  // 2. Client-side compression and resizing using Canvas
  // If the file is already small (e.g., < 250KB), we can skip canvas resizing to preserve exact quality
  if (activeFile.size < 250 * 1024 && !isHeic) {
    return activeFile;
  }

  return new Promise<File>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(activeFile);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions preserving aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(activeFile); // Fallback
            return;
          }

          // Draw image with smooth scaling
          ctx.drawImage(img, 0, 0, width, height);

          // Always compress to image/jpeg for excellent compression ratios on photos
          const outputType = "image/jpeg";

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(activeFile); // Fallback
                return;
              }

              // Create a new File object
              const compressedFile = new File([blob], activeFile.name.replace(/\.[^.]+$/, ".jpg"), {
                type: outputType,
                lastModified: Date.now(),
              });

              console.log(
                `Compressed ${activeFile.name}: ${(activeFile.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024).toFixed(2)}KB`
              );

              resolve(compressedFile);
            },
            outputType,
            quality
          );
        } catch (e) {
          console.error("Error drawing/compressing image on canvas:", e);
          resolve(activeFile); // Fallback
        }
      };
      img.onerror = (e) => {
        console.error("Error loading image object for compression:", e);
        resolve(activeFile); // Fallback
      };
    };
    reader.onerror = (e) => {
      console.error("Error reading file for compression:", e);
      resolve(activeFile); // Fallback
    };
  });
}
