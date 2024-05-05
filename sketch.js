import { generatePalette, hexToRgb, randomHex } from './colors.js'

let sizeSlider;
let speedSlider;
let alphaSlider;
let multiplierSlider;
let modeSelect;
let resetButton;

let pallete = []


const SHOW_MENU = true

const modes = {
  Dots: 'Dots',
  Tan: 'Tan',
  Rotation: 'Rotation',
  Emoji: 'Emoji',
}

function initSliders() {
  const sizeSliderDefault = 200
  sizeSlider = createSlider(0, 1000, getItem('size') ?? sizeSliderDefault);
  sizeSlider.changed(() => storeItem('size', sizeSlider.value()))
  sizeSlider.position(20, 900);
  if (!SHOW_MENU) sizeSlider.hide()

  const speedSliderDefault = 0.0001
  speedSlider = createSlider(0.0001, 0.01, getItem('speed') ?? speedSliderDefault, 0.0005);
  speedSlider.changed(() => storeItem('speed', speedSlider.value()))
  speedSlider.position(20, 920);
  if (!SHOW_MENU) speedSlider.hide()

  const alphaSliderDefault = 255
  alphaSlider = createSlider(0, 255, getItem('alpha') ?? alphaSliderDefault);
  alphaSlider.changed(() => storeItem('alpha', alphaSlider.value()))
  alphaSlider.position(20, 940);
  if (!SHOW_MENU) alphaSlider.hide()

  const multiplierSliderDefault = 1
  multiplierSlider = createSlider(1, 1000, getItem('multiplier') ?? multiplierSliderDefault);
  multiplierSlider.changed(() => storeItem('multiplier', multiplierSlider.value()))
  multiplierSlider.position(20, 960);
  if (!SHOW_MENU) multiplierSlider.hide()

  const modeSelectDefault = modes.Tan
  modeSelect = createSelect();
  modeSelect.position(20, 980);
  Object.keys(modes).forEach(mo => modeSelect.option(mo))
  modeSelect.selected(getItem('mode') ?? modeSelectDefault);
  modeSelect.changed(() => storeItem('mode', modeSelect.selected()))
  if (!SHOW_MENU) modeSelect.hide()

  resetButton = createButton('Reset')
  resetButton.position(20, 1000)
  resetButton.mousePressed(() => {
    localStorage.clear()
    location.reload()
  })
  if (!SHOW_MENU) resetButton.hide()

}

function setup() {
  createCanvas(1000, 1000);
  preload()


  initSliders()


  // 
  // pallete = generatePalette(randomHex())
  pallete = ['#389cae', '#cd7565', '#cda965', '#cd6589']
  // #E8D5B4 #C270B4 #A771C2 #C2708B
  console.log(pallete);
}

let time = 0


function draw() {
  background(0);

  const resolution = 0.3 // 0.01 default
  for (let y = 0; y < 1000; y += resolution) {
    step(sizeSlider.value(), y)
  }

  time += speedSlider.value()

  if (SHOW_MENU) {
    drawSliderTexts()
  }
}

function step(x = 50, y = 50) {
  const { r, g, b } = hexToRgb(pallete[Math.floor(y) % pallete.length])

  fill(r, g, b, alphaSlider.value())
  stroke(r, g, b, alphaSlider.value())
  // stroke(255, alphaSlider.value())

  const mode = modeSelect.selected()

  switch (mode) {
    case 'Dots':
      rect(sin(time + y) * x + y, y, 1, 1)
      break;
    case 'Tan':
      // rect(tan(time + y) * x + y, y, 20, 20)
      // rect(tan(time + y) * x + y, y, 1, 1)
      // rect(tan(time + y) * x + y, y, 5, 5)
      // ellipse(tan(time + y) * x + y, y, 2, 2);
      // ellipse(tan(time + y) * x + y, y, 20, 20);
      // rect(tan(time + y) * x + y, y, 1, 1000) // long
      // ellipse(tan(time + y) * x + y, y, 60, 60);

      rect(tan(time + y * multiplierSlider.value()) * x + y, y, 7, 7);
      // rect(tan(time + y) * x + x, y, 2, 2);

      break;
    case 'Rotation':
      rotate(0.0001)

      circle(tan(time + y * multiplierSlider.value()) * x + y, y, 50, 50);
      break
    case 'Emoji':
      // image(img, tan(time + y * multiplierSlider.value()) * x + y, y, 50, 50);
      // NOTE: + 500 = symmetry
      text('🫨', tan(time + y * multiplierSlider.value()) * x + 500, y)
      break
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
  text(`MULTIPLIER ${multiplierSlider.value()}`, multiplierSlider.x * 2 + multiplierSlider.width, multiplierSlider.y + multiplierSlider.height - 2);

}


let img;

// Load the image.
function preload() {
  img = loadImage('assets/emoji.webp');
}
