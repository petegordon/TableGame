export default class Card {
  constructor(tableScene) {
    let THREE = tableScene.getTHREE();
    this.geometry = new THREE.PlaneGeometry(1.25, 1.75);
    this.loader = new THREE.TextureLoader();

    this.material = new THREE.MeshBasicMaterial({
      map: this.loader.load("enneagram_cards_back.png"),
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    //this.mesh.position.set();
    tableScene.getScene().add(this.mesh);

    this.mesh.addEventListener("mouseover", (event) => {
      console.log("mouseover");
      console.log(event);
    });
    this.mesh.addEventListener("mouseout", (event) => {
      console.log("mouseout");
      console.log(event);
    });
  }
}
