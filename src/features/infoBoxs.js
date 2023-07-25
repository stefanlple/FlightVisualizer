import { removeTrack } from "../utility/removeTrack";

const aircraftInfoBox = document.getElementById("aircraft-info-box");
const trackBox = document.getElementById("altitude-box");
const closeButton = document.getElementById("close-button");

const airportInfoBox = document.getElementById("airport-info-box");
const airportCloseButton = document.getElementById("airport-close-button");

export const closeAircraftInfo = () => {
  aircraftInfoBox.style.width = "0";
  trackBox.style.height = "0";
  removeTrack();
};

closeButton.addEventListener("click", () => {
  closeAircraftInfo();
});

export const closeAirportInfo = () => {
  airportInfoBox.style.width = "0";
};
airportCloseButton.addEventListener("click", () => {
  closeAirportInfo();
});
