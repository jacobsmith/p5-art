let img;
let saturationSlider;

function setup() {
  img = loadImage('fish.jpg');
  var w = window.innerWidth;
  var h = window.innerHeight;  
  canvas=createCanvas(w, h);

  pixelDensity(1);


  // capture = createCapture(VIDEO);
  // capture.hide();

  // saturationSlider = createSlider(0, 255, 100);
  // saturationSlider.position(50, 300);
  // saturationSlider.style('width', '80px')
}

let lastSaturationSliderValue = 0;

function draw() {
  // background(63, 191, 191);

  if (img) {
    if (lastSaturationSliderValue == 1) {
      return;
    }

    let updatedImage = createImage(img.width, img.height);
    updatedImage.loadPixels();
    img.loadPixels();
    console.log('updating image pixels');

    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < img.height; y++) {
        let loc = x + y * img.width;
        let pixel = img.pixels[loc];

          updatedImage.pixels[loc] = pixel;
        // if (saturation(img.pixels[loc]) > 30) {
        //   updatedImage.pixels[loc] = pixel;
        // } else {
        //   updatedImage.pixels[loc] = color('white');
        // }
      }
    }
    updatedImage.updatePixels();
    img.updatePixels();

    console.log('writing updated image')
    image(img, 0, 0, img.width, img.height);
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
  if (!img || img.width !== capture.width) {
    img = createImage(capture.width, capture.height);
  }
  img.copy(capture, 0, 0, capture.width, capture.height, 0, 0, img.width, img.height);
}