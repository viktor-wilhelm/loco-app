/**
 * Represents a status bar (health, coins, bottles, endboss) displayed in the HUD.
 * @class StatusBar
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
  percentage = 100;

  /**
   * Creates a new StatusBar instance.
   * @param {number} y - Y position of the status bar
   * @param {string[]} images - Array of image paths for each fill state
   * @param {number} [initialPercentage=100] - Initial percentage value
   */
  constructor(y, images, initialPercentage = 100) {
    super();
    this.loadImages(images);
    this.images = images;
    this.setPercentage(initialPercentage);
    this.x = 10;
    this.y = y;
    this.width = 200;
    this.height = 55;
  }

  /**
   * Sets the bar to the given percentage and updates the displayed image.
   * @param {number} percentage - Value between 0 and 100
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.images[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the image index based on the current percentage (0–5).
   * @returns {number} Index between 0 and 5
   */
  resolveImageIndex() {
    return Math.min(5, Math.floor(this.percentage / 20));
  }
}
