class BottlePickup extends DrawableObject {
  width = 60;
  height = 80;
  currentImage = 0;
  offset = { top: 0, bottom: 0, left: 0, right: 0 };

  /**
   * @param {number} x - X-Position der Flasche
   * @param {number} y - Y-Position der Flasche
   */
  constructor(x, y) {
    super();
    this.loadImages(IMAGES_BOTTLE_GROUND);
    this.img = this.imageCache[IMAGES_BOTTLE_GROUND[0]];
    this.x = x;
    this.y = y;
    this.animate();
  }

  animate() {
    setStoppableInterval(() => {
      this.currentImage = (this.currentImage + 1) % IMAGES_BOTTLE_GROUND.length;
      this.img = this.imageCache[IMAGES_BOTTLE_GROUND[this.currentImage]];
    }, 400);
  }
}
