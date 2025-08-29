

let diamondOffsets = [];
let pullSound;
let lastSoundTime = 0; // Track last time the sound played
const SOUND_COOLDOWN = 500; // Minimum delay between sounds (in ms)

const GRID_COLS = 15;
const GRID_ROWS = 8;
const CELL_SIZE = 50;

let CENTER_X, CENTER_Y;

function preload() {
  pullSound = loadSound('./sounds/pop.mp3');
}

function setup() {
  createCanvas(800, 450);
  noLoop();

  const PATTERN_WIDTH = GRID_COLS * CELL_SIZE;
  const PATTERN_HEIGHT = GRID_ROWS * CELL_SIZE;
  CENTER_X = (width - PATTERN_WIDTH) / 2;
  CENTER_Y = (height - PATTERN_HEIGHT) / 2;

  initializeDiamondOffsets();
}

function initializeDiamondOffsets() {
  for (let i = 0; i < GRID_COLS; i++) {
    diamondOffsets[i] = [];
    for (let j = 0; j < GRID_ROWS; j++) {
      diamondOffsets[i][j] = 0;
    }
  }
}

function draw() {
  background(0);
  drawPattern();
}

function drawPattern() {
  for (let i = 0; i < GRID_COLS; i++) {
    for (let j = 0; j < GRID_ROWS; j++) {
      let x = i * CELL_SIZE + CENTER_X + CELL_SIZE / 2;
      let y = j * CELL_SIZE + CENTER_Y + CELL_SIZE / 2;
      let alternate = (i + j) % 2 === 0;

      stroke(250, 128, 114);
      strokeWeight(3);
      fill(alternate ? 0 : 255);
      rectMode(CENTER);
      rect(x, y, CELL_SIZE, CELL_SIZE);

      push();
      translate(x, y);
      rotate(PI / 4);
      fill(alternate ? color(255, 204, 0) : color(255, 20, 147));
      noStroke();
      rect(0, 0, CELL_SIZE * 0.7, CELL_SIZE * 0.7);
      pop();

      drawSmallDiamonds(x, y, alternate, diamondOffsets[i][j]);
    }
  }
}

function drawSmallDiamonds(x, y, alternate, offset) {
  let smallSize = CELL_SIZE * 0.22;
  let baseOffset = CELL_SIZE * 0.16 + offset;
  fill(alternate ? color(128, 0, 128) : color(0, 90, 0));
  noStroke();

  for (let m = -1; m <= 1; m += 2) {
    for (let n = -1; n <= 1; n += 2) {
      push();
      translate(x + m * baseOffset, y + n * baseOffset);
      rotate(PI / 4);
      rect(0, 0, smallSize, smallSize);
      pop();
    }
  }
}

function mouseMoved() {
  let maxDistance = CELL_SIZE * 1.2;
  let pullDistance = 10;
  let now = millis();
  let shouldPlaySound = false;

  for (let i = 0; i < GRID_COLS; i++) {
    for (let j = 0; j < GRID_ROWS; j++) {
      let x = i * CELL_SIZE + CENTER_X + CELL_SIZE / 2;
      let y = j * CELL_SIZE + CENTER_Y + CELL_SIZE / 2;
      let d = dist(mouseX, mouseY, x, y);

      let isPulled = d < maxDistance;
      if (isPulled && diamondOffsets[i][j] === 0) {
        shouldPlaySound = true;
      }

      diamondOffsets[i][j] = isPulled ? pullDistance : 0;
    }
  }

  // Only play sound if enough time has passed since last sound
  if (shouldPlaySound && now - lastSoundTime > SOUND_COOLDOWN) {
    pullSound.play();
    lastSoundTime = now;
  }

  redraw();
}
