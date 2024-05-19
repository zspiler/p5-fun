import { hexToRgb } from './utils/colors.js'
import { record } from './utils/p5Util.js'

const defaultPallete = ['#389cae', '#cd7565', '#cda965', '#cd6589']

const modes = {
    random: 'random',
    pozdrav: 'pozdrav',
    magic: 'magic',
}

let modeSelect;
let pts;
let font;
let fontJP;
let fontMono;
let startTime

function preload() {
    font = loadFont('../assets/fonts/jabolka.otf');
    fontJP = loadFont('../assets/fonts/SF-Pro-JP.ttf');
    fontMono = loadFont('../assets/fonts/SF-Mono.otf');
}

function initInputs() {
    const modeSelectDefault = modes.Tan
    modeSelect = createSelect();
    modeSelect.position(20, 800);
    Object.keys(modes).forEach(mode => modeSelect.option(mode))
    modeSelect.selected(getItem('mode') ?? modeSelectDefault);
    modeSelect.changed(() => storeItem('mode', modeSelect.selected()))
}

function setup() {
    startTime = millis()
    createCanvas(windowWidth, windowHeight);
    initInputs()
}

function blonde() {
    const pts = font.textToPoints('blonde', 0, 0, 200, { sampleFactor: 0.2 });

    fill(255, 0, 0);
    stroke(0)

    for (let i = 0; i < pts.length; i++) {
        rect(pts[i].x, pts[i].y, 50, 50);
    }
}

function debug() {
    const pts = font.textToPoints('debug', 0, 0, 200, { sampleFactor: 0.2, });

    noFill()
    stroke(20, 0, 255)

    const minX = Math.min(...pts.map(p => p.x));
    const minY = Math.min(...pts.map(p => p.y));
    const maxX = Math.max(...pts.map(p => p.x));
    const maxY = Math.max(...pts.map(p => p.y));

    for (let i = 0; i < pts.length; i++) {
        const x = pts[i].x;
        const y = pts[i].y;
        const xPercentile = (x - minX) / (maxX - minX);
        const yPercentile = (y - minY) / (maxY - minY);
        rect(pts[i].x, pts[i].y, xPercentile * xPercentile * 50, yPercentile * yPercentile * 50);
    }
}

function percentile(val, min, max) {
    return (val - min) / (max - min);
}


function trubar() {
    const pts = font.textToPoints('t r u b a r', 0, 0, 200, { sampleFactor: 0.4 });
    stroke(0)

    // TODO last point in letter should be invisible
    for (let i = 0; i < pts.length; i++) {
        const randomColor = defaultPallete[i % defaultPallete.length];
        fill(randomColor);
        stroke(200);
        ellipse(pts[i].x, pts[i].y, 70, 70);
    }
}

function candy() {
    const pts = font.textToPoints('candy', 0, 0, 200, { sampleFactor: 0.4 });

    for (let i = 0; i < pts.length; i++) {
        noStroke()

        const randomColor = defaultPallete[i % defaultPallete.length];
        fill(randomColor);

        ellipse(pts[i].x, pts[i].y, 30, 30);
    }
}

function candy2() {
    const pts = font.textToPoints('c a n d y 2', 0, 0, 200, { sampleFactor: 0.1, simplifyThreshold: 0 });

    for (let i = 0; i < pts.length; i++) {

        const randomColor = defaultPallete[i % defaultPallete.length];
        stroke(randomColor)
        noFill()
        ellipse(pts[i].x, pts[i].y, 30, 30);
    }
}

function blurry() {
    const pts = font.textToPoints('®†¥ß∂ƒ≈ç', 0, 0, 200, { sampleFactor: 0.5, simplifyThreshold: 0 });

    for (let i = 0; i < pts.length; i++) {

        const randomColor = defaultPallete[i % defaultPallete.length];
        stroke(255, 0, 0, 50)
        noFill()
        ellipse(pts[i].x, pts[i].y, 20, 20);
    }
}

function order() {
    const pts = font.textToPoints('t r u b', 0, 0, 200, { sampleFactor: 0.05, simplifyThreshold: 0 });

    for (let i = 0; i < pts.length; i++) {

        const randomColor = defaultPallete[i % defaultPallete.length];
        stroke(255, 0, 0)
        textSize(10)
        text(i, pts[i].x, pts[i].y)
    }
}


function rotations() {
    const pts = font.textToPoints('animacija!', 0, 0, 200, { sampleFactor: 0.2, });

    noFill()
    stroke(20, 0, 255)

    let rotX = sin(frameCount / 50) * 30;
    let rotY = cos(100 / 20) * 15;
    for (let i = 0; i < pts.length; i++) {
        line(pts[i].x, pts[i].y, pts[i].x - rotX, pts[i].y - rotY);
        fill(20, 0, 255)
    }
}

// // NOTE: meh kinda OK curve?
function assembly() {
    const pts = font.textToPoints('assemble!', 0, 0, 200, { sampleFactor: 0.4 });

    noFill();
    stroke(20, 0, 255);

    const offsets = pts.map(p => {
        const rng = new Math.seedrandom(p.x + p.y);
        return { x: rng() * 10, y: rng() * 10 };
    });

    const elapsedTime = millis() - startTime;

    const duration = 4000

    const t = min(elapsedTime / duration, 1);
    const timeFactor = pow(1 - t, 4) * 100;

    for (let i = 0; i < pts.length; i++) {
        const offset = offsets[i];

        rect(
            pts[i].x + offset.x * timeFactor,
            pts[i].y + offset.y * timeFactor,
            3, 3
        );
    }
}

function getLetterWidth(pts) {
    const minX = Math.min(...pts.map(p => p.x));
    const maxX = Math.max(...pts.map(p => p.x));
    return maxX - minX;
}

function pozdrav() {
    let prevLetterWidth
    'abcdef'.split('').forEach((letter, i) => {
        // const horizontalSpacing = prevLetterWidth ? prevLetterWidth + 50 : 0
        const horizontalSpacing = 120
        const pts = fontMono.textToPoints(letter, i * horizontalSpacing, 0, 200, { sampleFactor: 0.2 });
        prevLetterWidth = getLetterWidth(pts)

        const randomColor = defaultPallete[i % defaultPallete.length];

        // const alpha = 255

        fill(hexToRgb(randomColor).r, hexToRgb(randomColor).g, hexToRgb(randomColor).b, alpha)
        // stroke(50, alpha);
        stroke(200, 150);

        // // Big to small square!
        const maxSize = 50;
        const minSize = 30;
        const sizeDecrement = (maxSize - minSize) / (pts.length - 1);
        const shiftAmount = frameCount / 1.5 % pts.length;

        for (let i = 0; i < pts.length; i++) {
            const shiftedIndex = (i + shiftAmount) % pts.length; // drawing effect

            const size = maxSize - shiftedIndex * sizeDecrement;
            // const size = 30

            strokeWeight(2)
            rect(pts[i].x, pts[i].y, size, size);
            strokeWeight(1)
        }
    })
}


function magic() {
    'GHJKLM'.split('').forEach((letter, i) => {
        const horizontalSpacing = 130
        const pts = font.textToPoints(letter, i * horizontalSpacing, 0, 200, { sampleFactor: Math.max(0.9 - i * 0.1, 0.1) });


        // TODO cache
        const magnitude = 30
        const offsets = pts.map(p => {
            const rng = new Math.seedrandom(p.x + p.y);
            return { x: rng() * magnitude, y: rng() * magnitude };
        });

        const randomColor = defaultPallete[i % defaultPallete.length];

        const alpha = 50

        fill(hexToRgb(randomColor).r, hexToRgb(randomColor).g, hexToRgb(randomColor).b, alpha)
        stroke(200, alpha);

        const size = 40

        for (let i = 0; i < pts.length; i++) {
            const offsetX = sin(frameCount / 700 * offsets[i].x) * offsets[i].x;
            const offsetY = cos(frameCount / 700 * offsets[i].x) * offsets[i].y;
            rect(pts[i].x + offsetX, pts[i].y + offsetY, size, size);
        }
    })
}

function spring() {
    'nopqrs'.split('').forEach((letter, i) => {
        const horizontalSpacing = 150
        const pts = font.textToPoints(letter, i * horizontalSpacing, 0, 200, { sampleFactor: 1 });

        // Calculate the center of the letter
        const center = pts.reduce((acc, p) => {
            acc.x += p.x;
            acc.y += p.y;
            return acc;
        }, { x: 0, y: 0 });

        center.x /= pts.length;
        center.y /= pts.length;

        const magnitude = -50;

        // Calculate offsets that move points towards the center
        const offsets = pts.map(p => {
            // Vector from point to center
            const vector = { x: center.x - p.x, y: center.y - p.y };
            // Calculate distance (magnitude) of the vector
            const distance = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            // Normalize the vector (make it a unit vector)
            const direction = { x: vector.x / distance, y: vector.y / distance };
            // Scale the direction vector by the desired magnitude
            return { x: direction.x * magnitude, y: direction.y * magnitude };
        });


        const randomColor = defaultPallete[i % defaultPallete.length];

        const alpha = 100

        noStroke()


        fill(hexToRgb(randomColor).r, hexToRgb(randomColor).g, hexToRgb(randomColor).b, alpha)
        noFill()
        stroke(hexToRgb(randomColor).r, hexToRgb(randomColor).g, hexToRgb(randomColor).b, alpha)

        const size = 60

        for (let i = 0; i < pts.length; i++) {
            let offsetX = cos(frameCount / 50) * offsets[i].x;
            let offsetY = sin(frameCount / 50) * offsets[i].y;

            ellipse(pts[i].x + offsetX, pts[i].y + offsetY, size, size);
        }
    })
}


function malform() {
    'tuvwxyz'.split('').forEach((letter, i) => {
        const horizontalSpacing = 120
        const pts = font.textToPoints(letter, i * horizontalSpacing, 0, 200, { sampleFactor: 1 });

        // TODO cache
        // Calculate the center of the letter
        const center = pts.reduce((acc, p) => {
            acc.x += p.x;
            acc.y += p.y;
            return acc;
        }, { x: 0, y: 0 });

        center.x /= pts.length;
        center.y /= pts.length;

        const magnitude = 20;

        // TODO cache
        const offsets = pts.map(p => {
            const vector = { x: p.x - center.x, y: p.y - center.y };
            const distance = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            const direction = { x: vector.x / distance, y: vector.y / distance };
            return { x: direction.x * magnitude, y: direction.y * magnitude };
        });

        const randomColor = defaultPallete[i % defaultPallete.length];


        for (let i = 0; i < pts.length; i++) {
            const offsetX = sin(frameCount / 300 * offsets[i].x) * offsets[i].x;
            const offsetY = cos(frameCount / 300 * offsets[i].x) * offsets[i].y;


            const bigSize = 5
            const off = 0
            fill(hexToRgb(randomColor).r, hexToRgb(randomColor).g, hexToRgb(randomColor).b, 80)
            noStroke()
            rect(pts[i].x + offsetX - 10, pts[i].y - 10, bigSize, bigSize);

            // // line
            // fill(hexToRgb(randomColor).r, hexToRgb(randomColor).g, hexToRgb(randomColor).b, alpha)
            // stroke(hexToRgb(randomColor).r, hexToRgb(randomColor).g, hexToRgb(randomColor).b, alpha)
            // noFill()
            // rect(pts[i].x + offsetX, pts[i].y + offsetY, 2, 2);

        }
    })
}


function explode() {
    'uvwxyz'.split('').forEach((letter, i) => {
        const horizontalSpacing = 150
        const pts = font.textToPoints(letter, i * horizontalSpacing, 0, 200, { sampleFactor: 0.2 })
            .sort((a, b) => a.y - b.y);

        // Calculate the center of the letter
        const center = pts.reduce((acc, p) => {
            acc.x += p.x;
            acc.y += p.y;
            return acc;
        }, { x: 0, y: 0 });

        center.x /= pts.length;
        center.y /= pts.length;

        const magnitude = -50;

        // Calculate offsets that move points towards the center
        // const offsets = pts.map(p => {
        //     // Vector from point to center
        //     const vector = { x: center.x - p.x, y: center.y - p.y };
        //     // Calculate distance (magnitude) of the vector
        //     const distance = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        //     // Normalize the vector (make it a unit vector)
        //     const direction = { x: vector.x / distance, y: vector.y / distance };
        //     // Scale the direction vector by the desired magnitude
        //     return { x: direction.x * magnitude, y: direction.y * magnitude };
        // });


        const randomColor = defaultPallete[i % defaultPallete.length];

        const alpha = 100

        noStroke()


        fill(hexToRgb(randomColor).r, hexToRgb(randomColor).g, hexToRgb(randomColor).b, alpha)
        noFill()
        stroke(hexToRgb(randomColor).r, hexToRgb(randomColor).g, hexToRgb(randomColor).b, alpha)

        const size = 5

        for (let i = 0; i < pts.length; i++) {
            const rng = new Math.seedrandom(pts[i].x + pts[i].y);

            // let offsetX = sin(frameCount / 5) * i / 10 * rng();
            // let offsetY = -sin(frameCount / 5) * i / 10 * rng();


            const offsetX = 0;
            const offsetY = 0;

            // rotate around center
            // translate(center.x, center.y)
            const rotationFact = 0.01 * frameCount
            rotate(rotationFact)


            rect(pts[i].x + offsetX, pts[i].y + offsetY, size + i * 0.05, size + i * 0.05);
            rotate(-rotationFact)
        }
    })
}

function lerp(start, stop, amt) {
    return amt * (stop - start) + start;
}



/*
Ideas
- util for seperate leters? (+ starting with small then big point size (in letter))
- multi overlaid / layers
- slow writing (one point at time?)
- randomness around points?
*/


function draw() {
    // background(220);
    background(0, 20, 0)

    const mode = modeSelect.selected()
    switch (mode) {
        case modes.random:
            translate(150, 150)
            blonde()
            translate(0, 200);
            debug()
            translate(0, 200);
            trubar()
            translate(0, 200);
            candy()
            translate(0, 200);
            candy2()
            translate(0, 200);
            blurry()
            translate(0, 200);
            order()

            translate(windowWidth / 3, -1000)
            rotations()
            translate(0, 200)
            assembly()
            translate(0, 200)
            break;

        case modes.pozdrav:
            translate(windowWidth / 2 - 400, windowHeight / 2 - 200)
            pozdrav()
            translate(0, 200)
            magic()
            translate(0, 225)
            spring()
            translate(0, 200)
            malform()
        // translate(0, 300)
        // explode()
    }
}



// recording

let chunks = [] // for recording
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


window.preload = preload;
window.setup = setup;
window.draw = draw;