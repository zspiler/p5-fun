import { generatePalette, hexToRgb, randomHex } from './colors.js'

let sizeSlider;
let speedSlider;

let pallete = []

function setup() {
  createCanvas(1000, 1000);

  sizeSlider = createSlider(0, 1000, 200);
  sizeSlider.position(20, 900);

  speedSlider = createSlider(0, 0.01, 0.001, 0.0001);
  speedSlider.position(20, 920);

  pallete = generatePalette(randomHex())
}

let time = 0


function draw() {
  background(0);

  drawPallete()

  for (let y = 0; y < 1000; y += 0.1) {
    step(sizeSlider.value(), y)
  }

  time += speedSlider.value()

  drawSliderTexts()
}

function step(x = 50, y = 50) {

  const { r, g, b } = hexToRgb(pallete[Math.floor(y) % pallete.length])

  fill(r, g, b)
  stroke(255)

  // rect(sin(time + y) * x + y, y, 1, 1); // dots
  // rect(sin(time + y) * x + y, y, 10, 100); // skyscrapers
  // rect(tan(time + y) * x + y, y, 10, 100); // tan!
  rect(tan(time + y) * x + y, y, 1, 1); // tan!
}


/*
When you use type="module" in your HTML script tag, it indicates that the script should be treated as a module. 
Modules have their own scope, meaning variables and functions declared within them (draw, setup) are not automatically added to the global scope. 
To fix this we can manaully add them to window obj.
*/
window.setup = setup;
window.draw = draw;


function drawPallete() {
  for (let i = 0; i < pallete.length; i++) {
    const { r, g, b } = hexToRgb(pallete[i])

    noStroke()
    fill(r, g, b)
    rect(500 + i * 100, 100, 100, 100)
  }

}

function drawSliderTexts() {
  stroke(255)
  fill(255)
  text(`SIZE ${sizeSlider.value()}`, sizeSlider.x * 2 + sizeSlider.width, sizeSlider.y + sizeSlider.height - 2);
  text(`SPEED ${speedSlider.value()}`, speedSlider.x * 2 + speedSlider.width, speedSlider.y + speedSlider.height - 2);
}
