import { removeTrack } from "../utility/removeTrack";

const aircraftInfoBox = document.getElementById("aircraft_info_box");
const trackBox = document.getElementById("altitude_box");
const closeButton = document.getElementById("close-button");

closeButton.onclick = () => {
  aircraftInfoBox.style.width = "0";
  trackBox.style.height = "0";
  removeTrack();
};
