import { DragControls } from "./controls/DragControls.js";

export default class Card {
  constructor(tableScene) {
    let THREE = tableScene.getTHREE();
    this.loader = new THREE.TextureLoader();
    this.geometry = new THREE.PlaneGeometry(1.25, 1.75);
    this.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI * 1.8));
    this.material = new THREE.MeshBasicMaterial({
      map: this.loader.load("enneagram_cards_back.png"),
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    //this.mesh.position.set();
    tableScene.getScene().add(this.mesh);
    this.loaderBack = new THREE.TextureLoader();
    this.geometryBack = new THREE.PlaneGeometry(1.25, 1.75);
    this.geometryBack.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI));
    this.geometryBack.applyMatrix(
      new THREE.Matrix4().makeRotationX(Math.PI * 1.8)
    );
    this.materialBack = new THREE.MeshBasicMaterial({
      map: this.loaderBack.load("enneagram_cards_1.png"),
    });
    this.meshBack = new THREE.Mesh(this.geometryBack, this.materialBack);
    tableScene.getScene().add(this.meshBack);

    this.mesh.addEventListener("mouseover", (event) => {
      console.log("mouseover");
      console.log(event);
    });
    this.mesh.addEventListener("mouseout", (event) => {
      console.log("mouseout");
      console.log(event);
    });
    this.controls = new DragControls(
      [this.getMesh()],
      tableScene.getCamera(),
      tableScene.getRenderer().domElement
    );
  }
  getMesh() {
    return this.mesh;
  }
}
