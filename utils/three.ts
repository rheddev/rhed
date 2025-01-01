import * as THREE from "three";
// import {
//   TextGeometry,
//   TextGeometryParameters,
// } from "three/addons/geometries/TextGeometry.js";
import { RefObject } from "react";
// import { Font } from "three/examples/jsm/loaders/FontLoader.js";

// export function text3D(
//   camera: THREE.PerspectiveCamera,
//   text: string,
//   position: THREE.Vector3,
//   colors: {
//     front: THREE.ColorRepresentation;
//     side: THREE.ColorRepresentation;
//   },
//   fonts: {
//     regular: Font;
//     italic?: Font;
//     bold?: Font;
//     boldItalic?: Font;
//   },
//   geometryParams?: Partial<TextGeometryParameters>
// ): THREE.Group<THREE.Object3DEventMap> {
//   // Text
//   const textGeometry = new TextGeometry(text || "Hello World", {
//     ...geometryParams,
//     font: fonts.regular,
//   });

//   const textMesh = new THREE.Mesh(textGeometry, [
//     new THREE.MeshBasicMaterial({ color: colors.front }),
//     new THREE.MeshBasicMaterial({ color: colors.side }),
//   ]);

//   // Create a bounding box:
//   const box = new THREE.Box3().setFromObject(textMesh);

//   // Reset mesh position:
//   box.getCenter(textMesh.position);
//   textMesh.position.multiplyScalar(-1);

//   // Then add the mesh to a pivot object:
//   const pivot = new THREE.Group();
//   pivot.add(textMesh);

//   pivot.position.x = position.x;
//   pivot.position.y = position.y;
//   pivot.position.z = position.z;

//   const opposite = Math.abs(position.y - camera.position.y);
//   const adjacent = Math.abs(position.z - camera.position.z);

//   const radians = opposite / adjacent;

//   textMesh.rotation.x = -radians;

//   return pivot;
// }

export function floatingObject(
  object: RefObject<THREE.Object3D | null>,
  elapsedTime: number,
  wave: "sin" | "cos",
  oscillation: Partial<OscillationParameters> = {}
) {
  // Default values for each axis if not provided
  const defaultAxis = { amplitude: 0, frequency: 0 };

  const xParams = { ...defaultAxis, ...oscillation.x };
  const yParams = { ...defaultAxis, ...oscillation.y };
  const zParams = { ...defaultAxis, ...oscillation.z };

  if (object.current) {
    object.current.rotation.x =
      wave === "sin"
        ? Math.sin(elapsedTime * xParams.frequency) * xParams.amplitude
        : Math.cos(elapsedTime * xParams.frequency) * xParams.amplitude;

    object.current.rotation.y =
      wave === "sin"
        ? Math.sin(elapsedTime * yParams.frequency) * yParams.amplitude
        : Math.cos(elapsedTime * yParams.frequency) * yParams.amplitude;

    object.current.rotation.z =
      wave === "sin"
        ? Math.sin(elapsedTime * zParams.frequency) * zParams.amplitude
        : Math.cos(elapsedTime * zParams.frequency) * zParams.amplitude;
  }
}
