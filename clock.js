let cx, cy;
let secondsRadius;
let minutesRadius;
let hoursRadius;
let clockDiameter;

function setup() {
  var w = window.innerWidth;
  var h = window.innerHeight;  
  canvas=createCanvas(w, h);
  stroke(255);

  let radius = (min(width, height) / 2) * 0.8;
  secondsRadius = radius * 0.65;
  minutesRadius = radius * 0.6;
  hoursRadius = radius * 0.5;
  clockDiameter = radius * 1.7;

  cx = width / 2;
  cy = height / 2;
}

function drawText(str, x, y) {
  textFont('Verdana')
  fill(255);
  textSize(52);
  text(str, x - 20, y + 20);
}

function draw() {
  background(0);

  // Draw the clock background
  noStroke();
  fill(255, 255, 255, 128);
  ellipse(cx, cy, clockDiameter + 10, clockDiameter + 10);
  fill(150, 115, 38);
  ellipse(cx, cy, clockDiameter, clockDiameter);

  // Angles for sin() and cos() start at 3 o'clock;
  // subtract HALF_PI to make them start at the top

  // get smooth motion of secondhand
  let milliseconds = new Date().getMilliseconds();
  let msOffset = map(milliseconds, 0, 1000, 0, HALF_PI / 15);

  let s = map(second(), 0, 60, 0, TWO_PI) - HALF_PI + msOffset;
  let m = map(minute() + norm(second(), 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
  let h = map(hour() + norm(minute(), 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;

  // Draw the hands of the clock
  stroke(255);
  strokeWeight(1);
  line(cx, cy, cx + cos(s) * secondsRadius * 0.8, cy + sin(s) * secondsRadius * 0.8);
  strokeWeight(4);
  line(cx, cy, cx + cos(m) * minutesRadius, cy + sin(m) * minutesRadius);
  strokeWeight(6);
  line(cx, cy, cx + cos(h) * hoursRadius, cy + sin(h) * hoursRadius);

  // Draw the minute ticks
  strokeWeight(2);
  beginShape(POINTS);
  for (let a = 0; a < 360; a += 30) {
    let angle = radians(a);
    let x = cx + cos(angle) * secondsRadius;
    let y = cy + sin(angle) * secondsRadius;

    if (a == 0) {
      drawText('3', x, y)
    } else if (a == 90) {
      drawText('6', x, y)
    } else if (a == 180) {
      drawText('9', x, y)
    } else if (a == 270) {
      drawText('12', x, y)
    } else {
      circle(x, y, 8);
    }
  }
  endShape();
}
