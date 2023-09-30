// let cloud1;
// let cloudscale = 0.001;

let firstDrawCompleted = false;
let overlay;
let eyeZ;

window.onload = function () {
  overlay = document.getElementById("loading_overlay");
  eyeZ = (height/2) / tan(PI/6)
  // console.log(eyeZ/10)
};

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  perspective(PI/3, width/height, 0, 500);
  cloud1 = loadModel("cloud1.obj", true);
}

function draw() {
  background(25);
  ambientLight(100); 
  directionalLight(255, 255, 255, 0, 0, 1);
  stroke(255);
  noFill();
    // orbitControl();
//   translate(0, 0, -500);

//   push();
  rotateX(1.5);
  translate(0, 0, 50);
  box(50, 150, 50)

//   model(cloud1);
//   pop();
  //   rotateZ(2);
  // scale(cloudscale);
  // cloudscale += 0.001;
  // cloudscale = min(cloudscale, 1);
  // scale(1)
  resetMatrix();

  if (!firstDrawCompleted) {
    firstDrawCompleted = true;
    overlay.style.animation = "fadeOut 0.5s ease-out 0s forwards";
    print(firstDrawCompleted);
    console.log("HELLO.");
  }
}
