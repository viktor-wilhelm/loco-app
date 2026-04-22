/**
 * Base class for all moving game objects.
 * Extends DrawableObject with physics, collision, and animation logic.
 * @class MovableObject
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  /**
   * Applies gravity to the object by updating its vertical position each tick.
   */
  applyGravity() {
    setStoppableInterval(() => {
      if (this.world && this.world.paused) return;
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } else if (this.speedY < 0) {
        this.speedY = 0;
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the object is above ground level.
   * ThrowableObjects always return true.
   * @returns {boolean}
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      // throwable objects should always fall
      return true;
    } else {
      return this.y < 200;
    }
  }

  /**
   * Checks if this object is colliding with another movable object.
   * @param {MovableObject} mo - The other object
   * @returns {boolean}
   */
  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  /**
   * Reduces energy by 5 and records the hit timestamp.
   */
  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Restores energy by the given amount, capped at 100.
   * @param {number} amount - Amount of energy to restore
   */
  heal(amount) {
    this.energy = Math.min(100, this.energy + amount);
  }

  /**
   * Checks if the object was hit within the last second.
   * @returns {boolean}
   */
  isHurt() {
    let timepassed = (new Date().getTime() - this.lastHit) / 1000;
    return timepassed < 1;
  }

  /**
   * Checks if the object is dead (energy is zero).
   * @returns {boolean}
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Plays the next frame of the given animation image array.
   * @param {string[]} images - Array of image paths for the animation
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Moves the object to the right by its speed.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left by its speed.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Initiates a jump by setting the vertical speed.
   */
  jump() {
    this.speedY = 30;
  }
}
