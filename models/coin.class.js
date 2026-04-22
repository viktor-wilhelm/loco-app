/**
 * Represents a collectible coin with a spinning animation.
 * @class Coin
 * @extends DrawableObject
 */
class Coin extends DrawableObject {
  width = 110;
  height = 110;
  currentImage = 0;

  /**
   * Creates a new Coin instance.
   * @param {number} x - X position of the coin
   * @param {number} y - Y position of the coin
   */
  constructor(x, y) {
    super();
    this.loadImages(IMAGES_COIN_SPIN);
    this.img = this.imageCache[IMAGES_COIN_SPIN[0]];
    this.x = x;
    this.y = y;
    this.animate();
  }

  /**
   * Starts the coin spin animation interval.
   */
  animate() {
    setStoppableInterval(() => {
      this.currentImage = (this.currentImage + 1) % IMAGES_COIN_SPIN.length;
      this.img = this.imageCache[IMAGES_COIN_SPIN[this.currentImage]];
    }, 300);
  }
}
