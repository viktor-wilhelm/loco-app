/**
 * Base class for all drawable game objects.
 * Provides image loading, caching, and drawing functionality.
 * @class DrawableObject
 */
class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 800;
  y = 280;
  height = 150;
  width = 100;
  offset = { top: 0, bottom: 0, left: 0, right: 0 };

  /**
   * Loads a single image from the given path.
   * @param {string} path - Path to the image file
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the current image on the canvas.
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  draw(ctx) {
    if (this.img && this.img.complete && this.img.naturalWidth > 0) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Loads multiple images into the image cache.
   * @param {string[]} arr - Array of image paths to preload
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
