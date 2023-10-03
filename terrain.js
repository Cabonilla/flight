// Loading overlay stuff.
let firstDrawCompleted = false;
let overlay;

window.onload = function () {
  overlay = document.getElementById("loading_overlay");
};

// Base values.
var cols, rows;
var sclw = 30;
var sclh = 10;
var scl = 30;

// Stores cloud objects.
var clouds = [];
var cloudLimit = 5 - 1;
var cloudChancePercent = 10

// Creates the terrain.
var terrain;
var xoff;
var yoff;
var flying = 0;
let angleX = 1.3;
let angleY = 0;
let ship;

// Dictates frame rate. Low on purpose for vintage effect.
let frames = 1;
// Creates dynamic terrain size.
if (window) {
  var w = window.innerWidth * 1.5;
  var innerw = window.innerWidth;
  var h = window.innerHeight * 0.75;
  var innerh = window.innerHeight;
}

window.onresize = function () {
  location.reload();
};

// For subtle ship movements.
let shiftL = false;
let shiftR = false;
let shiftU = false;
let shiftD = false;

function preload() {
  ship = loadModel("ship.obj", true);
  cloud1 = loadModel("cloud1.obj", true);
}

function setup() {
  createCanvas(innerw, innerh, WEBGL);
  // Perspective adjusts the limitations of the camera for object clipping.
  perspective(PI / 3, width / height, (h / 2) + 100, h + 400);
  frameRate(frames);

  cols = Math.ceil(w / sclw);
  rows = Math.ceil(h / sclh);

  terrain = create2DArray(cols, rows);
  shiftR = true;
  shiftD = true;
}

function draw() {
  // Controls how terrain moves.
  flying -= 0.1;

  yoff = flying;
  for (let y = 0; y < rows; y++) {
    xoff = 0;
    for (let x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, -75, 75);
      xoff += 0.2;
    }
    yoff += 0.2;
  }

  // Sets up entire window.
  background(25);
  ambientLight(100);
  directionalLight(255, 255, 255, 0, 0, 1);
  stroke(255);
  noFill();

  translate(0, -(window.height * 0.2), 25);
  rotateX(angleX);
  rotateY(angleY);

  // Adjusts plane movement.
  if (angleY >= 0.05) {
    shiftL = true;
    shiftR = false;
  } else if (angleY <= -0.05) {
    shiftR = true;
    shiftL = false;
  }

  if (shiftL) {
    angleY -= 0.01;
  }

  if (shiftR) {
    angleY += 0.01;
  }

  if (abs(angleY.toFixed(2)) == 0 && shiftU) {
    shiftD = true;
    shiftU = false;
  } else if (abs(angleY.toFixed(2)) == 0 && shiftD) {
    shiftD = false;
    shiftU = true;
  }

  if (shiftU) {
    angleX += 0.01;
  } else {
    angleX -= 0.01;
  }

  // Creates ship model.
  model(ship);
  resetMatrix();

  // Creates cloud models.
  cloudChance = getRandomInt(1, 100);
  if (cloudChance <= cloudChancePercent && clouds.length <= cloudLimit) {
    let cloudX = getRandomInt(-w/3, w/3);
    let cloudY = getRandomInt(-h/6, -h/3);
    let cloudZ = -310;

    clouds.push(new Cloud(cloudX, cloudY, cloudZ));
  }

  for (var i = 0; i < clouds.length; i++) {
    clouds[i].move();

    if (clouds[i]) {
      clouds[i].display();
    }
  }

  for (let i = clouds.length - 1; i >= 0; i--) {
    if (clouds[i].z >= 500) {
      clouds.splice(i, 1);
    }
  }
  resetMatrix();

  // Creates and calculates terrain.
  rotateX(PI / 3);
  translate(-w / 2, -h / 2 + 200, -100);

  for (var y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (var x = 0; x < cols; x++) {
      vertex(x * scl, y * scl, terrain[x][y]);
      vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
    }
    endShape();
  }

  // Removes loading overlay.
  if (!firstDrawCompleted) {
    firstDrawCompleted = true;
    overlay.style.animation = "fadeOut 0.5s ease-out 0s forwards";
  }

  // requestAnimationFrame(draw);
}

// Creates the array that in turn shapes the terrain.
function create2DArray(numArrays, numSubArrays) {
  var arr = new Array(numArrays);
  for (var i = 0; i < numArrays; i++) {
    arr[i] = new Array(numSubArrays);
  }
  return arr;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Forms cloud objects to then be added to the canvas.
class Cloud {
  constructor(cloudX, cloudY, cloudZ) {
    this.x = cloudX;
    this.y = cloudY;
    this.z = cloudZ;
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    box(50, 25, 75);
    pop();
  }

  move() {
    // Slowly moves clouds towards camera.
    this.z = this.z + 20;
  }
}
