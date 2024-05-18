import { hexToRgb } from './utils/colors.js'
import { getRandomEmoji } from './utils/util.js'
import { record } from './utils/p5Util.js'

const defaultPallete = ['#389cae', '#cd7565', '#cda965', '#cd6589']

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
let sizeSettings;
let rotationSettings;
let presetSelect;

let pallete = []
let chunks = [] // for recording

let SHOW_MENU = true

const modes = {
  Circle: 'Circle',
  Emoji: 'Emoji',
  Text: 'Text',
}

const presets = [
  { name: 'rain', shape: 159, speed: 71, multiplier: 492, resolution: 1, zoom: 1, size: 127, alpha: 4 },
  {
    name: 'clouds',
    shape: 740,
    speed: 7,
    multiplier: 1,
    resolution: 0.13,
    zoom: 1.235,
    size: 103,
    alpha: 70,
    mode: modes.Circle
  },
  {
    "name": "tekst!",
    "shape": 134,
    "speed": 5,
    "multiplier": 91,
    "resolution": 0.64,
    "zoom": 1.45,
    "size": 4,
    "alpha": 186,
    mode: modes.Text
  },
  {
    "name": "space pport",
    "shape": 29,
    "speed": 11,
    "multiplier": 19,
    "resolution": 47.3,
    "zoom": 0.56,
    "size": 23,
    "alpha": 249,
    mode: modes.Text
  },
  {
    "name": "candy",
    "shape": 513,
    "speed": 20,
    "multiplier": 177,
    "resolution": 0.1,
    "zoom": 1,
    "size": 136,
    "alpha": 255,
    "mode": "Circle"
  },
]

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
  speedSettings = createSliderWithLabel(1, 200, 1, 1, 'speed', 20, startY + 1 * yMargin);
  multiplierSettings = createSliderWithLabel(1, 200, 1, 1, 'multiplier', 20, startY + 2 * yMargin);
  rotationSettings = createSliderWithLabel(0, 0.00001 * 10000, 0, 0.00001, 'rotation', 20, startY + 3 * yMargin);
  resolutionSettings = createSliderWithLabel(0.01, 50, 0.1, 0.01, 'resolution', 20, startY + 4 * yMargin);
  zoomSettings = createSliderWithLabel(0.1, 10, 1, 0.001, 'zoom', 20, startY + 5 * yMargin);
  sizeSettings = createSliderWithLabel(1, 200, 4, 1, 'point size', 20, startY + 6 * yMargin);
  alphaSettings = createSliderWithLabel(0, 255, 255, 1, 'alpha', 20, startY + 7 * yMargin);

  const modeSelectDefault = modes.Tan
  modeSelect = createSelect();
  modeSelect.position(20, startY - yMargin);
  Object.keys(modes).forEach(mode => modeSelect.option(mode))
  modeSelect.selected(getItem('mode') ?? modeSelectDefault);
  modeSelect.changed(() => storeItem('mode', modeSelect.selected()))
  if (!SHOW_MENU) modeSelect.hide()

  textInput = createInput(getItem('text') ?? 'Duo moralna macka')
  textInput.elt.placeholder = 'Enter text'
  textInput.elt.minlength = 1
  textInput.position(modeSelect.x + modeSelect.elt.getBoundingClientRect().width + 10, modeSelect.elt.getBoundingClientRect().y)
  textInput.hide()
  textInput.input(() => {
    storeItem('text', textInput.value())
  })

  presetSelect = createSelect();
  presetSelect.position(20, startY - 2 * yMargin);
  presetSelect.option('Choose preset')
  presets.forEach(({ name }) => presetSelect.option(name))
  presetSelect.changed(() => {
    const preset = presets.find(p => p.name === presetSelect.selected())
    if (!preset) {
      return
    }

    shapeSettings.slider.elt.value = preset.shape
    shapeSettings.slider.elt.dispatchEvent(new Event('input', { bubbles: true }));

    speedSettings.slider.elt.value = preset.speed
    speedSettings.slider.elt.dispatchEvent(new Event('input', { bubbles: true }));

    multiplierSettings.slider.elt.value = preset.multiplier
    multiplierSettings.slider.elt.dispatchEvent(new Event('input', { bubbles: true }));

    resolutionSettings.slider.elt.value = preset.resolution
    resolutionSettings.slider.elt.dispatchEvent(new Event('input', { bubbles: true }));

    zoomSettings.slider.elt.value = preset.zoom
    zoomSettings.slider.elt.dispatchEvent(new Event('input', { bubbles: true }));

    sizeSettings.slider.elt.value = preset.size
    sizeSettings.slider.elt.dispatchEvent(new Event('input', { bubbles: true }));

    alphaSettings.slider.elt.value = preset.alpha
    alphaSettings.slider.elt.dispatchEvent(new Event('input', { bubbles: true }));

    modeSelect.selected(preset.mode)
    modeSelect.elt.dispatchEvent(new Event('change', { bubbles: true }));

    // shapeSettings = createSliderWithLabel(0, 1000, 200, 1, 'shape', 20, startY);
    // speedSettings = createSliderWithLabel(1, 200, 1, 1, 'speed', 20, startY + 1 * yMargin);
    // multiplierSettings = createSliderWithLabel(1, 1000, 1, 1, 'multiplier', 20, startY + 2 * yMargin);
    // rotationSettings = createSliderWithLabel(0, 0.00001 * 10000, 0, 0.00001, 'rotation', 20, startY + 3 * yMargin);
    // resolutionSettings = createSliderWithLabel(0.01, 1, 0.1, 0.01, 'resolution', 20, startY + 4 * yMargin);
    // zoomSettings = createSliderWithLabel(0.1, 10, 1, 0.001, 'zoom', 20, startY + 5 * yMargin);
    // sizeSettings = createSliderWithLabel(1, 200, 4, 1, 'point size', 20, startY + 6 * yMargin);
    // alphaSettings = createSliderWithLabel(0, 255, 255, 1, 'alpha', 20, startY + 7 * yMargin);


  })

  changeColorsButton = createButton('Change colors')
  changeColorsButton.position(20, 1020)
  changeColorsButton.mousePressed(() => {
    // pallete = [randomHex(), randomHex(), randomHex(), randomHex()]
    pallete = JSON.stringify(pallete) === JSON.stringify(defaultPallete) ? ['#ffffff'] : defaultPallete
    storeItem('pallete', pallete)
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
  pallete = getItem('pallete') ?? defaultPallete
}


function draw() {
  zoomAtCenter(zoomSettings.slider.value())
  background(0);
  stroke(255)

  textSize(sizeSettings.slider.value() * 2)

  // debug
  // drawPallete()
  // text(Math.floor(frameRate()), 50, 50);
  // rotate(rotationSettings.slider.value()) // NOTE: makes text & emoji slow

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
    case 'Circle':
      // circle(tan(time() + y * multiplierSettings.slider.value()) * shape + y * (windowWidth / windowHeight), y, sizeSettings.slider.value());
      // circle(tan(time() + y * multiplierSettings.slider.value()) * shape + y * 0.01, y, sizeSettings.slider.value());
      circle(tan(time() + y * multiplierSettings.slider.value()) * shape + y, y, sizeSettings.slider.value());

      // :o
      // circle(tan(time() + y * multiplierSettings.slider.value()) * shape + y * 0.01 + 1, y, sizeSettings.slider.value());

      rotate(rotationSettings.slider.value()) // NOTE: makes text & emoji slow
      rotationSettings.slider.elt.disabled = false
      break;
    case 'Emoji':
      // image(img, tan(time() + y * multiplierSlider.value()) * shape + y, y, 50, 50);
      const emoji = emojiCache[y] ?? getRandomEmoji(y)
      emojiCache[y] = emoji
      text(emoji, tan(time() + y * multiplierSettings.slider.value()) * shape + y, y)

      rotationSettings.slider.elt.disabled = true
      break
    case 'Text':
      textInput.show()

      // const c = textCache[y] ?? getRandomUnicodeCharacter()
      // textCache[y] = c
      text(textInput.value(), tan(time() + y * multiplierSettings.slider.value()) * shape + y, y)

      rotationSettings.slider.elt.disabled = true
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
  img = loadImage('../../assets/emoji.webp');
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
    return // TODO text input triggers this!
    recording = !recording
    if (recording) {
      recorder = record(chunks)
    } else {
      recorder.stop();
    }
  }
  else if (e.key === 'p') {
    // save preset
    const preset = {
      name: 'new preset',
      shape: shapeSettings.slider.value(),
      speed: speedSettings.slider.value(),
      multiplier: multiplierSettings.slider.value(),
      resolution: resolutionSettings.slider.value(),
      zoom: zoomSettings.slider.value(),
      size: sizeSettings.slider.value(),
      alpha: alphaSettings.slider.value(),
      mode: modeSelect.selected()
    }

    console.log(preset);
  }
})

/*
When you use type="module" in your HTML script tag, it indicates that the script should be treated as a module. 
Modules have their own scope, meaning variables and functions declared within them (draw, setup) are not automatically added to the global scope. 
To fix this we can manaully add them to window obj.
*/
window.setup = setup;
window.draw = draw;