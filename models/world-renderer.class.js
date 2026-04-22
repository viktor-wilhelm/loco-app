/**
 * Handles all rendering and overlay drawing for the World class.
 * @class WorldRenderer
 */
class WorldRenderer {
  /**
   * @param {World} world - The world instance
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Draws the entire game field including HUD and overlays.
   */
  draw() {
    this.drawBackground();
    this.drawHUD();
    this.drawWorld();
    this.drawOverlay(this.world.gameOver, this.world.gameOverImages, this.world.gameOverStep);
    this.drawOverlay(this.world.gameWon, this.world.gameWonImages, this.world.gameWonStep);
    requestAnimationFrame(() => {
      if (!this.world.paused) this.draw();
    });
  }

  /**
   * Draws the background including parallax effect.
   */
  drawBackground() {
    const { ctx, canvas, level } = this.world;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#5dbde0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.addBackgroundObjectsParallax(level.backgroundObjects);
    this.addBackgroundObjectsParallax(level.clouds);
  }

  /**
   * Draws the status bars (HUD).
   */
  drawHUD() {
    this.addToMap(this.world.statusBar);
    this.addToMap(this.world.coinBar);
    this.addToMap(this.world.bottleBar);
    this.addToMap(this.world.endbossBar);
  }

  /**
   * Draws all game objects (character, enemies, items).
   */
  drawWorld() {
    const { ctx, camera_x, level, throwableObjects, character } = this.world;
    ctx.translate(camera_x, 0);
    this.addObjectsToMap(level.enemies);
    this.addObjectsToMap(level.coins);
    this.addObjectsToMap(level.bottles);
    this.addObjectsToMap(throwableObjects);
    this.addToMap(character);
    ctx.translate(-camera_x, 0);
  }

  /**
   * Draws an overlay (game over, win).
   * @param {boolean} active - Overlay active
   * @param {Image[]} images - Overlay images
   * @param {number} step - Current step
   */
  drawOverlay(active, images, step) {
    const { ctx, canvas } = this.world;
    if (!active || step < 0 || !images[step]) return;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const img = images[step];
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.85;
    const dw = img.width * scale;
    const dh = img.height * scale;
    ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
  }

  /**
   * Draws background objects with parallax effect.
   * @param {object[]} backgroundObjects - Background objects
   */
  addBackgroundObjectsParallax(backgroundObjects) {
    const { ctx, camera_x } = this.world;
    backgroundObjects.forEach((bg) => {
      ctx.save();
      const parallaxX = camera_x * bg.parallaxSpeed;
      ctx.translate(parallaxX, 0);
      bg.draw(ctx);
      ctx.restore();
    });
  }

  /**
   * Adds multiple objects to the canvas.
   * @param {object[]} objects - The objects
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Adds an object to the canvas.
   * @param {object} mo - The object
   */
  addToMap(mo) {
    const { ctx } = this.world;
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips the image of an object horizontally.
   * @param {object} mo - The object
   */
  flipImage(mo) {
    const { ctx } = this.world;
    ctx.save();
    ctx.translate(mo.width, 0);
    ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Resets the horizontal flip of an object.
   * @param {object} mo - The object
   */
  flipImageBack(mo) {
    const { ctx } = this.world;
    mo.x = mo.x * -1;
    ctx.restore();
  }
}
