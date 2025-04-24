let dotRotation1 = 0;
let rotating1 = false;
let dotRotation4 = 0;
let rotating4 = false;
let sound1, sound4;

function preload() {
  sound1 = loadSound('water.mp3'); // Replace with actual file
  sound4 = loadSound('water.mp3'); // Replace with actual file
}

function setup() {
  createCanvas(800, 400);
  background(128, 0, 0);
  smooth();
}

function draw() {
  let cols = 2;
  let rows = 1;
  let tileW = width / cols;
  let tileH = height / rows;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let xOffset = i * tileW;
      let yOffset = j * tileH;
      drawTile(xOffset, yOffset, tileW, tileH);
    }
  }
}

function drawTile(x, y, w, h) {
  let cellW = w / 2;
  let cellH = h / 2;

  let inSketch1 = mouseX > x && mouseX < x + cellW && mouseY > y && mouseY < y + cellH;
  let inSketch4 = mouseX > x + cellW && mouseX < x + w && mouseY > y + cellH && mouseY < y + h;

  if (inSketch1 && !rotating1) {
    rotating1 = true;
    if (!sound1.isPlaying()) sound1.play();
  } else if (!inSketch1) {
    rotating1 = false;
  }

  if (inSketch4 && !rotating4) {
    rotating4 = true;
    if (!sound4.isPlaying()) sound4.play();
  } else if (!inSketch4) {
    rotating4 = false;
  }

  if (rotating1) dotRotation1 += 0.1;
  if (rotating4) dotRotation4 += 0.05;

  drawSketch1(x, y, cellW, cellH);
  drawShrunkenSketch2(x + cellW, y, cellW, cellH);
  drawShrunkenSketch2(x, y + cellH, cellW, cellH);
  drawSketch4(x + cellW, y + cellH, cellW, cellH);
}


function drawSketch4(x, y, w, h) {
  push();
  translate(x + w / 2, y + h / 2);

  let r = min(w, h) * 0.125; // Half the previous size

  let positions = [
    [-r, -r], [r, -r], // Top two circles
    [-r, r], [r, r]  // Bottom two circles
  ];

  for (let pos of positions) {
    let [px, py] = pos;

    // Black circle
    fill(0);
    stroke(255);
    strokeWeight(3);
    ellipse(px, py, r * 2);

    // Concentric White Circle
    fill(255);
    noStroke();
    ellipse(px, py, r * 0.6);

    // White Dots Inside Each Black Circle
    let dotCount = 8;
    let dotRadius = r * 0.6; // Positioned inside the black circle
    fill(255);
    for (let i = 0; i < dotCount; i++) {
      let angle = TWO_PI * (i / dotCount) + dotRotation4;
      let dx = px + cos(angle) * dotRadius;
      let dy = py + sin(angle) * dotRadius;
      ellipse(dx, dy, r * 0.2);
    }
  }

  // Static dotted circular border
  let borderSize = r * 3.2; // Adjust size for proper fit
  let dotCount = 36; // Number of dots in the border
  fill(255);
  noStroke();
  for (let i = 0; i < dotCount; i++) {
    let angle = TWO_PI * (i / dotCount);
    let px = cos(angle) * borderSize;
    let py = sin(angle) * borderSize;
    ellipse(px, py, 10); // Dots forming the border
  }

  pop();
}

function drawSketch1(x, y, w, h) {
  push();
  translate(x + w / 2, y + h / 2);

  let r = min(w, h) * 0.35; // Circle size based on cell
  noStroke();

  // Black Circle
  fill(0);
  stroke(255);
  strokeWeight(5);
  ellipse(0, 0, r * 2);

  // Dotted White Border (inside the black circle)
  let dotCount = 36;
  let borderR = r * 0.8;
  fill(255);
  for (let i = 0; i < dotCount; i++) {
    let angle = TWO_PI * (i / dotCount) + dotRotation1;
    let px = cos(angle) * borderR;
    let py = sin(angle) * borderR;
    ellipse(px, py, 5);
  }

  // Concentric White Ring (after the dotted border)
  stroke(255);
  noFill();
  strokeWeight(10);
  let ringR = borderR * 1.4;
  ellipse(0, 0, ringR);

  // Central Small White Circle
  fill(255);
  noStroke();
  let centerDotSize = r * 0.3;
  ellipse(0, 0, centerDotSize);

  // Teardrop Shapes (8 petals inside the inner ring)
  let petalCount = 8;
  let petalDist = ringR * 0.3;
  let petalWidth = 10;
  let petalHeight = 30;

  fill(255);
  for (let i = 0; i < petalCount; i++) {
    let angle = TWO_PI * (i / petalCount);
    let px = cos(angle) * petalDist;
    let py = sin(angle) * petalDist;

    push();
    translate(px, py);
    rotate(angle);
    ellipse(0, 0, petalWidth, petalHeight);
    pop();
  }

  // Zigzag Border Outside the Black Circle
  let zigzagCount = 36; // Number of spikes
  let zigzagOuterR = r * 1.2; // Outer radius
  let zigzagInnerR = r * 1.05; // Inner radius

  stroke(255); // Keep zigzag border unchanged
  strokeWeight(4); // Increase stroke weight to prevent disappearance
  noFill();
  beginShape();
  for (let i = 0; i <= zigzagCount; i++) {
    let angle = TWO_PI * (i / zigzagCount);
    let px = cos(angle) * (i % 2 == 0 ? zigzagOuterR : zigzagInnerR);
    let py = sin(angle) * (i % 2 == 0 ? zigzagOuterR : zigzagInnerR);
    vertex(px, py);
  }
  endShape(CLOSE);

  pop();
}




function drawSketch2(x, y, w, h) {
  push();
  translate(x + w / 2, y + h / 2);

  let flowerSize = min(w, h) * 0.3;
  let petalWidth = flowerSize * 0.8;
  let petalHeight = flowerSize;

  fill(0);
  for (let i = 0; i < 4; i++) {
    let angle = HALF_PI * i;
    push();
    rotate(angle);
    ellipse(0, -flowerSize * 0.25, petalWidth, petalHeight);
    pop();
  }

  fill(255);
  ellipse(0, 0, flowerSize * 0.3);

  let diamondSizeX = flowerSize * 0.2;
  let diamondSizeY = flowerSize * 0.6;
  let diamondDist = flowerSize * 1.1;

  fill(0);
  stroke(255);
  strokeWeight(2);
  for (let i = 0; i < 4; i++) {
    let angle = QUARTER_PI + HALF_PI * i;
    let px = cos(angle) * diamondDist;
    let py = sin(angle) * diamondDist;

    push();
    translate(px, py);
    rotate(angle);
    beginShape();
    vertex(0, -diamondSizeY / 2);
    vertex(diamondSizeX / 2, 0);
    vertex(0, diamondSizeY / 2);
    vertex(-diamondSizeX / 2, 0);
    endShape(CLOSE);
    pop();
  }
  pop();
}

function drawShrunkenSketch2(x, y, w, h) {
  let subW = w / 2;
  let subH = h / 2;

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      drawSketch2(x + i * subW, y + j * subH, subW, subH);
    }
  }
}





