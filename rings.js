let hue;
const rings = [];

function setup () {
  createCanvas(windowWidth, windowHeight);

  hue = random(0, 360);
  const count = floor(random(10, 20));
  for (let i = 0; i < count; i++) {
    const diameter = ((i + 1) / count);
    const arcLength = random(PI * 0.05, PI * 2);
    const arcAngle = random(-PI * 2, PI * 2);
    const spinSpeed = random(-.05, .05);
    const ringColor = color(random(0, 255), random(0, 255), random(0, 255))
    rings.push({
      spinSpeed,
      diameter,
      arcLength,
      arcAngle,
      ringColor,
    });
  }
}

function windowResized () {
  resizeCanvas(windowWidth, windowHeight);
}

function draw () {
  background(0);

  const minDim = Math.min(width, height);
  
  noFill();
  strokeWeight(minDim * 0.015 * 0.8);
  strokeCap(ROUND);
  stroke(255);

  let d = minDim;
  d -= d * 0.25;
  
  for (let i = 0; i < rings.length; i++) {
    const {
      diameter,
      arcLength,
      arcAngle,
      spinSpeed,
      ringColor,
    } = rings[i];
    const spin = millis() / 1000 * spinSpeed;
    stroke(ringColor);
    arc(
      width / 2,
      height / 2,
      diameter * d,
      diameter * d,
      spin + arcAngle,
      spin + arcAngle + Math.PI * arcLength
    );
  }
}
