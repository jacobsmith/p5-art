const num_fish = 20;

const fishes = [];

function setup() {
  var w = window.innerWidth;
  var h = window.innerHeight;  
  canvas=createCanvas(w, h);

  capture = createCapture(VIDEO);
  capture.hide();

  for (let i = 0; i < num_fish; i++) {
    fishes.push(new Fish());
  }
}

function draw() {
  background(63, 191, 191);

  for (fish of fishes) {
    fish.update();
    fish.draw();
  }
}

function keyPressed() {
  if (keyCode == 32) {
    importPicture();
  }
}

function importPicture() {
  let img;
  // The capture element is initially smaller than it should be
  if (!img || img.width !== capture.width) {
    img = createImage(capture.width, capture.height);
  }
  img.copy(capture, 0, 0, capture.width, capture.height, 0, 0, img.width, img.height);
  fishes.push(new Fish(img));
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
      image(this.img, this.x, this.y, this.width, this.width);
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