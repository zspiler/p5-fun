import { generatePalette, hexToRgb, randomHex } from './colors.js'
import { getRandomEmoji, getRandomUnicodeCharacter } from './util.js'
import { record } from './p5Util.js'

const SCREEN_SIZE = 1000

let sizeSettings;
let speedSettings;
let alphaSettings;
let multiplierSettings;
let resolutionSettings;
let zoomSettings;
let modeSelect;
let resetButton;

let pallete = []
let chunks = [] // for recording

let SHOW_MENU = true

const modes = {
  Dots: 'Dots',
  Tan: 'Tan',
  Rotation: 'Rotation',
  Emoji: 'Emoji',
  Text: 'Text',
}

function createSliderWithLabel(min, max, defaultValue, step, labelPrefix, xPos, yPos) {
  const slider = createSlider(min, max, getItem(labelPrefix) ?? defaultValue, step);
  slider.changed(() => {
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

  sizeSettings = createSliderWithLabel(0, 1000, 200, 1, 'size', 20, startY);
  speedSettings = createSliderWithLabel(0.0001, 0.01, 0.0001, 0.0005, 'speed', 20, startY + 1 * yMargin);
  alphaSettings = createSliderWithLabel(0, 255, 255, 1, 'alpha', 20, startY + 2 * yMargin);
  multiplierSettings = createSliderWithLabel(1, 1000, 1, 1, 'multiplier', 20, startY + 3 * yMargin);
  resolutionSettings = createSliderWithLabel(0.01, 1, 0.1, 0.01, 'resolution', 20, startY + 4 * yMargin);
  zoomSettings = createSliderWithLabel(0.1, 10, 1, 0.001, 'zoom', 20, startY + 5 * yMargin);

  const modeSelectDefault = modes.Tan
  modeSelect = createSelect();
  modeSelect.position(20, 1000);
  Object.keys(modes).forEach(mo => modeSelect.option(mo))
  modeSelect.selected(getItem('mode') ?? modeSelectDefault);
  modeSelect.changed(() => storeItem('mode', modeSelect.selected()))
  if (!SHOW_MENU) modeSelect.hide()

  resetButton = createButton('Reset')
  resetButton.position(20, 1020)
  resetButton.mousePressed(() => {
    localStorage.clear()
    location.reload()
  })
  if (!SHOW_MENU) resetButton.hide()

}

function setup() {
  createCanvas(SCREEN_SIZE, SCREEN_SIZE);
  preload()
  initSliders()
  // pallete = generatePalette(randomHex())
  pallete = ['#389cae', '#cd7565', '#cda965', '#cd6589'] // #E8D5B4 #C270B4 #A771C2 #C2708B
  // console.log(pallete);
}

let time = 0


function draw() {
  zoomAtCenter(zoomSettings.slider.value())
  background(0);

  stroke(255, 0, 0)
  let fps = frameRate();
  // text(Math.floor(fps), 50, 50);

  for (let y = 0; y < SCREEN_SIZE; y += resolutionSettings.slider.value()) {
    step(sizeSettings.slider.value(), y)
  }

  time += speedSettings.slider.value()
}

const emojiCache = {}
const textCache = {}

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

      // rect(tan(time + y * multiplierSettings.slider.value()) * x + y, y, 7, 7);
      rect(tan(time + y * multiplierSettings.slider.value()) * x + y, y, 7, 7);
      // rect(tan(time + y) * x + x, y, 2, 2);

      break;
    case 'Rotation':
      rotate(0.0001)

      circle(tan(time + y * multiplierSettings.slider.value()) * x + y, y, 50, 50);
      break
    case 'Emoji':
      // image(img, tan(time + y * multiplierSlider.value()) * x + y, y, 50, 50);
      const emoji = emojiCache[y] ?? getRandomEmoji(y)
      emojiCache[y] = emoji
      text(emoji, tan(time + y * multiplierSettings.slider.value()) * x + y, y)

      break
    case 'Text':
      const c = textCache[y] ?? getRandomUnicodeCharacter()
      textCache[y] = c
      text(c, tan(time + y * multiplierSettings.slider.value()) * x + y, y)
      break
  }
}


function drawPallete() {
  for (let i = 0; i < pallete.length; i++) {
    const { r, g, b } = hexToRgb(pallete[i])

    noStroke()
    fill(r, g, b)
    rect(SCREEN_SIZE / 2 + i * 100, 100, 100, 100)
  }
}

let img;

// Load the image.
function preload() {
  img = loadImage('assets/emoji.webp');
}

function zoomAtCenter(factor) {
  const mx = SCREEN_SIZE / 2;
  const my = SCREEN_SIZE / 2;

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

