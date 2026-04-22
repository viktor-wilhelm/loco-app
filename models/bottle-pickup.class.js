/**
 * Represents a collectible bottle pickup item in the game world.
 * @class BottlePickup
 * @extends DrawableObject
 */
class BottlePickup extends DrawableObject {
  width = 60;
  height = 80;
  currentImage = 0;
  offset = { top: 0, bottom: 0, left: 0, right: 0 };

  /**
   * Creates a new BottlePickup instance.
   * @param {number} x - X position of the bottle
   * @param {number} y - Y position of the bottle
   */
  constructor(x, y) {
    super();
    this.loadImages(IMAGES_BOTTLE_GROUND);
    this.img = this.imageCache[IMAGES_BOTTLE_GROUND[0]];
    this.x = x;
    this.y = y;
    this.animate();
  }

  /**
   * Starts the bottle animation interval.
   */
  animate() {
    setStoppableInterval(() => {
      this.currentImage = (this.currentImage + 1) % IMAGES_BOTTLE_GROUND.length;
      this.img = this.imageCache[IMAGES_BOTTLE_GROUND[this.currentImage]];
    }, 400);
  }
}
