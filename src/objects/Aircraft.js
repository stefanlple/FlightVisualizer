import * as THREE from "three";

export default class Aircraft extends THREE.Group {
  constructor() {
    super();
    this.icao24 = "";
    this.addParts();
  }

  addParts() {
    const DIVIDE = 25;
    // prettier-ignore
    const positions = [
      0, 0, 0.8,      
      -0.2, 0.2, 0.4, 
      0.2, 0.2, 0.4, 
      0.2, -0.2, 0.4, 
      -0.2, -0.2, 0.4, 
      -0.2, 0.2, 0, 
      0.2, 0.2, 0, 
      0.2, -0.2, 0, 
      -0.2, -0.2, 0, 
      -0.2, 0.2, -0.4, 
      0.2, 0.2, -0.4, 
      0.2, -0.2, -0.4, 
      -0.2, -0.2, -0.4, 
      -0.14, 0.14, -0.5, 
      0.14, 0.14, -0.5, 
      0.14, -0.14, -0.5, 
      -0.14, -0.14, -0.5
    ]
    console.log(positions);
    // prettier-ignore
    const indices = [
      //every 3 indices is a triangle
      //top
      1, 0, 2, 2, 0, 3, 3, 0, 4, 4, 0,  1,
      //front corpus
      1, 2, 6, 5, 1, 6, 2, 3, 7, 6, 2, 7, 3, 4, 8, 7, 3, 8, 4, 1, 5, 4, 5, 8,
      //back corpus
      5, 6, 10, 9, 5, 10, 6, 7, 11, 10, 6, 11, 7, 8, 12, 11, 7, 12, 8, 5, 9, 8, 9, 12,
      //end corpus
      9, 10, 14, 13, 9, 14, 10, 11, 15, 14, 10, 15, 11, 12, 16, 15, 11, 16, 12, 9, 13, 12, 13, 16,
      //close end
      13,14,15,13,15,16  

    ];

    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      //side: THREE.DoubleSide,
    });

    const corpusGeometry = new THREE.BufferGeometry();
    corpusGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(positions), 3)
    );
    corpusGeometry.setIndex(indices);
    corpusGeometry.computeVertexNormals();
    const corpus = new THREE.Mesh(corpusGeometry, material);
    this.add(corpus);

    const materialDoubleSide = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
    });

    const wing = new THREE.Mesh(
      new THREE.PlaneGeometry(1.28, 0.56),
      materialDoubleSide
    );
    wing.rotateX(Math.PI / 2);
    this.add(wing);
  }
}
