class TableObject {
  constructor(THREE, scene, camera) {
    this.geometry = new THREE.BoxGeometry();
    this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    scene.add(this.cube);

    camera.position.z = 5;
  }
  getObject() {
    return this.cube;
  }
}
