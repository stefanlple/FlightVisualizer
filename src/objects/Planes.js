import * as THREE from "three";
import base64 from "base64-js";

import { latLonToCart } from "../utility/latLngToCartSystem";
import { removeObject3D } from "../utility/removeObject3D";
import { username, password } from "../../info";

import Aircraft from "./Aircraft";

export default class Planes extends THREE.Group {
  constructor() {
    super();
    this.name = "planes";
    this.plane3dObjects = [];
    this.planeObjects = [];
    this.fetchURL = "https://opensky-network.org/api/states/all";
    this.renderPlanes();
  }

  async renderPlanes() {
    const globeRadius = 104;

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

    /* const ball = new THREE.Mesh(
      new THREE.SphereGeometry(1),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    ball.translateX(latLonToCart(34.052235, -118.243683, globeRadius)[0]);
    ball.translateY(latLonToCart(34.052235, -118.243683, globeRadius)[1]);
    ball.translateZ(latLonToCart(34.052235, -118.243683, globeRadius)[2]);
    this.add(ball); */

    for (const plane of this.planeObjects) {
      const aircraft = new Aircraft();
      const [x, y, z] = latLonToCart(plane[6], plane[5], globeRadius);
      aircraft.translateX(x);
      aircraft.translateY(y);
      aircraft.translateZ(z);
      const theta = Math.atan2(y, x);
      const thetaZ = Math.atan2(y, z);
      //const rotation = latLngWithSlope(x, y, z);
      //aircraft.rotation.copy(rotation);
      aircraft.rotateX(-theta);
      aircraft.rotateZ(-thetaZ);
      aircraft.lookAt(0, 0, 0);
      this.add(aircraft);
      this.plane3dObjects.push(aircraft);
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
