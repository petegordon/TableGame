class TableScene {
  constructor(THREE, window, document) {
    this.window = window;
    this.THREE = THREE;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }
  getTHREE() {
    return this.THREE;
  }
  getScene() {
    return this.scene;
  }
  getCamera() {
    return this.camera;
  }
  initAnimate(obj) {
    this.window.requestAnimationFrame((t) => this.animate(obj));
  }
  animate(obj) {
    obj.rotation.x += 0.01;
    obj.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
    this.initAnimate(obj);
  }
}