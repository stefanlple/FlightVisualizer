import * as THREE from "three";

export default class Sun extends THREE.Group {
  constructor() {
    super();
    this.name = "sun";
    this.addParts();
  }

  addParts() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.95);
    const helper = new THREE.DirectionalLightHelper(directionalLight, 20);
    helper.color = 0xf1f100;
    directionalLight.target.position.set(0, 0, 0);
    this.add(directionalLight);
    this.add(directionalLight.target);
    directionalLight.translateX(200);
    this.add(helper);
    helper.parent.updateMatrixWorld();
    helper.update();
  }
}
