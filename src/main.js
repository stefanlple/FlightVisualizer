import * as THREE from "three";
import * as TWEEN from "tween";

// Own modules
import Physics from "./physics/Physics.js";

// Event functions
import { updateAspectRatio } from "./eventfunctions/updateAspectRatio.js";
import { calculateMousePosition } from "./eventfunctions/calculateMousePosition.js";
import { executeRaycast } from "./eventfunctions/executeRaycast.js";
import {
  keyDownAction,
  keyUpAction,
} from "./eventfunctions/executeKeyAction.js";

import Camera from "./experience/Camera.js";

function main() {
  window.scene = new THREE.Scene();
  window.scene.add(new THREE.AxesHelper(200));

  window.renderer = new THREE.WebGLRenderer({ antialias: true });
  window.renderer.setSize(window.innerWidth, window.innerHeight);
  window.renderer.setClearColor();
  window.renderer.shadowMap.enabled = true;

  document.getElementById("3d_content").appendChild(window.renderer.domElement);

  window.physics = new Physics(false);
  window.physics.setup(0, -200, 0, 1 / 240, true);

  const room = new Enviroment();
  window.scene.add(room);

  const camera = new Camera();
  room.add(camera);
  camera.instanciate(window);

  function mainLoop() {
    const delta = clock.getDelta();

    TWEEN.update();

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
