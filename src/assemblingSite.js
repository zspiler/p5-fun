let pts;
let caslon;
let startTime
let offsets

let showText = false;

function preload() {
    caslon = loadFont('../assets/fonts/jabolka.otf');
}

let lines

function createLines(lineTexts) {
    return lineTexts.map((text, i) => {
        const x = -500
        const y = i * 25
        const pts = caslon.textToPoints(text, x, y, 35, { sampleFactor: 0.5 });
        const offsets = createOffsets(pts)
        return {
            text,
            pts,
            offsets
        }
    })
}

function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0)
    canvas.style('z-index', '-1')

    const lineTexts = [
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
        'arbitrary text arbitrary text arbitrary text :3',
    ]
    lines = createLines(lineTexts)
}

function createOffsets(pts) {
    return pts.map(p => {
        const maxNegativeXOffset = -p.x;
        const maxPositiveXOffset = width - p.x;

        const offsetX = (Math.random() * (maxPositiveXOffset - maxNegativeXOffset) + maxNegativeXOffset) - windowWidth / 2;

        const maxNegativeYOffset = -p.y;
        const maxPositiveYOffset = height - p.y;

        const offsetY = (Math.random() * (maxPositiveYOffset - maxNegativeYOffset) + maxNegativeYOffset) - windowHeight / 2;

        return { x: 0, y: offsetY };
        // return { x: offsetX, y: 0 };

        return { x: offsetX, y: offsetY }

    });
}


function assembly(pts, offsets) {
    noFill();
    stroke(220);

    const elapsedTime = millis() - startTime;

    const duration = 4000

    const t = min(elapsedTime / duration, 1);
    const timeFactor = showText ? pow(1 - t, 4) : 1;

    for (let i = 0; i < pts.length; i++) {
        const offset = offsets[i];

        rect(
            pts[i].x + offset.x * timeFactor,
            pts[i].y + offset.y * timeFactor,
            1, 1
        );
    }
}


function draw() {
    background(0);

    translate(windowWidth / 2, windowHeight / 2)

    lines.forEach(line => {

        pts = line.pts;
        offsets = line.offsets;
        assembly(pts, offsets);

    })
}

document.getElementById('button').addEventListener('click', () => {
    showText = true;
    startTime = millis()
})


window.preload = preload;
window.setup = setup;
window.draw = draw;