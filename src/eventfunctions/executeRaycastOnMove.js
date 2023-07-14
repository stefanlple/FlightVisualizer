import * as THREE from "three";

window.raycaster = new THREE.Raycaster();

let hoveredObject = null;

export function executeRaycastOnMove() {
  window.raycaster.setFromCamera(window.mousePosition, window.camera);
  let intersects = window.raycaster.intersectObject(window.scene, true);

  if (intersects.length > 0) {
    let firstHit = intersects[0].object;
    firstHit.traverseAncestors((e) => {
      if (e.name === "aircraft") {
        if (e !== hoveredObject) {
          if (hoveredObject && hoveredObject.userData.originalColor) {
            hoveredObject.material.color.copy(
              hoveredObject.userData.originalColor
            );
            hoveredObject.material.emissive.copy(
              hoveredObject.userData.originalEmissiveColor
            );
          }

          hoveredObject = e;
          if (!e.userData.originalColor) {
            e.userData.originalColor = e.material.color.clone();
            e.userData.originalEmissiveColor = e.material.emissive.clone();
          }

          e.material.color = new THREE.Color(0x00ff00);
          e.material.emissive = new THREE.Color(0x00ff00);
        }
      }
    });
  }
  if (intersects.length <= 3) {
    if (hoveredObject && hoveredObject.userData.originalColor) {
      hoveredObject.material.color.copy(hoveredObject.userData.originalColor);
      hoveredObject.material.emissive.copy(
        hoveredObject.userData.originalEmissiveColor
      );
    }
    hoveredObject = null;
  }
}
