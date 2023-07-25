import * as THREE from "three";

export default class Airport extends THREE.Group {
  constructor(icao, airportname) {
    super();
    this.name = "airport";
    this.airportname = airportname;
    this.icao = icao;
    this.addParts();
  }

  addParts() {
    const airport = new THREE.Mesh(
      new THREE.CircleGeometry(0.3),
      new THREE.MeshBasicMaterial({ color: 0x0000ab })
    );

    this.add(airport);
  }
}
