import { DragControls } from "./controls/DragControls.js";

export default class Card {
  constructor(
    tableScene,
    _geometry,
    _geometryBack,
    _material,
    _materialBack,
    _loader,
    _loaderBack
  ) {
    let THREE = tableScene.getTHREE();

    if (_loader && _loaderBack) {
      this.loader = _loader;
      this.loaderBack = _loaderBack;
    } else {
      this.loader = new THREE.TextureLoader();
      this.loaderBack = new THREE.TextureLoader();
    }

    if (_geometry) {
      this.geometry = _geometry;
      this.geometryBack = _geometryBack;
    } else {
      this.geometry = new THREE.PlaneGeometry(1.25, 1.75);
      this.geometryBack = new THREE.PlaneGeometry(1.25, 1.75);

      this.geometry.applyMatrix(
        new THREE.Matrix4().makeRotationX(Math.PI * 1.5)
      );
      this.geometryBack.applyMatrix(
        new THREE.Matrix4().makeRotationX(Math.PI * 1.5)
      );      
      this.geometryBack.applyMatrix(
        new THREE.Matrix4().makeRotationY(Math.PI * 1)
      );      
      
    }

    if (_material && _materialBack) {
      this.material = _material;
      this.materialBack = _materialBack;
    } else {
      this.material = new THREE.MeshBasicMaterial({
        map: this.loader.load("enneagram_cards_back.png"),
      });
      this.materialBack = new THREE.MeshBasicMaterial({
        map: this.loaderBack.load("enneagram_cards_1.png"),
      });
    }

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.meshBack = new THREE.Mesh(this.geometryBack, this.materialBack);
    this.meshBack.rotateX(Math.PI)
    

    this.group = new THREE.Group();
  
    this.group.add( this.mesh );
    this.group.add( this.meshBack );


   // tableScene.getScene().add(this.group);
    /*
   tableScene.getScene().add(this.mesh)
   tableScene.getScene().add(this.meshBack)
   */

    this.mesh.addEventListener("mouseover", (event) => {
      console.log("mouseover");
      console.log(event);
    });
    this.mesh.addEventListener("mouseout", (event) => {
      console.log("mouseout");
      console.log(event);
    });
/*    
    this.controls = new DragControls(
      [this.getMesh()],
      tableScene.getCamera(),
      tableScene.getRenderer().domElement
    );
*/
  }

  getMesh() {
    return this.group;
  }
  clone(tableScene) {
    let newCard = new Card(
      tableScene,
      this.geometry,
      this.geometryBack,
      this.material,
      this.materialBack,
      this.loader,
      this.loaderBack
    );
    return newCard;
  }
}
