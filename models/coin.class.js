class Coin extends DrawableObject {
  width = 110;
  height = 110;
  currentImage = 0;

  /**
   * @param {number} x - X-Position der Münze
   * @param {number} y - Y-Position der Münze
   */
  constructor(x, y) {
    super();
    this.loadImages(IMAGES_COIN_SPIN);
    this.img = this.imageCache[IMAGES_COIN_SPIN[0]];
    this.x = x;
    this.y = y;
    this.animate();
  }

  animate() {
    setStoppableInterval(() => {
      this.currentImage = (this.currentImage + 1) % IMAGES_COIN_SPIN.length;
      this.img = this.imageCache[IMAGES_COIN_SPIN[this.currentImage]];
    }, 300);
  }
}
