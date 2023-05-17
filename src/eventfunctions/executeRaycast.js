import * as THREE from "three";
import base64 from "base64-js";

import { findObjectByName } from "../utility/findObjectbyName";

import { username, password } from "../../info";

window.raycaster = new THREE.Raycaster();

export function executeRaycast() {
  //raycast
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
  displayData(jsonData.states[0]);
}

function displayData(data) {
  const aircraftInfoBox = document.getElementById("aircraft_info_box");

  const icao = document.getElementById("icao");
  const callSign = document.getElementById("call-sign");
  const longitude = document.getElementById("longitude");
  const latitude = document.getElementById("latitude");
  const baromAltitude = document.getElementById("barom-altitude");
  const geoAltitude = document.getElementById("geo-altitude");
  const verticalRate = document.getElementById("vertical-rate");
  const velocity = document.getElementById("velocity");
  const trueTrack = document.getElementById("true-track");
  const source = document.getElementById("source");

  icao.innerHTML = data[0];
  callSign.innerHTML = data[1];
  longitude.innerHTML = data[5] + " &#176";
  latitude.innerHTML = data[6] + " &#176";
  baromAltitude.innerHTML =
    Math.round(data[7]) + " ft " + `(${Math.round(data[7] * 0.304)} m)`;
  geoAltitude.innerHTML =
    Math.round(data[13]) + " ft " + `(${Math.round(data[13] * 0.304)} m)`;
  verticalRate.innerHTML = !!data[11]
    ? data[11] * 196.85 + " ft/min " + `(${data[11]} m/s)`
    : "N/A";
  velocity.innerHTML = data[9] + " m/s";
  trueTrack.innerHTML = data[10] + " &#176";
  source.innerHTML = {
    0: "ADS-B",

    1: "ASTERIX",

    2: "MLAT",

    3: "FLARM",
  }[data[16]];

  aircraftInfoBox.style.width = "auto";

  // let isOpen = false;
  /* closeButton.onclick = () => {
    aircraftInfoBox.style.width = isOpen ? "0" : "20%";
    isOpen = !isOpen;
  }; */
}
