import { DragControls } from "./controls/DragControls.js";

export default class VideoPlaneMesh {
  constructor(tableScene, video, index) {
    let THREE = tableScene.getTHREE();
    this.video = video;
    this.geometry = new THREE.PlaneBufferGeometry(10, 6);
    this.geometry.scale(0.5, 0.5, 0.5);

    this.texture = new THREE.VideoTexture(video);
    this.material = new THREE.MeshBasicMaterial({ map: this.texture });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.lookAt(tableScene.getCamera().position);
    //this.mesh.rotation.x = 0.3;
    this.mesh.rotation.y = 0.45 * index;
    //    this.mesh.position.setY(200 * positionY);
    tableScene.getScene().add(this.mesh);
  }
  getGeometry() {
    return this.geometry;
  }
  getTexture() {
    return this.texture;
  }
  getMaterial() {
    return this.material;
  }
  getMesh() {
    return this.mesh;
  }
  getVideoElement() {
    return this.video;
  }
}