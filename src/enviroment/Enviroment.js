import * as THREE from "three";
import * as DATGUI from "datgui";
import * as CANNON from "../../lib/cannon-es-0.20.0/dist/cannon-es.js";
import { Reflector } from "../../lib/three.js-r145/examples/jsm/objects/Reflector.js";
import { FontLoader } from "../../lib/three.js-r145/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "../../lib/three.js-r145/examples/jsm/geometries/TextGeometry.js";

export default class Enviroment extends THREE.Group {
  constructor() {
    super();

    this.ballList = [];
    this.addParts();
  }

  addParts() {}
}
