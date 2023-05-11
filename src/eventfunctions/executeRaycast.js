import * as THREE from "three";
import base64 from "base64-js";

import { findObjectByName } from "../utility/findObjectbyName";

import { username, password } from "../../info";

window.raycaster = new THREE.Raycaster();

export function executeRaycast() {
  window.raycaster.setFromCamera(window.mousePosition, window.camera);
  let intersects = window.raycaster.intersectObject(window.scene, true);

  if (intersects.length > 0) {
    let firstHit = intersects[0].object;

    const object = findObjectByName(firstHit, "aircraft");
    if (object?.icao24) {
      const icao24 = object.icao24;
      fetchAircraftOnIcao(icao24);
    }
  }
}

async function fetchAircraftOnIcao(icao24) {
  const credentials = `${username}:${password}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(credentials);
  const encodedCredentials = base64.fromByteArray(data);

  const url = "https://opensky-network.org/api/states/all?icao24=";
  const response = await fetch(url + icao24, {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  });
  const jsonData = await response.json();
  console.log(jsonData.states[0]);
}
