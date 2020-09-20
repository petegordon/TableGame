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
    this.canvas = this.renderer.domElement;
    document.body.appendChild(this.canvas);

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

    var size = 10;
    var divisions = 10;

    var gridHelper = new THREE.GridHelper(size, divisions);
    this.scene.add(gridHelper);

    // each square
    var planeW = window.innerWidth; // pixels
    var planeH = window.innerHeight; // pixels
    var plane = new THREE.Mesh(
      new THREE.PlaneGeometry(planeW / 2, planeH / 2, 200, 200),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
      })
    );

    this.scene.add(plane);

    //this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }
  getTHREE() {
    return this.THREE;
  }
  getCanvas() {
    return this.canvas;
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
    this.window.requestAnimationFrame((t) => this.animate(obj, t));
    //    this.window.addEventListener("mouseover", this.onMouseMove, false);
  }
  animate(obj, time) {
    obj.rotation.x += 0.01;
    obj.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
    this.initAnimate(obj);
  }
}
