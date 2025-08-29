let dots = [];
let dotSound;


function preload() {
    dotSound = loadSound("./sounds/bell.mp3", soundLoaded, soundError);
  }
  
  function soundLoaded() {
    console.log("Sound loaded successfully");
  }
  
  function soundError(err) {
    console.log("Sound loading failed:", err);
  }

function setup() {
  const PADDING = 40;
  createCanvas(400 + PADDING * 2, 400 + PADDING * 2);
  background(240);
  noLoop();

  let dottedCircleSize = 100;
  let dotCount = 15;
  let dotSize = 15;

  // Calculate positions for yellow dots
  for (let i = 0; i < dotCount; i++) {
    let angle = map(i, 0, dotCount, 0, TWO_PI);
    let x = cos(angle) * (dottedCircleSize / 2);
    let y = sin(angle) * (dottedCircleSize / 2);
    
    dots.push({
      x, 
      y,
      baseX: x, // Original position
      baseY: y, // Original position
      isPulled: false
    });
  }
}

function draw() {
  background(147,112,219);
  translate(width / 2, height / 2);

  let diamondSize = 200;
  let blueCircleSize = 140;

  // Draw pink diamond (rotated square)
  push();
  rotate(PI / 4);
  fill(255, 105, 180);
  strokeWeight(5);
  stroke(0, 0, 128);
  rectMode(CENTER);
  rect(0, 0, diamondSize, diamondSize);
  pop();

  // Draw baby blue circle
  fill(173, 216, 230);
  strokeWeight(5);
  stroke(0, 0, 128);
  ellipse(0, 0, blueCircleSize);

  // Draw yellow dotted circle
  fill(255, 255, 0);
  noStroke();
  for (let dot of dots) {
    ellipse(dot.x, dot.y, 15);
  }
}

function mouseMoved() {
  let pullDistance = 15; // How far the dots move outward

  for (let dot of dots) {
    let d = dist(mouseX - width / 2, mouseY - height / 2, dot.baseX, dot.baseY);

    if (d < 15) {
      if (!dot.isPulled) {
        dotSound.play();
        dot.isPulled = true;
      }
      dot.x = dot.baseX * 1.2;
      dot.y = dot.baseY * 1.2;
    } else {
      dot.x = dot.baseX;
      dot.y = dot.baseY;
      dot.isPulled = false;
    }
  }
  redraw();
}
