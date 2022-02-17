import { extractDrawnImage } from "./meaningful-image.js";
import { QRPage } from "./p5-ar.js";

const ar = document.createElement('script');  
ar.src = "/ar.js"
document.head.appendChild(ar);

const num_fish = 20;

const fishes = [];

let capture;

const qrPage = new QRPage();
let fishMask;

window.setup = function() {
  console.log('in setup');
  var w = window.innerWidth;
  var h = window.innerHeight;  
  canvas=createCanvas(w, h);

  qrPage.setup(canvas);
  qrPage.debug(true);

  for (let i = 0; i < num_fish; i++) {
    fishes.push(new Fish());
  }
}

window.draw = function() {
  background(63, 191, 191);

  qrPage.draw();

  if (qrPage.foundImage) {
    let f = extractFish(qrPage);
    if (f) {
      image(f, 0, 0, f.width, f.height);
      fishes.push(new Fish(f));
    }
  }

  for (let fish of fishes) {
    fish.update();
    fish.draw();
  }
}

window.extractFish = function(qrPage) {
  const markers = qrPage.markers || [];
  let extractedFish = qrPage.foundImage;

  if (markers.length < 3) {
    return null;
  }

  let topRight = markers.find(m => m.id == 1);
  let bottomRight = markers.find(m => m.id == 2);
  let bottomLeft = markers.find(m => m.id == 3);
  let topLeft = markers.find(m => m.id == 4);

  let topRightY = topRight.corners[0].y;
  let bottomRightY = bottomRight.corners[0].y;

  let topRightX = topRight.corners[0].x;
  let bottomRightX = bottomRight.corners[0].x;

  let rightMidpointY = (topRightY + bottomRightY) / 2;
  let rightMidpointX = (topRightX + bottomRightX) / 2;
  
  let topLeftY = topLeft.corners[0].y;
  let bottomLeftY = bottomLeft.corners[0].y;

  let topLeftX = topLeft.corners[0].x;
  let bottomLeftX = bottomLeft.corners[0].x;

  let leftMidpointY = (topLeftY + bottomLeftY) / 2;
  let leftMidpointX = (topLeftX + bottomLeftX) / 2;


  let manipulableImage = createGraphics(extractedFish.width, extractedFish.height);
  manipulableImage.image(extractedFish, 0, 0, extractedFish.width, extractedFish.height);

  let fishWidth = topRightX - topLeftX;
  let fishHeight = bottomRightY - topRightY - 50;
  extractedFish = manipulableImage.get(topLeftX - 20  , topLeftY + 50, fishWidth, fishHeight); // diff of left and right here

  fishMask = createGraphics(fishWidth, fishHeight);
  fishMask.fill('rgba(0, 0, 0, 1)');
  fishMask.ellipse(((2 * fishWidth) / 3) - 40, (fishHeight / 2) - 30, fishWidth * 0.7, fishHeight * 0.65);
  fishMask.triangle(
    // midpoint of tail
    fishWidth * (1/3),
    ((fishHeight / 2) - 25),

    // top of tail
    0,
    (fishHeight / 2) - 80,

    // bottom of tail
    0,
    (fishHeight / 2) + 40,
  );

  extractedFish.mask(fishMask);

  qrPage.reset();
  return extractedFish;
}

window.keyPressed = function() {
  console.log('keyPressed');
  if (keyCode == 32) {
    qrPage.importPicture();
  }
}

class Fish {
  constructor(img) {
    this.x = random(0, window.innerWidth)
    this.y = random(0, window.innerHeight)
    this.xStep = random(1000);
    this.yStep = random(1000);
    this.xStepDelta = random(0.0005, 0.001);
    this.yStepDelta = random(0.0001, 0.0005);
    this.img = img;
    
    this.width = 160;
    this.height = 80;
  }

  update() {
    this.x = map(noise(this.xStep), 0, 1, 0, window.innerWidth);
    this.y = map(noise(this.yStep), 0, 1, 0, window.innerWidth);
    this.xStep += this.xStepDelta;
    this.yStep += this.yStepDelta;
  }

  draw() {
    if (this.img) {
      image(this.img, this.x, this.y, this.img.width * 0.5, this.img.height * 0.5);
    } else {
      // body
      fill(255);
      noStroke();
      ellipse(this.x, this.y, this.width, this.height);

      // eye
      stroke(0);
      fill(0);
      ellipse(this.x - this.width / 2 + 4, this.y - 4, 4, 4);
    }
  }
}