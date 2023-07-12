import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import * as DAT from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Own modules
import Stars from "./enviroment/Stars";
import Globe from "./objects/Globe";
import Enviroment from "./enviroment/Enviroment";
import Sun from "./objects/Sun";
import Planes from "./objects/Planes";
import Aircraft from "./objects/Aircraft";

//Utilities
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

// Event functions
import { updateAspectRatio } from "./eventfunctions/updateAspectRatio.js";
import { calculateMousePosition } from "./eventfunctions/calculateMousePosition.js";
import { executeRaycast } from "./eventfunctions/executeRaycast.js";
import {
  keyDownAction,
  keyUpAction,
} from "./eventfunctions/executeKeyAction.js";
import { latLonToCart } from "./utility/latLngToCartSystem";
import { executeRaycastOnMove } from "./eventfunctions/executeRaycastOnMove";

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

  orbitControls.addEventListener("start", () => {
    window.camera.cameraRotateAroundGlobe = false;
  });
  window.orbitcontrols = orbitControls;

  orbitControls.update();

  const backgroundImage = new THREE.TextureLoader().load(
    "./src/images/Stars_Env.png"
  );
  //window.scene.background = backgroundImage;

  const enviroment = new Enviroment();
  window.scene.add(enviroment);

  const stars = new Stars();
  window.scene.add(stars);

  const globe = new Globe();
  /* globe.rotateX(0.40840704496); //23.4 degrees
  globe.rotateY((-3 / 5) * Math.PI); //adjust rotation to the sun */
  window.scene.add(globe);

  const sun = new Sun();
  window.scene.add(sun);

  const planes = new Planes();
  window.scene.add(planes);

  /* const aircraft = new Aircraft();
  window.scene.add(aircraft); */

  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(2),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  );
  ball.translateX(latLonToCart(34.052235, -118.243683, 0, 102)[0]);
  ball.translateY(latLonToCart(34.052235, -118.243683, 0, 102)[1]);
  ball.translateZ(latLonToCart(34.052235, -118.243683, 0, 102)[2]);
  ball.name = "LOS ANGELES";
  window.scene.add(ball);

  const renderScene = new RenderPass(window.scene, window.camera);
  const composer = new EffectComposer(window.renderer);
  composer.addPass(renderScene);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.7,
    0.1,
    1
  );
  composer.addPass(bloomPass);

  document.getElementById("3d_content").appendChild(window.renderer.domElement);

  /* const gui = new DAT.GUI();
  const cubeFolder = gui.addFolder("Rotate around earth");
  cubeFolder.open(); */

  window.camera.cameraRotateAroundGlobe = true;

  var lastTimeStamp = 0;
  let fetchTimeInSeconds = 20;
  function mainLoop(nowTimestamp) {
    if (nowTimestamp - lastTimeStamp >= fetchTimeInSeconds * 1000) {
      lastTimeStamp = nowTimestamp;
      console.log(`${fetchTimeInSeconds} seconds passed`);
      planes.renderPlanes();
    }
    if (window.camera.cameraRotateAroundGlobe) {
      const rotationSpeed = 0.0001; // Adjust the rotation speed as desired
      const globeCenter = new THREE.Vector3(0, 0, 0); // Center of the globe
      const radius = 300;

      const angle = rotationSpeed * (nowTimestamp - lastTimeStamp);
      const cameraX = globeCenter.x + radius * Math.cos(angle);
      const cameraZ = globeCenter.z + radius * Math.sin(angle);

      window.camera.position.set(cameraX, 160, cameraZ);
    }

    sun.rotateAroundOriginBaseOnTime(300);
    orbitControls.update();
    TWEEN.update();
    requestAnimationFrame(mainLoop);
    composer.render();

    // window.renderer.render(window.scene, window.camera);
  }
  mainLoop();
}

window.onload = main;
window.onresize = updateAspectRatio;
window.addEventListener("mousemove", calculateMousePosition);
window.addEventListener("mousemove", executeRaycastOnMove);
window.onclick = executeRaycast;
window.onkeydown = keyDownAction;
window.onkeyup = keyUpAction;
