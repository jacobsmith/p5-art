const circles = [];
let maxAge = 100;
const NUM_CIRCLES = 10;
const MAX_WIDTH = 60;
let showColor = true;

function setup() {
  var w = window.innerWidth;
  var h = window.innerHeight;  
  canvas=createCanvas(w, h);

  for (i = 0; i < NUM_CIRCLES; i++) {
    circles.push(new Circle());
  }
}

function draw() {
  background(0)

  for (c of circles) {
    c.update();
    c.draw();
  }
}

class Circle {
  constructor() {
    this.setup();
  }

  setup() {
    this.x = random(MAX_WIDTH, width - MAX_WIDTH);
    this.y = random(MAX_WIDTH, height - MAX_WIDTH);
    this.r = random(5, MAX_WIDTH);
    this.age = random(-maxAge, 0);
  }

  update() {
    this.age += 1;
    this.r += random(0.2, 0.8);

    if (this.age > maxAge) {
      this.setup();
    }
  }

  draw() {
    if (this.age < 0) { return; }
    noFill();
    strokeWeight(map(this.age, 0, 100, 4, 0));
    
    const alpha = map(this.age, 0, 100, 255, 0, true);

    let circleColor = color(255, alpha);
    if (showColor) {
      circleColor = color(noise(this.x) * 255, noise(this.y) * 255, noise(this.r) * 255, alpha);
    }

    stroke(circleColor);
    ellipse(this.x, this.y, this.r, this.r);
  }
}

function keyPressed() {
  if (keyCode == 32) {
    showColor = !showColor;
  } else if (keyCode == 38) {
    // up
    maxAge += 10;
  } else if (keyCode == 40) {
    // down
    maxAge -= 10;
  }
}