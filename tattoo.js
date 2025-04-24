let cols = 6;
let tileSize;
let hoverEffects = [];
let lineHoverEffect = { top: 2, bottom: 2 };
let hoverSound, lineHoverSound;
let prevHoverState = [];
let prevLineHover = { top: false, bottom: false };

function preload() {
  soundFormats('mp3', 'wav');
  hoverSound = loadSound('manjeera.mp3'); // Replace with actual file
  lineHoverSound = loadSound('manjeera.mp3'); // Replace with actual file
}

function setup() {
  createCanvas(800, 400);
  tileSize = width / cols;
  noFill();

  for (let i = 0; i < cols; i++) {
    hoverEffects.push({
      mainDiamond: 0,
      smallDiamond: 0,
      innerDots: 0,
      outerDots: 0,
      symbols: 0,
    });
    prevHoverState.push(false);
  }
}

function draw() {
  background(244, 164, 96);
  stroke(0);

  let y = height / 2;

  let lineHoverThreshold = 30;
  let hoveringTop = abs(mouseY - 50) < lineHoverThreshold;
  let hoveringBottom = abs(mouseY - (height - 50)) < lineHoverThreshold;

  if (hoveringTop) {
    lineHoverEffect.top = min(lineHoverEffect.top + 0.15, 8); // Slower increase
    if (!prevLineHover.top) {
      lineHoverSound.play();
      prevLineHover.top = true;
    }
  } else {
    lineHoverEffect.top = max(lineHoverEffect.top - 0.15, 2); // Slower decrease
    prevLineHover.top = false;
  }

  if (hoveringBottom) {
    lineHoverEffect.bottom = min(lineHoverEffect.bottom + 0.15, 8);
    if (!prevLineHover.bottom) {
      lineHoverSound.play();
      prevLineHover.bottom = true;
    }
  } else {
    lineHoverEffect.bottom = max(lineHoverEffect.bottom - 0.15, 2);
    prevLineHover.bottom = false;
  }

  drawDottedLine(0, 50, width, 50, lineHoverEffect.top);
  drawDottedLine(0, height - 50, width, height - 50, lineHoverEffect.bottom);

  for (let i = 0; i < cols; i++) {
    let x = i * tileSize + tileSize / 2;
    let d = dist(mouseX, mouseY, x, y);
    let hoverThreshold = tileSize * 0.6;
    let isHovering = d < hoverThreshold;

    if (isHovering) {
      hoverEffects[i].mainDiamond = min(hoverEffects[i].mainDiamond + 0.15, 8);
      hoverEffects[i].smallDiamond = min(hoverEffects[i].smallDiamond + 0.15, 6);
      hoverEffects[i].innerDots = min(hoverEffects[i].innerDots + 0.1, 5);
      hoverEffects[i].outerDots = min(hoverEffects[i].outerDots + 0.1, 6);
      hoverEffects[i].symbols = min(hoverEffects[i].symbols + 0.15, 6);

      if (!prevHoverState[i]) {
        hoverSound.play();
        prevHoverState[i] = true;
      }
    } else {
      hoverEffects[i].mainDiamond = max(hoverEffects[i].mainDiamond - 0.15, 1);
      hoverEffects[i].smallDiamond = max(hoverEffects[i].smallDiamond - 0.15, 1);
      hoverEffects[i].innerDots = max(hoverEffects[i].innerDots - 0.1, 1);
      hoverEffects[i].outerDots = max(hoverEffects[i].outerDots - 0.1, 1);
      hoverEffects[i].symbols = max(hoverEffects[i].symbols - 0.15, 1);
      prevHoverState[i] = false;
    }

    drawTattooPattern(x, y, tileSize * 0.8, hoverEffects[i]);
  }
}

function drawTattooPattern(x, y, size, hoverEffect) {
  push();
  translate(x, y);

  let d = size * 0.3;
  strokeWeight(hoverEffect.mainDiamond);
  beginShape();
  vertex(-d, 0);
  vertex(0, -d);
  vertex(d, 0);
  vertex(0, d);
  endShape(CLOSE);

  let sd = d * 0.5;
  strokeWeight(hoverEffect.smallDiamond);
  beginShape();
  vertex(-sd, 0);
  vertex(0, -sd);
  vertex(sd, 0);
  vertex(0, sd);
  endShape(CLOSE);

  let dotOffset = sd * 0.2;
  strokeWeight(hoverEffect.innerDots);
  ellipse(0, -dotOffset, 3, 3);
  ellipse(-dotOffset, dotOffset, 3, 3);
  ellipse(dotOffset, dotOffset, 3, 3);

  strokeWeight(hoverEffect.outerDots);
  for (let angle = 0; angle < TWO_PI; angle += PI / 4) {
    let px = cos(angle) * size * 0.5;
    let py = sin(angle) * size * 0.5;
    ellipse(px, py, 5, 5);
  }

  strokeWeight(hoverEffect.symbols);
  drawAbstractSymbol(0, size * 0.4, size * 0.1);
  drawAbstractSymbol(0, -size * 0.4, size * 0.1);

  pop();
}

function drawAbstractSymbol(x, y, s) {
  push();
  translate(x, y);
  line(-s, -s, s, s);
  line(-s, s, s, -s);
  ellipse(0, 0, s * 0.8);
  pop();
}

function drawDottedLine(x1, y1, x2, y2, strokeW) {
  for (let x = x1; x < x2; x += 10) {
    strokeWeight(strokeW);
    line(x, y1, x + 5, y2);
  }
}
