import * as THREE from "three";

import { latLonToCart } from "../utility/latLonToCartSystem";
import { removeObject3D } from "../utility/removeObject3D";

export default class Planes extends THREE.Group {
  constructor() {
    super();
    this.name = "planes";
    this.plane3dObjects = [];
    this.planeObjects = [];
    this.fetchURL = "https://opensky-network.org/api/states/all";
    this.fetchPlaneObjects();
    //this.renderPlanes(this.planeObjects);
  }

  renderPlanes(planeArray) {
    const globeRadius = 100;
    const geometry = new THREE.SphereGeometry(0.2);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    this.plane3dObjects.forEach((e, i) => {
      this.plane3dObjects.splice(i, 1);
      removeObject3D(e);
      window.scene.remove(e);
    });

    for (const plane of planeArray) {
      const ball = new THREE.Mesh(geometry, material);
      ball.translateX(latLonToCart(plane[6], plane[5], globeRadius)[0]);
      ball.translateY(latLonToCart(plane[6], plane[5], globeRadius)[1]);
      ball.translateZ(latLonToCart(plane[6], plane[5], globeRadius)[2]);
      this.add(ball);
      this.plane3dObjects.push(ball);
    }
  }

  async fetchPlaneObjects() {
    const response = await fetch(this.fetchURL);
    const jsonData = await response.json();
    const newPlanes = jsonData.states;
    this.updatePlaneObjectArray(newPlanes);
    this.renderPlanes(this.planeObjects);
    console.log("planes objecs", this.planeObjects.length);
    console.log("children", this.children.length);
  }

  updatePlaneObjectArray(newArray) {
    this.planeObjects = newArray;
  }
}
