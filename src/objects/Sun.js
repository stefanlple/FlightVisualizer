import * as THREE from "three";

import { getDayOfYear } from "../utility/getDayOfYear";

import { calculateLinearPosition } from "../utility/calculateLinearPosition";

import { latLonToCart } from "../utility/latLngToCartSystem";

export default class Sun extends THREE.Group {
  constructor() {
    super();
    this.name = "sun";
    this.addParts();
    this.directionalLight;
    this.directionalLightTarget;
    this.helper;
  }

  addParts() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    const helper = new THREE.DirectionalLightHelper(directionalLight, 50);
    helper.color = 0xf1f100;
   
    directionalLight.target.position.set(0, 0, 0);
    this.add(directionalLight);
    this.add(directionalLight.target);
    this.add(helper);
    this.helper=helper;
    this.directionalLightTarget=directionalLight.target;
    this.directionalLight=directionalLight;
  }

   getSubsolarPoint = (timestamp) => {
    // Convert the Unix timestamp to JavaScript Date object
    const currentDate = new Date(timestamp);
  
    // Get the day of the year (1 to 365 or 366 for leap years)
    const startOfYear = new Date(currentDate.getUTCFullYear(), 0, 1); // January 1st of the current year
    const diffInMilliseconds = currentDate - startOfYear;
    const dayOfYear = Math.floor(diffInMilliseconds / (24 * 60 * 60 * 1000)) + 1;
  
    const subsolarPointLatitude =
      -23.44 * Math.cos((((360 / 180) * Math.PI) / 365) * (dayOfYear + 10));
  
    const hours = currentDate.getUTCHours();
    const minutes = currentDate.getUTCMinutes();
    const seconds = currentDate.getUTCSeconds();
  
    // Calculate the total time of the day in seconds
    const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
  
    const currentYear = currentDate.getUTCFullYear();
  
    const deltaTime =
      -7.659 *
        Math.sin(
          6.24004077 + 0.01720197 * (365.25 * (currentYear - 2000) + dayOfYear)
        ) +
      9.863 *
        Math.sin(
          2 *
            (6.24004077 +
              0.01720197 * (365.25 * (currentYear - 2000) + dayOfYear)) +
            3.5932
        );
  
    const subsolarPointLongitude =
      -15 * (totalTimeInSeconds / 60 / 60 - 12 + deltaTime / 60);
  
    return {
      latitude: subsolarPointLatitude,
      longitude: subsolarPointLongitude
    };
  };

  updateSun(){
    this.directionalLightTarget.updateWorldMatrix();
    this.directionalLight.updateMatrixWorld();
    this.helper.update();
  }
}