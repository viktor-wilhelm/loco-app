/**
 * Represents a background layer object for parallax scrolling.
 * Handles drawing and parallax speed for the game background.
 * @class BackgroundObject
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * Creates a new BackgroundObject.
   * @param {string} imagePath - Path to the background image
   * @param {number} x - X position of the background
   * @param {number} [parallaxSpeed=1] - Parallax speed factor
   */
  constructor(imagePath, x, parallaxSpeed = 1) {
    super();
    this.parallaxSpeed = parallaxSpeed;
    this.loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height; // 480 - 400 = 80
  }
}
