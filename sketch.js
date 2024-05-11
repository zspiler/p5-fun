import { generatePalette, hexToRgb, randomHex } from './colors.js'
import { getRandomEmoji, getRandomUnicodeCharacter } from './util.js'
import { record } from './p5Util.js'

let shapeSettings;
let speedSettings;
let alphaSettings;
let multiplierSettings;
let resolutionSettings;
let zoomSettings;
let modeSelect;
let changeColorsButton;
let resetButton;
let textInput;

let pallete = []
let chunks = [] // for recording

let SHOW_MENU = true

const modes = {
  Tan: 'Tan',
  Rotation: 'Rotation',
  Emoji: 'Emoji',
  Text: 'Text',
}

function createSliderWithLabel(min, max, defaultValue, step, labelPrefix, xPos, yPos) {
  const slider = createSlider(min, max, getItem(labelPrefix) ?? defaultValue, step);
  slider.input(() => {
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
  const startY = 800
  const yMargin = 20

  shapeSettings = createSliderWithLabel(0, 1000, 200, 1, 'shape', 20, startY);
  speedSettings = createSliderWithLabel(1, 200, 1, 10, 'speed', 20, startY + 1 * yMargin);
  alphaSettings = createSliderWithLabel(0, 255, 255, 1, 'alpha', 20, startY + 2 * yMargin);
  multiplierSettings = createSliderWithLabel(1, 1000, 1, 1, 'multiplier', 20, startY + 3 * yMargin);
  resolutionSettings = createSliderWithLabel(0.01, 1, 0.1, 0.01, 'resolution', 20, startY + 4 * yMargin);
  zoomSettings = createSliderWithLabel(0.1, 10, 1, 0.001, 'zoom', 20, startY + 5 * yMargin);

  textInput = createInput(getItem('text') ?? 'Duo moralna macka')
  textInput.elt.placeholder = 'Enter text'
  textInput.position(20, startY + 7 * yMargin)
  textInput.input(() => {
    storeItem('text', textInput.value());
  })

  const modeSelectDefault = modes.Tan
  modeSelect = createSelect();
  modeSelect.position(20, startY - yMargin);
  Object.keys(modes).forEach(mo => modeSelect.option(mo))
  modeSelect.selected(getItem('mode') ?? modeSelectDefault);
  modeSelect.changed(() => storeItem('mode', modeSelect.selected()))
  if (!SHOW_MENU) modeSelect.hide()

  changeColorsButton = createButton('Change colors')
  changeColorsButton.position(20, 1020)
  changeColorsButton.mousePressed(() => {
    pallete = [randomHex(), randomHex(), randomHex(), randomHex()]
  })

  resetButton = createButton('Reset')
  resetButton.position(20, 1040)
  resetButton.mousePressed(() => {
    localStorage.clear()
    location.reload()
  })
  if (!SHOW_MENU) resetButton.hide()
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  preload()
  initSliders()
  pallete = ['#389cae', '#cd7565', '#cda965', '#cd6589']
}


function draw() {
  zoomAtCenter(zoomSettings.slider.value())
  background(0);
  stroke(255)

  // inputs
  textInput.hide()
  multiplierSettings.slider.elt.disabled = true

  // drawPallete()
  // text(Math.floor(frameRate()), 50, 50);

  for (let y = 0; y < windowHeight; y += resolutionSettings.slider.value()) {
    step(shapeSettings.slider.value(), y)
  }
}

const emojiCache = {}

function time() {
  return frameCount * (speedSettings.slider.value() / 10000)
}

function step(shape = 50, y = 50) {
  // console.log(Math.floor(y) % pallete.length);
  const { r, g, b } = hexToRgb(pallete[Math.floor(y) % pallete.length])
  fill(r, g, b, alphaSettings.slider.value())
  stroke(r, g, b, alphaSettings.slider.value())

  const mode = modeSelect.selected()

  switch (mode) {
    case 'Tan':
      // rect(tan(time() + y) * shape + y, y, 20, 20)
      // rect(tan(time() + y) * shape + y, y, 1, 1) // !!!!
      // ellipse(tan(time() + y) * shape + y, y, 20, 20);
      // ellipse(tan(time() + y) * shape + y, y, 60, 60);

      /// multiplier
      // rect(tan(time() + y * multiplierSettings.slider.value()) * shape + y, y, 7, 7);
      // symettrical
      // rect(tan(time() + y) * shape + windowWidth / 2, y, 2, 2);
      // rect(cos(time() + y) * shape + windowWidth / 2, y, 2, 2);

      multiplierSettings.slider.elt.disabled = true
      rect(tan(time() + y) * shape + y, y, 1, 1)

      break;
    case 'Rotation':
      rotate(0.00001)

      circle(tan(time() + y * multiplierSettings.slider.value()) * shape + y, y, 50, 50);
      break
    case 'Emoji':
      // image(img, tan(time() + y * multiplierSlider.value()) * shape + y, y, 50, 50);
      const emoji = emojiCache[y] ?? getRandomEmoji(y)
      emojiCache[y] = emoji
      text(emoji, tan(time() + y * multiplierSettings.slider.value()) * shape + y, y)

      break
    case 'Text':
      textInput.show()
      // const c = textCache[y] ?? getRandomUnicodeCharacter()
      // textCache[y] = c

      text(textInput.value(), tan(time() + y * multiplierSettings.slider.value()) * shape + y, y)
      break
  }
}


function drawPallete() {
  for (let i = 0; i < pallete.length; i++) {
    const { r, g, b } = hexToRgb(pallete[i])

    noStroke()
    fill(r, g, b)
    rect(windowHeight / 2 + i * 100, 100, 100, 100)
  }
}

let img;

// Load the image.
function preload() {
  img = loadImage('assets/emoji.webp');
}

function zoomAtCenter(factor) {
  const mx = windowWidth / 2;
  const my = windowHeight / 2;

  translate(mx, my);
  scale(factor);
  translate(-mx, -my);
  translate();
}

let recorder
let recording = false
window.addEventListener('keydown', function (e) {
  if (e.key === 'r') {
    recording = !recording
    if (recording) {
      recorder = record(chunks)
    } else {
      recorder.stop();
    }
  }
})

/*
When you use type="module" in your HTML script tag, it indicates that the script should be treated as a module. 
Modules have their own scope, meaning variables and functions declared within them (draw, setup) are not automatically added to the global scope. 
To fix this we can manaully add them to window obj.
*/
window.setup = setup;
window.draw = draw;