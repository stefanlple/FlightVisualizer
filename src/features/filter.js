import { init } from "./rangeSlider";

const setStylesOnElement = function (element, styles) {
  Object.assign(element.style, styles);
};

const defaultStyling = { "background-color": "red" };
const selectedStyling = { "background-color": "blue" };

export const filterPair = {
  'document.querySelector(".filter-callsign")': document.querySelector(
    ".filter-callsign-item"
  ),
  'document.querySelector(".filter-icao")':
    document.querySelector(".filter-icao-item"),
  'document.querySelector(".filter-country")': document.querySelector(
    ".filter-country-item"
  ),
  'document.querySelector(".filter-altitude")': document.querySelector(
    ".filter-altitude-item"
  ),
  'document.querySelector(".filter-velocity")': document.querySelector(
    ".filter-velocity-item"
  ),
  'document.querySelector(".filter-vertical-rate")': document.querySelector(
    ".filter-vertical-rate-item"
  ),
  'document.querySelector(".filter-on-ground")': document.querySelector(
    ".filter-on-ground-item"
  ),
};

export const getVisible = (element) => {
  return (
    window
      .getComputedStyle(element, null)
      .getPropertyValue("background-color") === "rgb(255, 0, 0)"
  );
};

const toogleFilterItems = (element, linkedElement, isVisible) => {
  isVisible
    ? setStylesOnElement(element, selectedStyling)
    : setStylesOnElement(element, defaultStyling);

  linkedElement.classList.toggle("hidden", !isVisible);

  const slider = linkedElement.children[2].classList.contains("min-max-slider")
    ? linkedElement.children[2]
    : null;

  if (slider && slider.querySelectorAll(".legend").length < 2) {
    init(slider);
  }
};

const addClickEventOnFilterItem = (key, value) => {
  const object = eval(key);
  const valueObject = value;

  // set items name
  valueObject.children[1].innerHTML = object.dataset.tooltip;

  // add click event to options
  object.addEventListener("click", () =>
    toogleFilterItems(object, valueObject, getVisible(object))
  );

  // add click event to cross icons
  const crossIcon = valueObject.children[0];
  crossIcon.addEventListener("click", () => {
    toogleFilterItems(object, valueObject, getVisible(object));
  });
};

/* INITIALIZATION */

// filter items
for (const [key, value] of Object.entries(filterPair)) {
  addClickEventOnFilterItem(key, value);
}

// reset button
document.querySelector(".reset-button").addEventListener("click", () => {
  tooltips.forEach((e) => {
    setStylesOnElement(e, defaultStyling);
  });

  document.querySelectorAll(".filter-bar-item").forEach((e) => {
    e.classList.add("hidden");
  });
});

// range slider
let sliders = document.querySelectorAll(".min-max-slider");
sliders.forEach(function (slider) {
  init(slider);
});

// tooltip
var tooltips = document.querySelectorAll(".filter-tooltip");

tooltips.forEach((element) => {
  const tooltipText = element.getAttribute("data-tooltip");
  element.innerHTML = `
    ${element.innerHTML}
    <span class="tooltip-text">${tooltipText}</span>
  `;
});
