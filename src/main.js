import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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
  window.renderer.setClearColor();

  const orbitControls = new OrbitControls(
    window.camera,
    window.renderer.domElement
  );
  orbitControls.update();

  const backgroundImage = new THREE.TextureLoader().load(
    "./src/images/Stars_Env.png"
  );
  window.scene.background = backgroundImage;

  let ambientLight = new THREE.AmbientLight(0xffffff);
  ambientLight.intensity = 0.5;
  window.scene.add(ambientLight);

  let cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
  let cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  });
  let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(-5, 3, 5);
  window.scene.add(cube);

  let sphereGeometry = new THREE.SphereGeometry(5, 10, 10);
  let sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    wireframe: true,
  });
  let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(10, 5, -5);
  window.scene.add(sphere);

  let planeGeometry = new THREE.PlaneGeometry(40, 40);
  let planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    wireframe: true,
  });
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.set(THREE.MathUtils.degToRad(-90), 0, 0);
  window.scene.add(plane);

  document.getElementById("3d_content").appendChild(window.renderer.domElement);

  function mainLoop() {
    window.renderer.render(window.scene, window.camera);
    orbitControls.update();

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
