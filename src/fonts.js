let pts;
let caslon;

function preload() {
    caslon = loadFont('../assets/fonts/jabolka.otf');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
}

const defaultPallete = ['#389cae', '#cd7565', '#cda965', '#cd6589']


function blonde() {
    const pts = caslon.textToPoints('blonde', 0, 0, 200, { sampleFactor: 0.2 });

    fill(255, 0, 0);
    stroke(0)

    for (let i = 0; i < pts.length; i++) {
        rect(pts[i].x, pts[i].y, 50, 50);
    }
}

function debug() {
    const pts = caslon.textToPoints('debug', 0, 0, 200, { sampleFactor: 0.2, });

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
    const pts = caslon.textToPoints('t r u b a r', 0, 0, 200, { sampleFactor: 0.4 });
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
    const pts = caslon.textToPoints('c a n d y', 0, 0, 200, { sampleFactor: 0.4 });

    for (let i = 0; i < pts.length; i++) {
        noStroke()

        const randomColor = defaultPallete[i % defaultPallete.length];
        fill(randomColor);

        ellipse(pts[i].x, pts[i].y, 30, 30);
    }
}

function candy2() {
    const pts = caslon.textToPoints('c a n d y 2', 0, 0, 200, { sampleFactor: 0.1, simplifyThreshold: 0 });

    for (let i = 0; i < pts.length; i++) {

        const randomColor = defaultPallete[i % defaultPallete.length];
        stroke(randomColor)
        noFill()
        ellipse(pts[i].x, pts[i].y, 30, 30);
    }
}

function blurry() {
    const pts = caslon.textToPoints('®†¥ß∂ƒ≈ç-', 0, 0, 200, { sampleFactor: 0.5, simplifyThreshold: 0 });

    for (let i = 0; i < pts.length; i++) {

        const randomColor = defaultPallete[i % defaultPallete.length];
        stroke(255, 0, 0, 50)
        noFill()
        ellipse(pts[i].x, pts[i].y, 20, 20);
    }
}

function order() {
    const pts = caslon.textToPoints('t r u b', 0, 0, 200, { sampleFactor: 0.05, simplifyThreshold: 0 });

    for (let i = 0; i < pts.length; i++) {

        const randomColor = defaultPallete[i % defaultPallete.length];
        stroke(255, 0, 0)
        textSize(10)
        text(i, pts[i].x, pts[i].y)
    }
}


function rotations() {
    const pts = caslon.textToPoints('animacija!', 0, 0, 200, { sampleFactor: 0.2, });

    noFill()
    stroke(20, 0, 255)

    let rotX = sin(frameCount / 50) * 30;
    let rotY = cos(100 / 20) * 15;
    for (let i = 0; i < pts.length; i++) {
        line(pts[i].x, pts[i].y, pts[i].x - rotX, pts[i].y - rotY);
        fill(20, 0, 255)
    }
}


// TODO curve?
function assembly() {
    const pts = caslon.textToPoints('assemble!', 0, 0, 200, { sampleFactor: 0.4, });

    noFill()
    stroke(20, 0, 255)

    const offsets = pts.map(p => {
        const rng = new Math.seedrandom(p.x + p.y);
        return { x: rng() * 10, y: rng() * 10 }
    })

    for (let i = 0; i < pts.length; i++) {
        const offset = offsets[i];

        // const time = frameCount / sin(frameCount / 4);
        const time = frameCount / 10
        rect(pts[i].x + (50 / time) * offset.x, pts[i].y + (50 / time) * offset.y, 3, 3)
    }
}


function draw() {
    background(220);

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
}


window.preload = preload;
window.setup = setup;
window.draw = draw;