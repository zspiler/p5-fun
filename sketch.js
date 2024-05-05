i = 0
function setup() {
  createCanvas(400, 400);
}

w = 1

speed = 0.01

function draw() {
  background(255);

  for (let y = 50; y < 100; y += 1) {
    step(50, y)
  }

  i += speed
}

function step(x = 50, y = 50, offset = 100) {
  stroke(255, 0, 0)
  fill(255, 0, 0);
  rect(sin(i + y) * x + y, y, w, w);
}