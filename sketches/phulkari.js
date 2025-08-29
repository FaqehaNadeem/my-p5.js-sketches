let rows = 3;
let cols = 3;
let blackDotInterval = 60; // every 60 frames (~1 sec)
let blackDot = {r: 0, c: 0, i: 0}; // row, col, square index

function setup() {
  createCanvas(1200, 600);
  rectMode(CENTER);
}

function draw() {
  background('#fff176'); // yellow background

  let groupWidth = width / cols;
  let groupHeight = height / rows;
  let tileSize = groupWidth / 2;

  // Randomly pick a new square for black dot at intervals
  if (frameCount % blackDotInterval === 0) {
    blackDot.r = floor(random(rows));
    blackDot.c = floor(random(cols));
    blackDot.i = floor(random(4)); // one of 4 squares
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let offsetX = c * groupWidth;
      let offsetY = r * groupHeight;

      push();
      translate(offsetX, offsetY);

      // --- Left tile: rotating flower ---
      let flowerScale = 0.35;
      let flowerX = tileSize / 2;
      let flowerY = tileSize / 2;
      let angle = frameCount * 0.01 + (c + r); // phase shift
      drawFlower(flowerX, flowerY, 170, 80, 40, flowerScale, angle);

      // --- Right tile: 4 static squares with yellow gaps ---
      let squareSize = tileSize / 2;
      let gapRadius = squareSize * 0.25;
      let colors = ["#66c2a5", "#66c2a5", "#ff6699", "#ff6699"];

      for (let i = 0; i < 4; i++) {
        let colIdx = i % 2;
        let rowIdx = floor(i / 2);
        let x = tileSize + squareSize * colIdx + squareSize / 2;
        let y = squareSize * rowIdx + squareSize / 2;

        fill(colors[i]);
        noStroke();
        rect(x, y, squareSize * 0.9, squareSize * 0.9);

        // dot color
        if (r === blackDot.r && c === blackDot.c && i === blackDot.i) {
          fill(0); // black dot
        } else {
          fill('#fff176'); // yellow
        }
        ellipse(x, y, gapRadius);
      }

      pop();
    }
  }
}

// ---------- Flower ----------
function drawFlower(cx, cy, w, h, s, scaleFactor, rotation = 0) {
  [0, HALF_PI].forEach((angleOffset) => {
    push();
    translate(cx, cy);
    rotate(angleOffset + rotation);

    const elements = [
      [-1, "#66c2a5", 1],
      [-1, "#ff6699", 0.6],
      [1, "#66c2a5", 1],
      [1, "#ff6699", 0.6],
    ];

    elements.forEach(([dir, col, localScale]) => {
      push();
      let effectiveH = h * localScale;
      let mainOffset = dir * 116 * scaleFactor;
      let gap = 3 * scaleFactor;
      let offset = mainOffset;
      if (localScale < 1) {
        offset += dir * (h * 0.5 + effectiveH * 0.5 + gap) * scaleFactor;
      }
      translate(0, offset);
      if (dir === 1) scale(1, -1);
      drawVShape(w * localScale * scaleFactor, h * localScale * scaleFactor, s * localScale * scaleFactor, col, scaleFactor);
      pop();
    });

    pop();
  });
}

// ---------- V / Λ Shape ----------
function drawVShape(w, h, s, col, scaleFactor) {
  [
    [-1, PI / 4],
    [1, -PI / 4],
  ].forEach(([xDir, angle]) => {
    push();
    translate(xDir * 60 * (w / 170), 0);
    rotate(angle);
    drawParallelogramWithStripes(w, h, s * xDir, col, scaleFactor);
    pop();
  });
}

// ---------- Parallelogram with slanted stripes ----------
function drawParallelogramWithStripes(w, h, s, col, scaleFactor) {
  let x1 = -w / 2 + s,
      y1 = -h / 2;
  let x2 = w / 2 + s,
      y2 = -h / 2;
  let x3 = w / 2 - s,
      y3 = h / 2;
  let x4 = -w / 2 - s,
      y4 = h / 2;

  fill(col);
  noStroke();
  quad(x1, y1, x2, y2, x3, y3, x4, y4);

  stroke(lerpColor(color(col), color(0, 0, 0), 0.2));
  strokeWeight(2 * scaleFactor);

  let spacing = 5 * scaleFactor;
  for (let i = -h / 2; i < h / 2; i += spacing) {
    let startX = lerp(x1, x4, (i + h / 2) / h);
    let startY = lerp(y1, y4, (i + h / 2) / h);
    let endX = lerp(x2, x3, (i + h / 2) / h);
    let endY = lerp(y2, y3, (i + h / 2) / h);
    line(startX, startY, endX, endY);
  }
}
