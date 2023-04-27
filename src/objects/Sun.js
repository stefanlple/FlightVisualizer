import * as THREE from "three";

import { getDayOfYear } from "../utility/getDayOfYear";

export default class Sun extends THREE.Group {
  constructor() {
    super();
    this.name = "sun";
    this.addParts();
  }

  addParts() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    const helper = new THREE.DirectionalLightHelper(directionalLight, 20);
    helper.color = 0xf1f100;
    directionalLight.target.position.set(0, 0, 0);
    this.add(directionalLight);
    this.add(directionalLight.target);
    this.add(helper);

    this.rotateAroundOrigin = (angle, radius) => {
      directionalLight.position.set(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      );
      directionalLight.target.updateWorldMatrix();
      directionalLight.updateMatrixWorld();
      helper.update();
    };

    this.rotateAroundOriginBaseOnTime = (radius) => {
      const date = new Date();
      const angle = (getDayOfYear(date) / 365) * 360;
      directionalLight.position.set(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      );
      directionalLight.target.updateWorldMatrix();
      directionalLight.updateMatrixWorld();
      helper.update();
    };
  }
}
