import { OrbitControls } from "./controls/OrbitControls.js";

export default class TableScene {
  constructor(THREE, window, document) {
    this.lights = [];
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

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    this.lights.push(light);
    this.scene.add(light);

    var light = new THREE.DirectionalLight(0x002288);
    light.position.set(-1, -1, -1);
    this.lights.push(light);
    this.scene.add(light);

    var light = new THREE.AmbientLight(0x222222);
    this.lights.push(light);
    this.scene.add(light);

    //this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }
  getTHREE() {
    return this.THREE;
  }
  getScene() {
    return this.scene;
  }
  getRenderer() {
    return this.renderer;
  }
  getCamera() {
    return this.camera;
  }
  getControls() {
    return this.controls;
  }
  getLights() {
    return this.lights;
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
