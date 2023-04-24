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
  window.scene.add(new THREE.AxesHelper(120));

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
  window.scene.background = backgroundImage;

  const ambientLight = new THREE.AmbientLight(0xffffff);
  ambientLight.intensity = 1;
  window.scene.add(ambientLight);

  const globeRadius = 100;
  const globeGeometry = new THREE.SphereGeometry(globeRadius, 32);
  const globeMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: new THREE.TextureLoader().load("./src/images/No_Cloud_Earth_Map.jpg"),
    bumpMap: new THREE.TextureLoader().load(
      "./src/images/Elevation_BumpMap_Earth.jpeg"
    ),
    bumpScale: 0.005,
    specularMap: new THREE.TextureLoader().load(
      "./src/images/Water_SpecularMap_Earth.png"
    ),
    specular: new THREE.Color("grey"),
  });
  const globe = new THREE.Mesh(globeGeometry, globeMaterial);
  window.scene.add(globe);

  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(globeRadius + 0.003, 32),
    new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("./src/images/Clouds_Map_Earth.png"),
    })
  );
  window.scene.add(clouds);

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
