// Recreating Sol LeWitt Wall Drawing #130
// "Grid and arcs from four corners."

// Create a new canvas to the browser size
function setup () {
  createCanvas(windowWidth, windowHeight);
}

// On window resize, update the canvas size
function windowResized () {
  resizeCanvas(windowWidth, windowHeight);
}

// Render loop that draws shapes with p5
function draw(){
  // Black background
  background(0);
  
  // We will use some relative units
  const minRadius = min(width, height);
  const maxRadius = max(width, height);

  // Choose a line thickness for all lines
  const thickness = minRadius * 0.005;
  
  // Choose a spacing for the grid
  const spacing = minRadius * 0.125;
  
  // Compute the # of lines needed to fill the space
  const lineCount = floor(maxRadius / (thickness + spacing));
  
  // We can compute the size of each square in the grid like so
  const squareSize = width / (lineCount - 1);

  strokeWeight(thickness);
  stroke(255);
  noFill();
  
  // Draw the grid first
  for (let i = 0; i < lineCount; i++) {
    // Get a t value to map the value from one range to another
    const t = lineCount <= 1 ? 0.5 : i / (lineCount - 1);
    
    // Map it to pixels but keep the line thickness in mind
    // so that it fits entirely within the canvas
    const y = lerp(thickness / 2, height - thickness / 2, t);
    const x = lerp(thickness / 2, width - thickness / 2, t);
    line(0, y, width, y);
    line(x, 0, x, height);
  }
  
  
  // Which corners to use for arcs
  const corners = [
    // Top left
    [ 0, 0 ],
    // Bottom right
    [ width, height ],
    // Top right
    [ width, 0 ],
    // Bottom left
    [ 0, height ],
    // Can also emit arcs from center
    // This is not in Sol LeWitt's instructions,
    // but it does appear on the final wall drawing
    [ width / 2, height / 2 ]
  ];
  
  // Draw arcs from each corner
  corners.forEach(corner => {
    const [ cx, cy ] = corner;

    // Draw the arcs
    for (let i = 0; i < lineCount; i++) {
      // We can choose how many rings will fit in each square 
      const ringsPerSquare = 2;

      // Get the radius of each circle, making
      // sure to avoid (i=0) as it would not draw anything
      const r = (i + 1) * (squareSize / ringsPerSquare);
      
      // Scale radius by 2 to get diameter, and draw circle
      circle(cx, cy, r * 2);
    }
  });
}
