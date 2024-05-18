let pts;
let caslon;

function preload() {
    caslon = loadFont('../assets/fonts/jabolka.otf');
}

function setup() {
    // preload()
    createCanvas(windowWidth, windowHeight);

    pts = caslon.textToPoints('a b c d',
        0, // x
        0, // y
        200, // fontSize
        {
            sampleFactor: 0.2,
            simplifyThreshold: 0
        }
    );
}

/*
ideas

make N points on screen (random), make them slowly move to position on text
*/

function draw() {
    background(220);

    translate(windowWidth / 2, windowHeight / 2);
    fill(255, 0, 0);
    noStroke();

    for (let i = 0; i < pts.length; i++) {
        // fill(i % 255);
        // ellipse(pts[i].x, pts[i].y, 3, 3);
        rect(pts[i].x, pts[i].y, 8, 8);
    }

    // translate(0, 100);
    // beginShape(POINTS);
    // stroke(0);
    // for (let i = 0; i < pts.length; i++) {
    //     vertex(pts[i].x + sin(frameCount * 0.05 + pts[i].y * 0.1) * 5, pts[i].y);
    // }
    // endShape();

    // translate(0, 100);
    // noFill();
    // let rotX = sin(frameCount / 20) * 15;
    // let rotY = cos(frameCount / 20) * 15;
    // for (let i = 0; i < pts.length; i++) {
    //     line(pts[i].x, pts[i].y, pts[i].x - rotX, pts[i].y - rotY);
    // }

    // textFont(caslon);
    // textSize(120);
    // text('NYTimes', 0, 0);
    // fill(255, 0, 0, 30);
    // text('NYTimes', -rotX, -rotY);

    // translate(0, 100);
    // for (let i = 0; i < pts.length; i++) {
    //     line(pts[i].x, pts[i].y, pts[i].x + random(-15, 15), pts[i].y + random(-15, 15));
    // }

}




window.preload = preload;
window.setup = setup;
window.draw = draw;