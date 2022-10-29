const MAX_WIDTH = 2048;

export default function compressImage(file: File, quality: number, maxWidth: number = MAX_WIDTH): Promise<Blob> {
  return new Promise((res, rej) => {
    try {
      // resizing the image
      const canvas = document.createElement("canvas");
      const image = document.createElement("img");
      const context = canvas.getContext("2d");

      image.src = URL.createObjectURL(file);

      image.addEventListener("load", () => {
        const originalWidth = image.width;
        const originalHeight = image.height;

        let resizingFactor = 1;

        if (originalWidth > maxWidth) {
          resizingFactor = maxWidth / originalWidth;
        }

        const canvasWidth = originalWidth * resizingFactor;
        const canvasHeight = originalHeight * resizingFactor;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        context?.drawImage(image, 0, 0, canvasWidth, canvasHeight);

        // reducing the quality of the image
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // showing the compressed image
              res(blob);
            }
          },
          "image/jpeg",
          quality
        );
      });
    } catch (error) {
      rej(error);
    }
  });
}
