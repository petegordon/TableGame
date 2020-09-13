export default class TableObject {
  constructor(THREE, scene, camera) {
    this.geometry = new THREE.TorusGeometry(1, 0.4, 16, 50);
    this.material = new THREE.MeshLambertMaterial({ color: 0xff00ff });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    scene.add(this.cube);

    camera.position.z = 5;
  }
  getObject() {
    return this.cube;
  }
}
