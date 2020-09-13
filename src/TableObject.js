import { DragControls } from "./controls/DragControls.js";

export default class TableObject {
  constructor(tableScene) {
    let THREE = tableScene.getTHREE();
    this.geometry = new THREE.TorusGeometry(1, 0.4, 16, 50);
    this.material = new THREE.MeshLambertMaterial({
      color: 0xff00ff,
    });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    tableScene.getScene().add(this.cube);

    tableScene.getCamera().position.z = 5;

    this.controls = new DragControls(
      [this.getMesh()],
      tableScene.getCamera(),
      tableScene.getRenderer().domElement
    );

    // add event listener to highlight dragged objects

    this.controls.addEventListener("dragstart", function (event) {
      event.object.material.emissive.set(0xaaaaaa);
    });

    this.controls.addEventListener("dragend", function (event) {
      event.object.material.emissive.set(0x000000);
    });
  }
  getMesh() {
    return this.cube;
  }
}
