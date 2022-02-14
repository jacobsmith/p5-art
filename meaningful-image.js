let img;

// function setup() {
//   var w = window.innerWidth;
//   var h = window.innerHeight;  
//   canvas=createCanvas(w, h);

//   pixelDensity(1);

//   capture = createCapture(VIDEO);
//   capture.hide();
// }

// function draw() {
//   background(0);

//   let updatedImage = createImage(capture.width, capture.height);
//   let trueVideo = createImage(capture.width, capture.height)
//   trueVideo.copy(capture, 0, 0, capture.width, capture.height, 0, 0, capture.width, capture.height);

//   trueVideo.loadPixels();
//   updatedImage.loadPixels();
//   capture.loadPixels();

//   const filteredImage = apply_sobel_filter(capture);
//   image(filteredImage, updatedImage.width, 0, updatedImage.width, updatedImage.height);

//   updatedImage = blurImage(trueVideo, filteredImage, updatedImage, capture)
//   updatedImage.updatePixels();

//   image(updatedImage, 0, 0, updatedImage.width, updatedImage.height);
//   image(trueVideo, 0, updatedImage.height, updatedImage.width, updatedImage.height);
// }

export function extractDrawnImage(video) {
  let updatedImage = createImage(video.width, video.height);
  let trueVideo = createImage(video.width, video.height)
  trueVideo.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);

  trueVideo.loadPixels();
  updatedImage.loadPixels();
  video.loadPixels();

  const filteredImage = apply_sobel_filter(video);
  // image(filteredImage, updatedImage.width, 0, updatedImage.width, updatedImage.height);

  updatedImage = blurImage(trueVideo, filteredImage, updatedImage, video)
  updatedImage.updatePixels();

  // image(updatedImage, 0, 0, updatedImage.width, updatedImage.height);
  // image(trueVideo, 0, updatedImage.height, updatedImage.width, updatedImage.height);

  return updatedImage;
}

function isEnclosed(filteredImage, x, y) {
  // check if white above
  // check if white below
  // check if white left
  // check if white right

  let hitUp, hitDown, hitLeft, hitRight = false;

  for (let checkY = y; checkY < filteredImage.height; checkY++ ) {
    let index = (x + checkY * filteredImage.width) * 4

    const r = filteredImage.pixels[index + 0];
    const g = filteredImage.pixels[index + 1];
    const b = filteredImage.pixels[index + 2];

    if ((r + g + b) / 3 > 200) {
      hitUp = true;
    }
  }
  
  for (let checkY = y; checkY > 0; checkY-- ) {
    let index = (x + checkY * filteredImage.width) * 4

    const r = filteredImage.pixels[index + 0];
    const g = filteredImage.pixels[index + 1];
    const b = filteredImage.pixels[index + 2];

    if ((r + g + b) / 3 > 200) {
      hitDown = true;
    }
  }
  
  for (let checkX = x; checkX > 0; checkX-- ) {
    let index = (checkX + y * filteredImage.width) * 4

    const r = filteredImage.pixels[index + 0];
    const g = filteredImage.pixels[index + 1];
    const b = filteredImage.pixels[index + 2];

    if ((r + g + b) / 3 > 200) {
      hitLeft = true;
    }
  }
  
  for (let checkX = x; checkX < filteredImage.width; checkX++ ) {
    let index = (checkX + y * filteredImage.width) * 4

    const r = filteredImage.pixels[index + 0];
    const g = filteredImage.pixels[index + 1];
    const b = filteredImage.pixels[index + 2];

    if ((r + g + b) / 3 > 200) {
      hitRight = true;
    }
  }

  return hitDown && hitUp && hitLeft && hitRight;

  return false;
}

function keyPressed() {
  if (keyCode == 32) {
    importPicture();
  }
}

function importPicture() {
  // The capture element is initially smaller than it should be
  if (!capture || capture.width !== capture.width) {
    capture = createImage(capture.width, capture.height);
  }
  capture.copy(capture, 0, 0, capture.width, capture.height, 0, 0, capture.width, capture.height);
}

function getPotentialImage(capture, updatedImage) {
    for (let x = 0; x < capture.width; x++) {
      for (let y = 0; y < capture.height; y++) {
        let index = (x + y * capture.width) * 4

        const r = capture.pixels[index];
        const g = capture.pixels[index + 1];
        const b = capture.pixels[index + 2];
        // let pixel = capture.pixels[loc];

        const bright = (r + g + b) / 3;

        if (150 < bright && bright < 220) {
          updatedImage.pixels[index] = r;
          updatedImage.pixels[index + 1] = g;
          updatedImage.pixels[index + 2] = b;
          updatedImage.pixels[index + 3] = 255;
        } else {
          updatedImage.pixels[index] = 0;
          updatedImage.pixels[index + 1] = 0;
          updatedImage.pixels[index + 2] = 0;
          updatedImage.pixels[index + 3] = 0;
        }
      }
    }
  
    updatedImage.updatePixels();
    return updatedImage;
}


// Prewitt
var xKernel = [
  [-1, 0, 1],
  [-1, 0, 1],
  [-1, 0, 1]
];
var yKernel = [
  [-1, -1, -1],
  [0, 0, 0],
  [1, 1, 1]
];

// Sobel
// var xKernel = [
//   [1, 0, -1],
//   [2, 0, -2],
//   [1, 0, -1]
// ];
// var yKernel = [
//   [1, 2, 1],
//   [0, 0, 0],
//   [-1, -2, -1]
// ];

function apply_sobel_filter(img) {
  img.loadPixels();
  var n = img.width * img.height;
  var sobel_array = new Uint32Array(n);

  // compute the gradient in soble_array
  var index;
  var x, y;
  var xk, yk;
  var xGradient, xMultiplier;
  var yGradient, yMultiplier;
  var pixelValue;
  for (x = 1; x < img.width - 1; x++) {
    for (y = 1; y < img.height- 1; y++) {
      let i = x + y * img.width;
      xGradient = 0;
      yGradient = 0;
      for (xk = -1; xk <= 1; xk ++) {
        for (yk = -1; yk <= 1; yk ++) {
          pixelValue = img.pixels[4 * ((x + xk) + (y + yk) * img.width)];
          xGradient += pixelValue * xKernel[yk + 1][xk + 1];
          yGradient += pixelValue * yKernel[yk + 1][xk + 1];
        }
      }
      sobel_array[i] = Math.sqrt(
        Math.pow(xGradient, 2) + Math.pow(yGradient, 2)
      );
    }
  }

  // copy sobel_array to image pixels;
  for (x = 0; x < img.width; x++) {
    for (y = 0; y < img.height; y++) {
      let i = x + y * img.width;
      img.pixels[4 * i] = sobel_array[i];
      img.pixels[4 * i + 1] = sobel_array[i];
      img.pixels[4 * i + 2] = sobel_array[i];
    }
  }
  img.updatePixels();
  return img;
}

function blurImage(trueVideo, filteredImage, updatedImage, capture) {
    // get a "blur" of pixels - if above a threshold, they all get to be included
    const kernel = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    
    for (let x = 0; x < filteredImage.width; x++) {
      for (let y = 0; y < filteredImage.height; y++) {
        let index = (x + y * capture.width) * 4

        let sum = 0;

        // kx, ky variables for iterating over the kernel
        // kx, ky have three different values: -1, 0, 1
        for (let kx = -1; kx <= 1; kx++) {
          for (let ky = -1; ky <= 1; ky++) {
            // since our image is grayscale, 
            // RGB values are identical
            // we retrieve the red value for this example 
            // (green and blue work as well)
    
            const r = filteredImage.pixels[index];
            const g = filteredImage.pixels[index + 1];
            const b = filteredImage.pixels[index + 2];

            let val = (r + g + b);

            // accumulate the  kernel sum
            // kernel is a 3x3 matrix
            // kx and ky have values -1, 0, 1
            // if we add 1 to kx and ky, we get 0, 1, 2
            // with that we can use it to iterate over kernel
            // and calculate the accumulated sum
            sum += kernel[kx+1][ky+1] * val;
          }
        }

        if (((sum / 9) > 128) || isEnclosed(filteredImage, x, y)) {
          updatedImage.pixels[index + 0] = trueVideo.pixels[index + 0];
          updatedImage.pixels[index + 1] = trueVideo.pixels[index + 1];
          updatedImage.pixels[index + 2] = trueVideo.pixels[index + 2];
          updatedImage.pixels[index + 3] = 255;
        } else {
          updatedImage.pixels[index + 0] = capture.pixels[index + 0];
          updatedImage.pixels[index + 1] = capture.pixels[index + 1];
          updatedImage.pixels[index + 2] = capture.pixels[index + 2];
          updatedImage.pixels[index + 3] = 0;
        }
      }
    }

  return updatedImage;
}