import * as THREE from "three";
import * as DAT from "dat.gui";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//import * as TWEEN from "tween";

// Own modules
import Globe from "./objects/Globe";
import Enviroment from "./enviroment/Enviroment";
import Sun from "./objects/Sun";

// Event functions
import { updateAspectRatio } from "./eventfunctions/updateAspectRatio.js";
import { calculateMousePosition } from "./eventfunctions/calculateMousePosition.js";
import { executeRaycast } from "./eventfunctions/executeRaycast.js";
import {
  keyDownAction,
  keyUpAction,
} from "./eventfunctions/executeKeyAction.js";

function main() {
  window.scene = new THREE.Scene();
  window.scene.add(new THREE.AxesHelper(150));

  window.camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  window.camera.position.set(100, 160, 220);
  window.camera.lookAt(0, 0, 0);

  window.renderer = new THREE.WebGLRenderer({ antialias: true });
  window.renderer.setSize(window.innerWidth, window.innerHeight);
  window.renderer.setClearColor();

  const orbitControls = new OrbitControls(
    window.camera,
    window.renderer.domElement
  );
  orbitControls.update();

  const backgroundImage = new THREE.TextureLoader().load(
    "./src/images/Stars_Env.png"
  );
  //window.scene.background = backgroundImage;

  const enviroment = new Enviroment();
  window.scene.add(enviroment);

  const globe = new Globe();
  globe.rotateX(0.40840704496); //23.4 degrees
  window.scene.add(globe);

  const sun = new Sun();
  window.scene.add(sun);

  document.getElementById("3d_content").appendChild(window.renderer.domElement);

  const gui = new DAT.GUI();
  const cubeFolder = gui.addFolder("Rotate around earth");
  // cubeFolder.add(sun.rotateAroundOrigin(), "x", Math.PI * 2);
  cubeFolder.open();

  let counter = 0;
  const clock = new THREE.Clock();
  function mainLoop() {
    window.renderer.render(window.scene, window.camera);
    orbitControls.update();

    sun.rotateAroundOrigin(counter, 120);
    console.log(counter);
    counter = counter + clock.getDelta() / 2;
    requestAnimationFrame(mainLoop);
  }
  mainLoop();
}

window.onload = main;
window.onresize = updateAspectRatio;
window.onmousemove = calculateMousePosition;
window.onclick = executeRaycast;
window.onkeydown = keyDownAction;
window.onkeyup = keyUpAction;
