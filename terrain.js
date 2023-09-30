let firstDrawCompleted = false;
let overlay;

window.onload = function () {
  overlay = document.getElementById("loading_overlay");
};

var cols, rows;
var sclw = 30;
var sclh = 10;
var scl = 30;
var defaultCloudY = -310;
var clouds = [];

var terrain;
var xoff;
var yoff;
var flying = 0;
let angleX = 1.3;
let angleY = 0;
let ship;
// let cloud1;
let frames = 1;

if (window) {
  var w = window.innerWidth * 1.5;
  var h = window.innerHeight * 0.75;
}

window.onresize = function () {
  location.reload();
};

let shiftL = false;
let shiftR = false;
let shiftU = false;
let shiftD = false;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  perspective(PI / 3, width / height, 0, 1050);
  frameRate(frames);
  ship = loadModel("ship.obj", true);
  cloud1 = loadModel("cloud1.obj", true);

  cols = Math.ceil(w / sclw);
  rows = Math.ceil(h / sclh);

  terrain = create2DArray(cols, rows);
  shiftR = true;
  shiftD = true;
}

function draw() {
  flying -= 0.1;

  yoff = flying;
  // yoff = 0;
  for (let y = 0; y < rows; y++) {
    xoff = 0;
    for (let x = 0; x < cols; x++) {
      // terrain[x][y] = random(-10,10);
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, -75, 75);
      xoff += 0.2;
    }
    yoff += 0.2;
  }

  background(25);
  ambientLight(100);
  directionalLight(255, 255, 255, 0, 0, 1);
  stroke(255);
  noFill();

  translate(0, -(window.height * 0.2), 25);
  rotateX(angleX);
  rotateY(angleY);

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

  // if (Math.floor(angleY) == 0) {
  //   angleX += 0.01
  // } else {
  //   angleX -= 0.01
  // }

  // console.log(Math.floor(angleY))
  // console.log(abs(angleY.toFixed(2)))

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

  // console.log(Math.floor(angleY) % 2 == 0)
  // console.log(angleY)

  // if (angleY.toFixed(2) >= 0) {
  //   angleX += 0.01
  // } else {
  //   angleX -= 0.01
  // }

  model(ship);
  resetMatrix();

  // // rotateX(1.5);
  // translate(600, -500, cloudZ);
  // cloudZ = cloudZ + 20;
  // if (cloudZ >= 150) {
  //   cloudZ = -310;
  // }
  // box(50, 50, 75);
  // print(cloudZ)
  // resetMatrix();

  cloudChance = getRandomInt(1, 100);
  if (cloudChance <= 5 && clouds.length <= 2) {
    let cloudX = getRandomInt(-600, 600);
    let cloudY = getRandomInt(-150, -350);
    let cloudZ = -310;

    // cloudX = 0
    // cloudY = 0
    // cloudZ = 0
    // print("clouds length: ", clouds.length)
    clouds.push(new Cloud(cloudX, cloudY, cloudZ));
  }

  for (var i = 0; i < clouds.length; i++) {
    // rotateX(1.5);
    clouds[i].move();

    if (clouds[i]) {
      clouds[i].display();
    }
  }
  // console.log(clouds);
  // console.log(clouds.length);

  for (let i = clouds.length - 1; i >= 0; i--) {
    if (clouds[i].z >= 150) {
      console.log(clouds[i]);
      clouds.splice(i, 1);
      // clouds.shift();
    }
  }
  resetMatrix();

  //   translate(width/2, height/2);
  rotateX(PI / 3);
  translate(-w / 2, -h / 2 + 200, -100);

  for (var y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (var x = 0; x < cols; x++) {
      // rect(x*scl, y*scl, scl, scl);
      // vertex(x * scl, y * scl, random(-10, 10));
      // vertex(x * scl, (y + 1) * scl, random(-10, 10));
      vertex(x * scl, y * scl, terrain[x][y]);
      vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
    }
    endShape();
  }

  // rotateX(angleX);
  // rotateY(angleY * 1.3);
  // rotateZ(angle * 0.7);

  if (!firstDrawCompleted) {
    firstDrawCompleted = true;
    overlay.style.animation = "fadeOut 0.5s ease-out 0s forwards";
    // print(firstDrawCompleted);
    // console.log("HELLO.");
  }
}

function create2DArray(numArrays, numSubArrays) {
  var arr = new Array(numArrays);
  for (var i = 0; i < numArrays; i++) {
    arr[i] = new Array(numSubArrays);
  }
  return arr;
}

function negative(number) {
  return !Object.is(Math.abs(number), +number);
}

// function cloudGen(cloudNum, cloudChance) {
//   print(cloudChance);
//   if (cloudChance == 1) {
//     if (cloudNum <= 3) {
//       let cloudX = getRandomInt(-750, 750);
//       let cloudZ = getRandomInt(250, 450);

//       cloudNum = cloudNum + 1;
//       push();
//       rotateX(1.5);
//       translate(cloudX, cloudY, cloudZ);
//       cloudY = cloudY + 20;
//       if (cloudY >= 150) {
//         cloudY = -310;
//       }
//       box(50, 75, 50);
//     }
//   }
// }

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

class Cloud {
  constructor(cloudX, cloudY, cloudZ) {
    this.x = cloudX;
    this.y = cloudY;
    this.z = -310;
  }

  // this.cloudX = getRandomInt(-750, 750);
  // this.cloudZ = getRandomInt(250, 450);
  // this.cloudY = -310;

  display() {
    // rotateX(1.5);
    push();
    translate(this.x, this.y, this.z);
    box(50, 50, 75);
    pop();
  }

  move() {
    // translate(this.x, this.y, this.z);
    this.z = this.z + 100;
  }
}
