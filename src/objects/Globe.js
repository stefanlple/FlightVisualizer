import * as THREE from "three";
import Vertex from "../shaders/Vertex.glsl";
import Fragment from "../shaders/Fragment.glsl";

import AtmosphereVertexShader from "../shaders/AtmosphereVertexShader.glsl";
import AtmosphereFragmentShader from "../shaders/AtmosphereFragmentShader.glsl";

import { latLonToCart } from "../utility/latLonToCartSystem";
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
        "./src/images/No_Cloud_Earth_Map.jpg",
        (texture) => {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.offset.x = 1.5708 / (2 * Math.PI);
        }
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

    const geometry = new THREE.SphereGeometry(2);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const ball = new THREE.Mesh(geometry, material);
    ball.name = "LA";
    ball.translateX(latLonToCart(34.052235, -118.243683, globeRadius)[0]);
    ball.translateY(latLonToCart(34.052235, -118.243683, globeRadius)[1]);
    ball.translateZ(latLonToCart(34.052235, -118.243683, globeRadius)[2]);
    this.add(ball);

    async function logJSONData() {
      console.log("hallo");
      const response = await fetch(
        "https://opensky-network.org/api/states/all?icao24=4b43ad"
      );
      const jsonData = await response.json();
      console.log(jsonData);
      const lat = jsonData.states[0][5];
      const lng = jsonData.states[0][6];
      console.log(jsonData, lat, lng);
      const ball1 = new THREE.Mesh(geometry, material1);
      ball1.name = "Germany";
      ball1.translateZ(latLonToCart(lat, lng, globeRadius)[2]);
      ball1.translateX(latLonToCart(lat, lng, globeRadius)[0]);
      ball1.translateY(latLonToCart(lat, lng, globeRadius)[1]);
      console.log(this);
      this.add(ball1);
      console.log(this);
    }
    logJSONData();

    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(globeRadius + 0.01),
      new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load(
          "./src/images/Clouds_Map_Earth.png"
        ),
        transparent: true,
      })
    );
    this.add(clouds);

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
  }
}
