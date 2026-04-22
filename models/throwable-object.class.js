/**
 * Represents a throwable salsa bottle with flight physics and splash animation.
 * @class ThrowableObject
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  isSplashing = false;
  isUsed = false;
  onSplash = null;

  /**
   * Creates a new ThrowableObject and launches it immediately.
   * @param {number} x - X start position
   * @param {number} y - Y start position
   * @param {boolean} [facingLeft=false] - Direction the bottle is thrown
   */
  constructor(x, y, facingLeft = false) {
    super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
    this.loadImages(IMAGES_BOTTLE_ROTATION);
    this.loadImages(IMAGES_BOTTLE_SPLASH);
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 60;
    this.facingLeft = facingLeft;
    this.throw();
  }

  /**
   * Launches the bottle with gravity and horizontal movement.
   * Triggers splash when it hits the ground.
   */
  throw() {
    this.speedY = 15;
    this.applyGravity();
    const direction = this.facingLeft ? -10 : 10;
    const moveInterval = this.startMoveInterval(direction);
    this.startGroundCheckInterval(moveInterval);
  }

  /**
   * Starts the horizontal movement and rotation animation interval.
   * @param {number} direction - Pixels per tick to move horizontally
   * @returns {number} The interval ID
   */
  startMoveInterval(direction) {
    return setStoppableInterval(() => {
      if (!this.isSplashing) {
        this.x += direction;
        this.playAnimation(IMAGES_BOTTLE_ROTATION);
      }
    }, 25);
  }

  /**
   * Starts the interval that checks if the bottle has hit the ground.
   * @param {number} moveInterval - ID of the move interval to stop on splash
   */
  startGroundCheckInterval(moveInterval) {
    const groundInterval = setStoppableInterval(() => {
      if (!this.isSplashing && this.y >= 350) {
        this.isSplashing = true;
        clearInterval(moveInterval);
        clearInterval(groundInterval);
        this.playSplash();
      }
    }, 25);
  }

  /**
   * Plays the splash animation and marks the bottle as used.
   * Triggers the onSplash callback if set.
   */
  playSplash() {
    this.speedY = 0;
    const splashY = this.y;
    this.notifySplash();
    this.startSplashAnimation(splashY);
  }

  /**
   * Fires the onSplash callback after a short delay if registered.
   */
  notifySplash() {
    if (this.onSplash) {
      setTimeout(() => this.onSplash?.(), 120);
    }
  }

  /**
   * Runs the splash frame animation until complete, then marks the bottle as used.
   * @param {number} splashY - Fixed Y position during the splash animation
   */
  startSplashAnimation(splashY) {
    let frame = 0;
    const splashInterval = setStoppableInterval(() => {
      this.y = splashY;
      this.img = this.imageCache[IMAGES_BOTTLE_SPLASH[frame]];
      frame++;
      if (frame >= IMAGES_BOTTLE_SPLASH.length) {
        clearInterval(splashInterval);
        this.isUsed = true;
      }
    }, 80);
  }
}
