import { generatePalette, hexToRgb, randomHex } from './colors.js'

let sizeSlider;
let speedSlider;
let alphaSlider;
let modeSelect;
let resetButton;

let pallete = []

const modes = {
  Dots: 'Dots',
  Skyscrapers: 'Skyscrapers',
  Tan: 'Tan',
}

function setup() {
  createCanvas(1000, 1000);

  const sizeSliderDefault = 200
  sizeSlider = createSlider(0, 1000, getItem('size') ?? sizeSliderDefault);
  sizeSlider.changed(() => storeItem('size', sizeSlider.value()))
  sizeSlider.position(20, 900);

  const speedSliderDefault = 0.0001
  speedSlider = createSlider(0.0001, 0.01, getItem('speed') ?? speedSliderDefault, 0.0005);
  speedSlider.changed(() => storeItem('speed', speedSlider.value()))
  speedSlider.position(20, 920);

  const alphaSliderDefault = 255
  alphaSlider = createSlider(0, 255, getItem('alpha') ?? alphaSliderDefault);
  alphaSlider.changed(() => storeItem('alpha', alphaSlider.value()))
  alphaSlider.position(20, 940);

  const modeSelectDefault = modes.Tan
  modeSelect = createSelect();
  modeSelect.position(20, 960);
  Object.keys(modes).forEach(mo => modeSelect.option(mo))
  modeSelect.selected(getItem('mode') ?? modeSelectDefault);
  modeSelect.changed(() => storeItem('mode', modeSelect.selected()))

  resetButton = createButton('Reset')
  resetButton.position(20, 980)
  resetButton.mousePressed(() => {
    localStorage.clear()
    location.reload()
  })

  pallete = generatePalette(randomHex())
}

let time = 0


function draw() {
  background(0);

  // const { r, g, b } = hexToRgb(pallete[0])
  // background(r, g, b)

  drawPallete()

  for (let y = 0; y < 1000; y += 0.1) {
    step(sizeSlider.value(), y)
  }

  time += speedSlider.value()

  drawSliderTexts()
}

function step(x = 50, y = 50) {

  const { r, g, b } = hexToRgb(pallete[Math.floor(y) % pallete.length])



  fill(r, g, b, alphaSlider.value())
  stroke(r, g, b, alphaSlider.value())

  const mode = modeSelect.selected()

  switch (mode) {
    case 'Dots':
      rect(sin(time + y) * x + y, y, 1, 1)
      break;
    case 'Skyscrapers':
      rect(sin(time + y) * 50 + y, y, 10, 100)
      break;
    case 'Tan':
      // rect(tan(time + y) * x + y, y, 20, 20)
      // rect(tan(time + y) * x + y, y, 1, 1)
      // rect(tan(time + y) * x + y, y, 5, 5)
      // ellipse(tan(time + y) * x + y, y, 2, 2);
      // ellipse(tan(time + y) * x + y, y, 20, 20);
      // rect(tan(time + y) * x + y, y, 1, 1000) // long
      ellipse(tan(time + y) * x + y, y, 60, 60);
      // rect(tan(time + y) * x + y, y, 50, 10);
      break;
  }
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
  text(`ALPHA ${alphaSlider.value()}`, alphaSlider.x * 2 + alphaSlider.width, alphaSlider.y + alphaSlider.height - 2);

}
