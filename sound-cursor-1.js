let prevX = 0;
let prevY = 0;
let osc, reverb, filter;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  noStroke();

  osc = new p5.Oscillator("sine");
  osc.start();
  osc.amp(0);

  filter = new p5.LowPass();
  osc.disconnect();
  osc.connect(filter);
  filter.freq(1000); // soften highs

  reverb = new p5.Reverb();
  reverb.process(osc, 3, 2); // long and smooth
}

function draw() {
  fill(255, 20);
  rect(0, 0, width, height);

  if (mouseX !== prevX || mouseY !== prevY) {
    let r = random(10, 30);
    fill(random(255), random(255), random(255), 200);
    ellipse(mouseX, mouseY, r);

    let freq_ = map(r, 10, 30, 200, 800);
    osc.freq(freq_);

    let pan_ = map(mouseX, 0, width, -1, 1);
    osc.pan(pan_);

    osc.amp(0.08, 0.1); // soft start
    osc.amp(0, 0.6); // gentle fade
  }

  prevX = mouseX;
  prevY = mouseY;
}

