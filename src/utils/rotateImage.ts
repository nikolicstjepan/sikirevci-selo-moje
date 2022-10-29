export default function rotateImage(file: File, degrees: number): Promise<Blob> {
  return new Promise((res, rej) => {
    try {
      // resizing the image
      const canvas = document.createElement("canvas");
      const image = document.createElement("img");
      const context = canvas.getContext("2d");

      image.src = URL.createObjectURL(file);

      image.addEventListener("load", () => {
        const newSize = determineSize(image.width, image.height, degrees);

        const canvasWidth = newSize.width;
        const canvasHeight = newSize.height;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        context?.save();

        if (degrees === 0) {
          context?.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        } else {
          context?.translate(canvas.width / 2, canvas.height / 2);
          context?.rotate((degrees * Math.PI) / 180);

          if (Math.abs(degrees) === 180) {
            context?.drawImage(image, -canvasWidth / 2, -canvasHeight / 2, canvasWidth, canvasHeight);
          } else {
            // 90 or 270 degrees (values for width and height are swapped for these rotation positions)
            context?.drawImage(image, -canvasHeight / 2, -canvasWidth / 2, canvasHeight, canvasWidth);
          }
        }

        // reducing the quality of the image
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // showing the compressed image
              res(blob);
            }
          },
          "image/jpeg",
          0.8
        );

        context?.restore();
      });
    } catch (error) {
      rej(error);
    }
  });
}

function determineSize(width: number, height: number, degrees: number) {
  let w, h;
  degrees = Math.abs(degrees);
  if (degrees === 90 || degrees === 270) {
    // values for width and height are swapped for these rotation positions
    w = height;
    h = width;
  } else {
    w = width;
    h = height;
  }

  return {
    width: w,
    height: h,
  };
}
