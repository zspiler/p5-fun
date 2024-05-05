// import { randomRgb } from './util.js'
import { generatePalette, hexToRgb, randomHex } from './colors.js'

let pallete = []

function setup() {
  createCanvas(1000, 1000);


  pallete = generatePalette(randomHex())
}

let time = 0

let speed = 0.004

function draw() {
  background(0);

  for (let i = 0; i < pallete.length; i++) {
    const { r, g, b } = hexToRgb(pallete[i])

    noStroke()
    fill(r, g, b)
    rect(500 + i * 100, 100, 100, 100)
  }

  for (let y = 50; y < 800; y += 1) {
    step(50, y)
  }

  time += speed
}

function step(x = 50, y = 50) {
  const randomColor = pallete[Math.floor(Math.random() * pallete.length)]
  const { r, g, b } = hexToRgb(randomColor)

  stroke(255, 0, 0)

  // const { r, g, b } = randomRgb()
  // console.log(r, g, b);
  // stroke(r, g, b)
  // fill(r, g, b);
  rect(sin(time + y) * x + y, y, 1, 1);
}


/*
When you use type="module" in your HTML script tag, it indicates that the script should be treated as a module. 
Modules have their own scope, meaning variables and functions declared within them (draw, setup) are not automatically added to the global scope. 
To fix this we can manaully add them to window obj.
*/
window.setup = setup;
window.draw = draw;