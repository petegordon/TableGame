import { OrbitControls } from "./controls/OrbitControls.js";

export default class TableScene {
  constructor(THREE, window, document) {
    this.pickHelper = new PickHelper();
    this.pickPosition = { x: 0, y: 0 };
    this.clearPickPosition();

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
      new THREE.PlaneGeometry(10, 10, 10, 10),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
      })
    );

    this.scene.add(plane);

    console.log(this.camera.position);
    this.camera.position.z = 10;
    console.log(this.camera.position);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    window.addEventListener("mousemove", (e) => {
      this.setPickPosition(e);
    });
    window.addEventListener("mouseout", (e) => {
      this.clearPickPosition(e);
    });
    window.addEventListener("mouseleave", (e) => {
      this.clearPickPosition(e);
    });
  }
  setPickPosition(event) {
    let rect = this.canvas.getBoundingClientRect();
    let pos = {
      x: ((event.clientX - rect.left) * this.canvas.width) / rect.width,
      y: ((event.clientY - rect.top) * this.canvas.height) / rect.height,
    };
    this.pickPosition.x = (pos.x / this.canvas.width) * 2 - 1;
    this.pickPosition.y = (pos.y / this.canvas.height) * -2 + 1; // note we flip Y

    //if (new Date().getTime() % 2000 == 0)
    //console.log(this.pickPosition);
  }
  clearPickPosition() {
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
    this.pickPosition.x = -100000;
    this.pickPosition.y = -100000;
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

    this.pickHelper.pick(this.pickPosition, this.scene, this.camera, time);
    this.renderer.render(this.scene, this.camera);
    this.initAnimate(obj);
  }
}

class PickHelper {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }
  pick(normalizedPosition, scene, camera, time) {
    // restore the color if there is a picked object
    if (this.pickedObject && this.pickedObject.material.emissive) {
      this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
      this.pickedObject = undefined;
    }

    // cast a ray through the frustum
    this.raycaster.setFromCamera(normalizedPosition, camera);

    // get the list of objects the ray intersected
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);

    //    console.log(intersectedObjects.length);
    if (intersectedObjects.length) {
      // pick the first object. It's the closest one
      this.pickedObject = intersectedObjects[0].object;
      //      console.log(this.pickedObject);
      // save its color
      if (this.pickedObject.material.emissive) {
        this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
        // set its emissive color to flashing red/yellow
        console.log("mouseover???");
        this.pickedObject.material.emissive.setHex(
          (time * 8) % 2 > 1 ? 0xffff00 : 0xff0000
        );
      }
    }
  }
}
