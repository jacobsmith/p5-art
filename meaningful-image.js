let img;
let saturationSlider;

function setup() {
  img = loadImage('fish.jpg');
  var w = window.innerWidth;
  var h = window.innerHeight;  
  canvas=createCanvas(w, h);

  pixelDensity(1);

  capture = createCapture(VIDEO);
  capture.hide();

  // saturationSlider = createSlider(0, 255, 100);
  // saturationSlider.position(50, 300);
  // saturationSlider.style('width', '80px')
}

let lastSaturationSliderValue = 0;

let lastX, lastY;

function draw() {
  background(0);

  if (mouseX !== lastX && mouseY !== lastY) {
    console.log(capture.get(mouseX, mouseY));
    lastX = mouseX;
    lastY = mouseY;
  }

  if (img) {
    let updatedImage = createImage(capture.width, capture.height);
    let trueVideo = createImage(capture.width, capture.height)
    trueVideo.copy(capture, 0, 0, capture.width, capture.height, 0, 0, capture.width, capture.height);

    trueVideo.loadPixels();
    updatedImage.loadPixels();
    capture.loadPixels();
   
    // updatedImage = getPotentialImage(capture, updatedImage);

    const filteredImage = apply_sobel_filter(capture);
    image(filteredImage, updatedImage.width, 0, updatedImage.width, updatedImage.height);

    // filteredImage.loadPixels();


    
    for (let x = 0; x < filteredImage.width; x++) {
      for (let y = 0; y < filteredImage.height; y++) {
        let index = (x + y * capture.width) * 4

        const r = filteredImage.pixels[index];
        const g = filteredImage.pixels[index + 1];
        const b = filteredImage.pixels[index + 2];

        if (((r + g + b) / 3) > 25) {
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

    updatedImage.updatePixels();
    
    image(updatedImage, 0, 0, updatedImage.width, updatedImage.height);
    image(trueVideo, 0, updatedImage.height, updatedImage.width, updatedImage.height);
    lastSaturationSliderValue = 1;
  }
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
      i = x + y * img.width;
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
      i = x + y * img.width;
      img.pixels[4 * i] = sobel_array[i];
      img.pixels[4 * i + 1] = sobel_array[i];
      img.pixels[4 * i + 2] = sobel_array[i];
    }
  }
  img.updatePixels();
  return img;
}