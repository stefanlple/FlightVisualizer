/* const aircraftInfoBox = document.getElementById("aircraft_info_box");
const closeButton = document.getElementById("close-button");

let isOpen = false;

closeButton.onclick = () => {
  aircraftInfoBox.style.width = isOpen ? "0" : "20%";
  isOpen = !isOpen;
}; */

import { findObjectByName } from "../utility/findObjectbyName";
import { removeObject3D } from "../utility/removeObject3D";

const aircraftInfoBox = document.getElementById("aircraft_info_box");
const closeButton = document.getElementById("close-button");

closeButton.onclick = () => {
  aircraftInfoBox.style.width = "0";
  removeObject3D(findObjectByName(window.scene, "track"));
};
