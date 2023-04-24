import * as THREE from "three";
import { randomInRange } from "../utility/randomInRange";

// TODO
export default class Enviroment extends THREE.Group {
  constructor() {
    super();

    this.addParts();
  }

  addParts() {
    const ambientLight = new THREE.AmbientLight(0xffffff);
    ambientLight.intensity = 1;
    this.add(ambientLight);
    const particlesCount = 250;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesPosition = new Float32Array(particlesCount * 3);
    const particlesSpawnPosition = {
      widthMin: (-screenWidth / 2) * 35,
      widthMax: (screenWidth / 2) * 35,
      heightMin: (-screenHeight / 2) * 35,
      heightMax: (screenHeight / 2) * 35,
    };

    //stars generation
    for (
      let x = 0, y = 1, z = 2;
      x < particlesCount * 3;
      x += 3, y += 3, z += 3
    ) {
      particlesPosition[x] = 1;

      particlesPosition[y] = randomInRange(
        particlesSpawnPosition.heightMin,
        particlesSpawnPosition.heightMax
      );
      particlesPosition[z] = randomInRange(
        particlesSpawnPosition.widthMin,
        particlesSpawnPosition.widthMax
      );
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(particlesPosition), 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    //this.add(particles);
  }
}
