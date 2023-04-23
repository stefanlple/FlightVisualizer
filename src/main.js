import * as THREE from "three";
//import * as TWEEN from "tween";

// Own modules

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
  window.scene.add(new THREE.AxesHelper(20));

  window.camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  window.camera.position.set(30, 40, 50);
  window.camera.lookAt(0, 0, 0);

  window.renderer = new THREE.WebGLRenderer({ antialias: true });
  window.renderer.setSize(window.innerWidth, window.innerHeight);
  window.renderer.setClearColor(0xffffff);

  const backgroundImage = new THREE.TextureLoader().load(
    "./images/Water_SpecularMap_Earth.png"
  );
  window.scene.background = backgroundImage;

  document.getElementById("3d_content").appendChild(window.renderer.domElement);

  function mainLoop() {
    window.renderer.render(window.scene, window.camera);

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
