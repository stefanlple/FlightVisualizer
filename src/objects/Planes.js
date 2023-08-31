import * as THREE from "three";
import base64 from "base64-js";

import { latLonToCart } from "../utility/latLngToCartSystem";
import { removeObject3D } from "../utility/removeObject3D";
import {
  generateSubClusterListItems,
  clusterButton,
} from "../features/cluster";
import { continentsMap, continentsColorMap } from "../data/continentsMap";

import { username, password } from "../../info";

import Aircraft from "./Aircraft";

export default class Planes extends THREE.Group {
  constructor(state) {
    super();
    this.state = state;
    // Bind the `this` context of the `renderRealtimePlanes` method to `this`
    this.state.renderRealtimePlanes =
      this.state?.renderRealtimePlanes?.bind(this);
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
    this.continentsColorMap = continentsColorMap;

    //ON START
    (async () => {
      this.addEventListenerToButtons();
      this.getListItemNodes();
      this.manageFilterParameters();
      await this.renderPlanes();
      await generateSubClusterListItems(this.countrySet);

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
        clusterButton.innerHTML = "Group";
        console.log("filter-parameters", this.filterParameters);
        this.renderRealtimePlanes();
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
      this.renderRealtimePlanes();
      console.log("filter-parameters", this.filterParameters);
    });
  }

  async renderPlanes() {
    console.log("hahah", this);
    // Call `renderRealtimePlanes` in the context of `Planes`
    await this.state.renderRealtimePlanes();
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

  /*   async renderRealtimePlanes() {
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

    const fetchPlaneObjects = async () => {
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
    };

    await fetchPlaneObjects();

    //get min and max velocity
    const velocityArray = this.planeObjects.map((e) => e[9]);

    const maxVelocity = Math.max.apply(null, velocityArray);
    const minVelocity = Math.min.apply(null, velocityArray);

    console.log("min velocity", minVelocity, "maxVelocity", maxVelocity);

    for (const plane of this.planeObjects) {
      //update country set
      this.updateCountrySet(this.countrySet, plane[2]);

      const clusterText = clusterButton.innerHTML;

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

        const colorValue = plane[8] ? 0xffffff : 0xff0000;

        aircraft.material.color = new THREE.Color(colorValue);
        aircraft.material.emissive = new THREE.Color(colorValue);

        //Grouping by color
        if (clusterText !== "Group") {
          if (clusterText === "By Continent") {
            aircraft.material.color = new THREE.Color(
              this.continentsColorMap[this.findContinent(plane[2])]
            );
            aircraft.material.emissive = new THREE.Color(
              this.continentsColorMap[this.findContinent(plane[2])]
            );
          } else {
            if (plane[2] === clusterText) {
              aircraft.material.color = new THREE.Color(0x00ff00);
              aircraft.material.emissive = new THREE.Color(0x00ff00);
            }
          }
        }

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
  } */

  findContinent(countryName) {
    for (const continent in continentsMap) {
      if (continentsMap[continent].includes(countryName)) {
        return continent;
      }
    }
    return "Unknown Continent"; // If the country doesn't match any continent in the map
  }
}

class State {
  constructor() {
    // Constructor logic goes here
  }
}

export class HistoricalState extends State {
  constructor() {
    super();
    // Additional constructor logic for HistoricalState
  }
  async renderRealtimePlanes() {
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

    const fetchHistoricalFlightData = async (date) => {
      try {
        const url = `http://localhost:3000/api/flight/data?date=${date}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);
        this.planeObjects = data;
      } catch (error) {
        console.error("Fetch error:", error);
        throw error;
      }
    };

    await fetchHistoricalFlightData("2020-04-02");

    for (const plane of this.planeObjects) {
      /* console.log(plane); */
      //update country set
      //filter out planes base on parameters
      const aircraft = new THREE.Mesh(
        new THREE.SphereGeometry(0.15),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
      );

      const [x, y, z] = latLonToCart(
        plane.latitude_1,
        plane.longitude_1,
        plane.altitude_1,
        globeRadius
      );
      aircraft.translateX(x);
      aircraft.translateY(y);
      aircraft.translateZ(z);

      aircraft.lookAt(0, 0, 0);

      this.add(aircraft);
      this.plane3dObjects.push(aircraft);
    }

    console.log("after render new planes", {
      "planes objecs": this.planeObjects.length,
      "planes 3d objecs": this.plane3dObjects.length,
      children: this.children.length,
    });
  }
}

export class RealtimeState extends State {
  constructor() {
    super();
  }
  async renderRealtimePlanes() {
    console.log("hello this", this);
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

    const fetchPlaneObjects = async () => {
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
    };

    await fetchPlaneObjects();

    //get min and max velocity
    const velocityArray = this.planeObjects.map((e) => e[9]);

    const maxVelocity = Math.max.apply(null, velocityArray);
    const minVelocity = Math.min.apply(null, velocityArray);

    console.log("min velocity", minVelocity, "maxVelocity", maxVelocity);

    const updateCountrySet = (set, country) => {
      if (country !== "") {
        set.add(country);
      }
    };

    for (const plane of this.planeObjects) {
      //update country set
      updateCountrySet(this.countrySet, plane[2]);

      const clusterText = clusterButton.innerHTML;

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

        const colorValue = plane[8] ? 0xffffff : 0xff0000;

        aircraft.material.color = new THREE.Color(colorValue);
        aircraft.material.emissive = new THREE.Color(colorValue);

        //Grouping by color
        if (clusterText !== "Group") {
          if (clusterText === "By Continent") {
            aircraft.material.color = new THREE.Color(
              this.continentsColorMap[this.findContinent(plane[2])]
            );
            aircraft.material.emissive = new THREE.Color(
              this.continentsColorMap[this.findContinent(plane[2])]
            );
          } else {
            if (plane[2] === clusterText) {
              aircraft.material.color = new THREE.Color(0x00ff00);
              aircraft.material.emissive = new THREE.Color(0x00ff00);
            }
          }
        }

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
}
