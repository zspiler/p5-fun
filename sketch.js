// import { randomRgb } from './util.js'
import { generatePalette, hexToRgb, randomHex } from './colors.js'

let slider1;

let pallete = []

function setup() {
  createCanvas(1000, 1000);

  slider1 = createSlider(0, 1000, 10);
  slider1.position(20, 900);

  pallete = generatePalette(randomHex())
}

let time = 0

let speed = 0.004

function draw() {
  background(0);
  stroke(255)
  fill(255)
  text('SIZE', slider1.x * 2 + slider1.width, slider1.y + slider1.height - 2);

  for (let i = 0; i < pallete.length; i++) {
    const { r, g, b } = hexToRgb(pallete[i])

    noStroke()
    fill(r, g, b)
    rect(500 + i * 100, 100, 100, 100)
  }

  for (let y = 0; y < 1000; y += 0.1) {
    step(slider1.value(), y)
  }

  time += speed
}

function step(x = 50, y = 50) {

  const { r, g, b } = hexToRgb(pallete[Math.floor(y) % pallete.length])

  fill(r, g, b)
  stroke(r, g, b)

  rect(sin(time + y) * x + y, y, 1, 1); // dots

  // rect(sin(time + y) * x + y, y, 10, 100); // skyscrapers
}


/*
When you use type="module" in your HTML script tag, it indicates that the script should be treated as a module. 
Modules have their own scope, meaning variables and functions declared within them (draw, setup) are not automatically added to the global scope. 
To fix this we can manaully add them to window obj.
*/
window.setup = setup;
window.draw = draw;