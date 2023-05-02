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

    function latLonToCart(inputLat, inputLng) {
      const lat = inputLat * (Math.PI / 180);
      const lng = inputLng * (Math.PI / 180);

      const z = globeRadius * Math.cos(lat) * Math.cos(lng);
      const x = globeRadius * Math.cos(lat) * Math.sin(lng);
      const y = globeRadius * Math.sin(lat);
      return [x, y, z];
    }

    const geometry = new THREE.SphereGeometry(2);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const ball = new THREE.Mesh(geometry, material);
    ball.name = "ball";
    ball.translateX(latLonToCart(34.052235, -118.243683)[0]);
    ball.translateY(latLonToCart(34.052235, -118.243683)[1]);
    ball.translateZ(latLonToCart(34.052235, -118.243683)[2]);
    this.add(ball);

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
