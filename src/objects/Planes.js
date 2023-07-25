import * as THREE from "three";
import base64 from "base64-js";

import { latLonToCart } from "../utility/latLngToCartSystem";
import { removeObject3D } from "../utility/removeObject3D";
import { generateSubClusterListItems } from "../features/cluster";
import { continentsMap } from "../data/continentsMap";

import { username, password } from "../../info";

import Aircraft from "./Aircraft";

export default class Planes extends THREE.Group {
  constructor() {
    super();
    this.name = "planes";
    this.plane3dObjects = [];
    this.planeObjects = [];
    this.fetchURL = "https://opensky-network.org/api/states/all";

    this.filterBarItemList = [];

    this.defaultFilterParameters = {
      CALLSIGN: "",
      ICAO: "",
      COUNTRY: "",
      ALTITUDE: {
        min: 0,
        max: 19500,
      },
      VELOCITY: {
        min: 0,
        max: 1300,
      },
      "VERTICAL-RATE": {
        min: -30,
        max: 30,
      },
      "ON-GROUND": null,
    };

    this.filterParameters = {
      CALLSIGN: "",
      ICAO: "",
      COUNTRY: "",
      ALTITUDE: {
        min: 0,
        max: 19500,
      },
      VELOCITY: {
        min: 0,
        max: 1300,
      },
      "VERTICAL-RATE": {
        min: -30,
        max: 30,
      },
      "ON-GROUND": null,
    };

    this.filterIndexMap = {
      CALLSIGN: 1,
      ICAO: 0,
      COUNTRY: 2,
      ALTITUDE: 7,
      VELOCITY: 9,
      "VERTICAL-RATE": 11,
      "ON-GROUND": 8,
    };

    this.countrySet = new Set();

    this.continentsMap = continentsMap;

    //ON START
    (async () => {
      this.addEventListenerToButtons();
      this.getListItemNodes();
      this.manageFilterParameters();
      await this.renderPlanes();

      generateSubClusterListItems(this.countrySet);

      //only for dev
      function findElementsNotInArray(arr1, arr2) {
        const elementsNotInArr1 = arr2.filter(
          (element) => !arr1.includes(element)
        );
        console.log("PLEASE ADD THIS TO COUNTRIES MAP", elementsNotInArr1);
      }

      findElementsNotInArray(
        (() => {
          const continents = Object.values(this.continentsMap);
          const mergedArray = continents.reduce(
            (acc, countries) => [...acc, ...countries],
            []
          );
          return mergedArray;
        })(),
        Array.from(this.countrySet)
      );
    })(this);
  }

  addEventListenerToButtons() {
    document.querySelector(".reset-button").addEventListener("click", () => {
      {
        this.filterParameters = { ...this.defaultFilterParameters };
        console.log("filter-parameters", this.filterParameters);
        this.renderPlanes();
      }
    });
  }

  getListItemNodes() {
    this.filterBarItemList = document.querySelectorAll(".filter-bar-item");
  }

  manageFilterParameters() {
    const updateFilterParameters = () => {
      this.filterBarItemList.forEach((e) => {
        const classname = e.classList[1]
          .replace("filter-", "")
          .replace("-item", "")
          .toUpperCase();

        const isHidden = e.classList.contains("hidden");

        switch (classname) {
          case "CALLSIGN":
          case "ICAO":
          case "COUNTRY":
            this.filterParameters[classname] = isHidden
              ? this.defaultFilterParameters[classname]
              : e.children[2].children[0].value;
            break;
          case "ALTITUDE":
          case "VELOCITY":
          case "VERTICAL-RATE":
            if (isHidden) {
              this.filterParameters[classname].min =
                this.defaultFilterParameters[classname].min;
              this.filterParameters[classname].max =
                this.defaultFilterParameters[classname].max;
            } else {
              this.filterParameters[classname].min = Math.round(
                Number(e.querySelector("#min").value)
              );
              this.filterParameters[classname].max = Math.round(
                Number(e.querySelector("#max").value)
              );
            }
            break;
          case "ON-GROUND":
            this.filterParameters[classname] = isHidden
              ? this.defaultFilterParameters[classname]
              : e.children[2].children[0].checked;
            break;
        }
      });
    };

    document.querySelector(".apply-button").addEventListener("click", () => {
      updateFilterParameters();
      this.renderPlanes();
      console.log("filter-parameters", this.filterParameters);
    });
  }

  checkPlaneOnParameter(filterParameters, plane) {
    let filter = true;
    /* console.log("current planes"); */
    for (const [key, value] of Object.entries(filterParameters)) {
      /* console.log(
        "check if parameters match:",
        filterParameters[key] || "undefined",
        "&&",
        plane[this.filterIndexMap[key]]
      ); */

      const checkNotBetween = (x, min, max) => !(x >= min && x <= max);
      switch (key) {
        case "CALLSIGN":
          if (filterParameters[key] !== "") {
            if (
              filterParameters[key] !== plane[this.filterIndexMap[key]].trim()
            ) {
              filter = false;
            }
          }
          break;
        case "ICAO":
        case "COUNTRY":
          if (filterParameters[key] !== "") {
            if (filterParameters[key] !== plane[this.filterIndexMap[key]]) {
              filter = false;
            }
          }
          break;
        case "ALTITUDE":
        case "VELOCITY":
        case "VERTICAL-RATE":
          if (
            checkNotBetween(
              plane[this.filterIndexMap[key]],
              filterParameters[key].min,
              filterParameters[key].max
            )
          ) {
            filter = false;
          }
          break;
        case "ON-GROUND":
          if (filterParameters[key] !== null) {
            if (filterParameters[key] !== plane[this.filterIndexMap[key]]) {
              filter = false;
            }
          }
          break;
      }
    }

    return filter;
  }

  async renderPlanes() {
    //plus two to lift the planes up
    const globeRadius = 102;

    //remove all previous planes
    this.plane3dObjects.forEach((e, i) => {
      removeObject3D(e);
      window.scene.remove(e);
    });
    this.plane3dObjects = [];
    this.planeObjects = [];

    console.log("remove previous planes", {
      "planes objecs": this.planeObjects.length,
      "planes 3d objecs": this.plane3dObjects.length,
      children: this.children.length,
    });

    await this.fetchPlaneObjects();

    //get min and max velocity
    const velocityArray = this.planeObjects.map((e) => e[9]);

    const maxVelocity = Math.max.apply(null, velocityArray);
    const minVelocity = Math.min.apply(null, velocityArray);

    console.log("min velocity", minVelocity, "maxVelocity", maxVelocity);

    for (const plane of this.planeObjects) {
      //update country set
      this.updateCountrySet(this.countrySet, plane[2]);

      //filter out planes base on parameters
      if (this.checkPlaneOnParameter(this.filterParameters, plane)) {
        const aircraft = new Aircraft();
        const [x, y, z] = plane[8]
          ? latLonToCart(plane[6], plane[5], 0, 100)
          : latLonToCart(plane[6], plane[5], plane[7], globeRadius);
        const orientation = plane[10];
        aircraft.translateX(x);
        aircraft.translateY(y);
        aircraft.translateZ(z);
        aircraft.icao24 = plane[0];

        aircraft.lookAt(0, 0, 0);
        aircraft.rotateZ(THREE.MathUtils.degToRad(orientation));

        aircraft.material.color = new THREE.Color(
          plane[8] ? 0xffffff : 0xff0000
        );
        aircraft.material.emissive = new THREE.Color(
          plane[8] ? 0xffffff : 0xff0000
        );

        /* aircraft.material.color = setColorScale(
        plane[9],
        minVelocity,
        maxVelocity
      );
      console.log(setColorScale(plane[9], minVelocity, maxVelocity));
      aircraft.material.emissive = setColorScale(
        plane[9],
        minVelocity,
        maxVelocity
      ); */

        this.add(aircraft);
        this.plane3dObjects.push(aircraft);
      }
    }
    //removeTrack();

    console.log("after render new planes", {
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
  }

  updateCountrySet(set, country) {
    if (country !== "") {
      set.add(country);
    }
  }
}
