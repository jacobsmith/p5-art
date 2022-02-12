var p;
let trail = [];
let showPendulum = true;
let speed = 0.1;

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
  
    let percentDecay = map(age, 0, 500, 0, 100);

    let red = map(percentDecay, 0, 100, 255, 0);
    // let green = map(percentDecay, 0, 100, 0, 255);

    let blue;
    if (percentDecay < 50) {
      blue = map(percentDecay, 0, 50, 0, 255);
    } else {
      blue = map(percentDecay, 50, 100, 255, 0);
    }
    let green = constrain(abs(50 - percentDecay) * 3, 0, 255);

    noFill();
    stroke(red, blue, green, alpha);
    strokeWeight(8);
    line(this.x, this.y, nextPoint.x, nextPoint.y);
  }
}

function setup()  {

  var w = window.innerWidth;
  var h = window.innerHeight;  
  canvas=createCanvas(w, h);
  // Make a new Pendulum with an origin position and armlength
  p = new Pendulum(createVector(width/2,0),175);

}

function draw() {
  background(0);
  p.go();
}

function keyPressed() {
  if (keyCode == 32) {
    showPendulum = !showPendulum;
  } else if (keyCode == 38) {
    // up
    speed += 0.1;
  } else if (keyCode == 40) {
    // down
    speed -= 0.1;
  }

  if (speed < 0) {
    speed = 0;
  }

  if (speed > 3) {
    speed = 3;
  }
}

function Pendulum(origin_, r_) {
  // Fill all variables
  this.origin = origin_.copy();
  this.position = createVector();
  this.r = r_;
  this.angle = PI/4;

  this.aVelocity = 0.0;
  this.aAcceleration = 0.0;
  this.damping = 0.9999999;   // Arbitrary damping
  this.ballr = 4.0;      // Arbitrary ball radius

  this.go = function() {
    this.update();
    this.display();
  };

  // Function to update position
  this.update = function() {
    if (this.direction == 'down') {
      this.r += speed;
    } else {
      this.r -= speed;
    }

    if (this.r > (width / 2)) {
      this.direction = 'up'
    }

    if (this.r < (width / 8)) {
      this.direction = 'down'
    }
 
    var gravity = 0.4;                                               // Arbitrary constant
    this.aAcceleration = (-1 * gravity / this.r) * sin(this.angle);  // Calculate acceleration (see: http://www.myphysicslab.com/pendulum1.html)
    this.aVelocity += this.aAcceleration;                            // Increment velocity
    this.aVelocity *= this.damping;                                  // Arbitrary damping
    this.angle += this.aVelocity;                                    // Increment angle
  };

  this.display = function() {
    this.position.set(this.r*sin(this.angle), this.r*cos(this.angle), 0);         // Polar to cartesian conversion
    this.position.add(this.origin);                                               // Make sure the position is relative to the pendulum's origin

    if (frameCount > 1) {
      trail.push(new Trail(this.position.x, this.position.y))
    }
  
    if (trail.length > 500) {
      trail.shift();
    }

    for (let i = 0; i < trail.length; i++) {
      let t = trail[i];
      t.draw(trail[i+1])
    }


    if (showPendulum) {
      // Draw the arm
      stroke(255);
      strokeWeight(1);
      
      line(this.origin.x, this.origin.y, this.position.x, this.position.y);
      ellipseMode(CENTER);
      fill(255);
      // Draw the ball
      ellipse(this.position.x, this.position.y, this.ballr, this.ballr);

    }
  };
}