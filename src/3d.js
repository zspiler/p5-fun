window.setup = setup;
window.draw = draw;

let img;

// Load the image.
function preload() {
    img = loadImage('assets/emoji.webp');
}


let graphics;

function setup() {
    // https://gist.github.com/simon-tiger/06e865e3012e854e555c0c97757c74d5

    preload()
    createCanvas(1000, 1000, WEBGL);

    // noStroke()

    graphics = createGraphics(200, 200);
    // graphics.background(0);
    graphics.fill(0)

    graphics.textSize(20)
    graphics.text('Hello', 0, 50)
}

function draw() {
    background(255);
    textures2()
}


// createGraphics
function textures2() {
    // graphics.fill(255, 0, 255)
    // graphics.ellipse(mouseX / 10, mouseY / 10, 20, 20);

    rotateX(frameCount * 0.02);
    rotateY(frameCount * 0.02);

    texture(graphics)

    box(200)
    // plane(200)
}

function textures1() {
    // ambientLight(255, 0, 0); // from all directions!
    // pointLight(0, 0, 255, -200, -200, 500); // from one direction!
    // directionalLight(0, 255, 0, 1, 0, 0);

    rotateX(frameCount * 0.02);
    rotateY(frameCount * 0.02);

    texture(img)

    // sphere(300)
    // plane(200, 200)
    box(200)
}


function lightAndMaterial() {
    // ambientLight(255, 0, 0); // from all directions!
    // pointLight(0, 0, 255, -200, -200, 500); // from one direction!
    directionalLight(0, 255, 0, 1, 0, 0);

    // translate(mouseX - width / 2, mouseY - height / 2)

    rotateX(frameCount * 0.05);
    rotateY(frameCount * 0.05);

    // fill // basicMaterial ->  does not reflect light!
    // ambientMaterial(100) // reflects light
    // specularMaterial(255) // more metallic


    // box(200, 200, 200);

    sphere(200);
}

