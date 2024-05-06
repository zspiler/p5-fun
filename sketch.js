import { generatePalette, hexToRgb, randomHex } from './colors.js'

let sizeSettings;
let speedSettings;
let alphaSettings;
let multiplierSettings;
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

function createSliderWithLabel(min, max, defaultValue, step, labelPrefix, xPos, yPos) {
  const slider = createSlider(min, max, getItem(labelPrefix) ?? defaultValue, step);
  slider.changed(() => {
    console.log(`slider ${labelPrefix}`);
    storeItem(labelPrefix, slider.value());
    label.html(`${labelPrefix.toUpperCase()} ${slider.value()}`);
  });
  slider.position(xPos, yPos);

  const label = createP(`${labelPrefix.toUpperCase()} ${slider.value()}`);
  label.style('color', 'white');
  label.position(slider.x + slider.width + 10, slider.y - 15);

  if (!SHOW_MENU) {
    slider.hide();
    label.hide();
  }

  return { slider, label };
}

function initSliders() {
  sizeSettings = createSliderWithLabel(0, 1000, 200, 1, 'size', 20, 900);
  speedSettings = createSliderWithLabel(0.0001, 0.01, 0.01, 0.0005, 'speed', 20, 920);
  alphaSettings = createSliderWithLabel(0, 255, 255, 1, 'alpha', 20, 940);
  multiplierSettings = createSliderWithLabel(1, 1000, 1, 1, 'multiplier', 20, 960);


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
  // pallete = generatePalette(randomHex())
  pallete = ['#389cae', '#cd7565', '#cda965', '#cd6589'] // #E8D5B4 #C270B4 #A771C2 #C2708B
  console.log(pallete);
}

let time = 0


function draw() {
  background(0);
  // scale(0.2);

  const resolution = 0.1 // 0.1 default
  for (let y = 0; y < 1000; y += resolution) {
    step(sizeSettings.slider.value(), y)
  }

  time += speedSettings.slider.value()
}

function step(x = 50, y = 50) {
  const { r, g, b } = hexToRgb(pallete[Math.floor(y) % pallete.length])

  fill(r, g, b, alphaSettings.slider.value())
  stroke(r, g, b, alphaSettings.slider.value())
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

      rect(tan(time + y * multiplierSettings.slider.value()) * x + y, y, 7, 7);
      // rect(tan(time + y) * x + x, y, 2, 2);

      break;
    case 'Rotation':
      rotate(0.0001)

      circle(tan(time + y * multiplierSettings.slider.value()) * x + y, y, 50, 50);
      break
    case 'Emoji':
      // image(img, tan(time + y * multiplierSlider.value()) * x + y, y, 50, 50);
      // NOTE: + 500 = symmetry
      text('🫨', tan(time + y * multiplierSettings.slider.value()) * x + 500, y)
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

let img;

// Load the image.
function preload() {
  img = loadImage('assets/emoji.webp');
}
