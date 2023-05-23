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
    //plus two to lift the planes up
    const globeRadius = 102;

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

    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(2),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    ball.translateX(latLonToCart(34.052235, -118.243683, 0, globeRadius)[0]);
    ball.translateY(latLonToCart(34.052235, -118.243683, 0, globeRadius)[1]);
    ball.translateZ(latLonToCart(34.052235, -118.243683, 0, globeRadius)[2]);
    ball.name = "LOS ANGELES";
    window.scene.add(ball);

    for (const plane of this.planeObjects) {
      const aircraft = new Aircraft();
      const [x, y, z] = latLonToCart(plane[6], plane[5], plane[7], globeRadius);
      const orientation = plane[10];
      aircraft.translateX(x);
      aircraft.translateY(y);
      aircraft.translateZ(z);
      aircraft.icao24 = plane[0];

      aircraft.lookAt(0, 0, 0);
      aircraft.rotateZ(THREE.MathUtils.degToRad(orientation));
      aircraft.material.color.setHex(0xff0000);
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
    /* console.log(this.planeObjects[0]);
    console.log("after fetch", this.planeObjects.length); */
  }
}
