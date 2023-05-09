import * as THREE from "three";
import base64 from "base64-js";

import { latLonToCart } from "../utility/latLonToCartSystem";
import { removeObject3D } from "../utility/removeObject3D";
import { username, password } from "../../info";

export default class Planes extends THREE.Group {
  constructor() {
    super();
    this.name = "planes";
    this.plane3dObjects = [];
    this.planeObjects = [];
    this.fetchURL = "https://opensky-network.org/api/states/all";
    this.renderPlanes();
    //this.renderPlanes(this.planeObjects);
  }

  async renderPlanes() {
    const globeRadius = 100;
    const geometry = new THREE.SphereGeometry(0.2);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    this.plane3dObjects.forEach((e, i) => {
      removeObject3D(e);
      window.scene.remove(e);
    });
    this.plane3dObjects = [];
    this.planeObjects = [];

    console.log({
      "planes objecs": this.planeObjects.length,
      "planes 3d objecs": this.plane3dObjects.length,
      children: this.children.length,
    });

    await this.fetchPlaneObjects();

    for (const plane of this.planeObjects) {
      const ball = new THREE.Mesh(geometry, material);
      ball.translateX(latLonToCart(plane[6], plane[5], globeRadius)[0]);
      ball.translateY(latLonToCart(plane[6], plane[5], globeRadius)[1]);
      ball.translateZ(latLonToCart(plane[6], plane[5], globeRadius)[2]);
      this.add(ball);
      this.plane3dObjects.push(ball);
    }
    console.log({
      "planes objecs": this.planeObjects.length,
      "planes 3d objecs": this.plane3dObjects.length,
      children: this.children.length,
    });
  }

  async fetchPlaneObjects() {
    const credentials = `${username}:${password}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(credentials);
    const encodedCredentials = base64.fromByteArray(data);
    const response = await fetch(this.fetchURL, {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    });

    const jsonData = await response.json();
    this.planeObjects = jsonData.states;
    console.log("after fetch", this.planeObjects.length);
  }
}
