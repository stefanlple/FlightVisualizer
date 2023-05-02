import * as THREE from "three";
import Vertex from "../shaders/Vertex.glsl";
import Fragment from "../shaders/Fragment.glsl";

import AtmosphereVertexShader from "../shaders/AtmosphereVertexShader.glsl";
import AtmosphereFragmentShader from "../shaders/AtmosphereFragmentShader.glsl";

export default class Globe extends THREE.Group {
  constructor() {
    super();
    this.name = "globe";
    this.addParts();
  }

  addParts() {
    const globeRadius = 100;
    const globeGeometry = new THREE.SphereGeometry(globeRadius);
    const globeMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      map: new THREE.TextureLoader().load(
        "./src/images/No_Cloud_Earth_Map.jpg"
      ),
      bumpMap: new THREE.TextureLoader().load(
        "./src/images/Elevation_BumpMap_Earth.jpeg"
      ),
      bumpScale: 0.005,
      /* specularMap: new THREE.TextureLoader().load(
        "./src/images/Water_SpecularMap_Earth.png"
      ),
      specular: new THREE.Color("grey"), */
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    this.add(globe);

    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(globeRadius + 0.01),
      new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load(
          "./src/images/Clouds_Map_Earth.png"
        ),
        transparent: true,
      })
    );
    //this.add(clouds);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(globeRadius, 50, 50),
      new THREE.ShaderMaterial({
        vertexShader: AtmosphereVertexShader,
        fragmentShader: AtmosphereFragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      })
    );

    atmosphere.scale.set(1.05, 1.05, 1.05);

    scene.add(atmosphere);
  }
}
