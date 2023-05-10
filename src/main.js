import * as THREE from "three";
import * as DAT from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//import * as TWEEN from "tween";

// Own modules
import Stars from "./enviroment/Stars";
import Globe from "./objects/Globe";
import Enviroment from "./enviroment/Enviroment";
import Sun from "./objects/Sun";
import Planes from "./objects/Planes";
import Aircraft from "./objects/Aircraft";

//Utilities

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
  window.scene.background = backgroundImage;

  const enviroment = new Enviroment();
  window.scene.add(enviroment);

  const stars = new Stars();
  window.scene.add(stars);

  const globe = new Globe();
  /* globe.rotateX(0.40840704496); //23.4 degrees
  globe.rotateY((-3 / 5) * Math.PI); //adjust rotation to the sun */
  //window.scene.add(globe);

  const sun = new Sun();
  window.scene.add(sun);

  const planes = new Planes();
  //window.scene.add(planes);

  const aircraft = new Aircraft();
  window.scene.add(aircraft);

  const geometry = new THREE.SphereGeometry(0.2);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const ball = new THREE.Mesh(geometry, material);
  window.scene.add(ball);

  document.getElementById("3d_content").appendChild(window.renderer.domElement);

  const gui = new DAT.GUI();
  const cubeFolder = gui.addFolder("Rotate around earth");
  cubeFolder.open();

  var lastTimeStamp = 0;
  let fetchTimeInSeconds = 60;
  function mainLoop(nowTimestamp) {
    if (nowTimestamp - lastTimeStamp >= fetchTimeInSeconds * 1000) {
      lastTimeStamp = nowTimestamp;
      console.log(`${fetchTimeInSeconds} seconds passed`);
      planes.renderPlanes();
    }

    sun.rotateAroundOriginBaseOnTime(300);
    orbitControls.update();
    requestAnimationFrame(mainLoop);
    window.renderer.render(window.scene, window.camera);
  }
  mainLoop();
}

window.onload = main;
window.onresize = updateAspectRatio;
window.onmousemove = calculateMousePosition;
window.onclick = executeRaycast;
window.onkeydown = keyDownAction;
window.onkeyup = keyUpAction;
