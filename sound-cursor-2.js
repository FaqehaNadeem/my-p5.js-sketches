let trail = [];
let trailLength = 8;
const colors = [
  [173, 216, 230],
  [255, 182, 193],
  [255, 218, 185],
];

let prevX, prevY;
let lastSoundTime = 0;
let soundInterval = 200; // ms

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  noCursor();
  userStartAudio(); // enable sound

  prevX = mouseX;
  prevY = mouseY;
}

function draw() {

  fill(255, 20);
  noStroke();
  rect(0, 0, width, height);

  let col = random(colors);
  trail.push({ x: mouseX, y: mouseY, color: col });
  if (trail.length > trailLength) trail.shift();

  for (let t of trail) {
    stroke(0, 50);
    strokeWeight(1);
    fill(...t.color);
    ellipse(t.x, t.y, 80);
  }

  // Draw current cursor circle
  noStroke();
  fill(255, 182, 193);
  ellipse(mouseX, mouseY, 80);
  stroke(0, 60);
  noFill();
  ellipse(mouseX, mouseY, 80);

  // Trigger soft chime sound on movement
  let speed = dist(mouseX, mouseY, prevX, prevY);
  let now = millis();
  if (speed > 5 && now - lastSoundTime > soundInterval) {
    let col = trail[trail.length - 1].color;
    playChimeFromColor(col);
    lastSoundTime = now;
  }

  prevX = mouseX;
  prevY = mouseY;
}

function drawCircularGradient(cx, cy, radius, innerColor, outerColor) {
  noStroke();
  for (let r = radius; r > 0; --r) {
    let inter = map(r, 0, radius, 0, 1);
    let c = lerpColor(innerColor, outerColor, inter);
    fill(c);
    ellipse(cx, cy, r * 2);
  }
}


function playChimeFromColor(rgb) {
  let hsl = rgbToHsl(...rgb);
  let freq = map(hsl[0], 0, 1, 500, 1200);
  let amp = 0.02; // very low fixed volume

  let osc = new p5.Oscillator('triangle');
  osc.amp(0);  // start silent
  let env = new p5.Envelope();
  env.setADSR(0, 0.1, 0.1, 0.1); // immediate attack, short decay & release
  env.setRange(amp, 0);
  osc.amp(env);

  let filter = new p5.LowPass();
  filter.freq(600); // mellower
  filter.res(1);
  osc.disconnect();
  osc.connect(filter);

  let reverb = new p5.Reverb();
  reverb.process(filter, 1.5, 1); // very light reverb

  osc.freq(freq);
  osc.start();
  env.play(osc);
  osc.stop(0.3);
}


function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h, s, l];
}
