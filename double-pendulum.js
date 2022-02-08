// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/093-double-pendulum.html
// https://youtu.be/uWzPe_S-RVE

let r1 = 125;
let r2 = 125;
let m1 = 10;
let m2 = 10;
let a1 = 0;
let a2 = 0;
let a1_v = 0;
let a2_v = 0;
let g = 0.5;

let px2 = -1;
let py2 = -1;
let cx, cy;

let buffer;

function setup() {
  r1 = random(120, 130);
  console.log(r1);

  var w = window.innerWidth;
  var h = window.innerHeight;  
  canvas=createCanvas(w, h);
  //Issue with wrong rendering on a retina Mac. See issue: https://github.com/CodingTrain/website/issues/574
  pixelDensity(1);
  a1 = PI / 2;
  a2 = PI / 2;
  cx = width / 2;
  cy = height / 2;
  buffer = createGraphics(width, height);
  buffer.background(0);
  buffer.translate(cx, cy);
}

let trail = [];

class Trail {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.createdAt = frameCount;
  }

  draw(nextPoint) {
    if (!nextPoint) { return; }

    let age = frameCount - this.createdAt;
    let alpha = map(age, 0, 500, 255, 0);
  
    let percentDecay = map(age, 0, 300, 0, 100);
    let red = map(percentDecay, 0, 100, 255, 0);
    let blue = map(percentDecay, 0, 100, 0, 255);
    let green = constrain(abs(50 - percentDecay) * 5, 0, 255);

    noFill();
    stroke(red, green, green, alpha);
    strokeWeight(2);
    line(this.x, this.y, nextPoint.x, nextPoint.y);
  }
}

function draw() {
  background(0);


  imageMode(CORNER);
  image(buffer, 0, 0, width, height);

  let num1 = -g * (2 * m1 + m2) * sin(a1);
  let num2 = -m2 * g * sin(a1 - 2 * a2);
  let num3 = -2 * sin(a1 - a2) * m2;
  let num4 = a2_v * a2_v * r2 + a1_v * a1_v * r1 * cos(a1 - a2);
  let den = r1 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
  let a1_a = (num1 + num2 + num3 * num4) / den;

  num1 = 2 * sin(a1 - a2);
  num2 = (a1_v * a1_v * r1 * (m1 + m2));
  num3 = g * (m1 + m2) * cos(a1);
  num4 = a2_v * a2_v * r2 * m2 * cos(a1 - a2);
  den = r2 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
  let a2_a = (num1 * (num2 + num3 + num4)) / den;

  translate(cx, cy);
  stroke(255);
  strokeWeight(2);

  let x1 = r1 * sin(a1);
  let y1 = r1 * cos(a1);

  let x2 = x1 + r2 * sin(a2);
  let y2 = y1 + r2 * cos(a2);

  // line(0, 0, x1, y1);
  // fill(255);
  // ellipse(x1, y1, m1, m1);

  // line(x1, y1, x2, y2);
  // fill(255);
  // ellipse(x2, y2, m2, m2);
 
  a1_v += a1_a;
  a2_v += a2_a;
  a1 += a1_v;
  a2 += a2_v;

  // a1_v *= 0.99;
  // a2_v *= 0.99;

  buffer.stroke(255);
  if (frameCount > 1) {
    trail.push(new Trail(x2, y2))
  }

  if (trail.length > 500) {
    trail.shift();
  }

  for (let i = 0; i < trail.length; i++) {
    let t = trail[i];
    t.draw(trail[i+1])
  }
  // for (const t of trail) {
  //   t.draw();
  // }

  px2 = x2;
  py2 = y2;
}