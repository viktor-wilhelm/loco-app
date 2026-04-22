/**
 * Represents a small chicken enemy that walks towards the player.
 * @class SmallChicken
 * @extends MovableObject
 */
class SmallChicken extends MovableObject {
  height = 45;
  width = 45;
  y = 380;
  offset = { top: 5, bottom: 5, left: 5, right: 5 };
  IMAGES_WALKING = IMAGES_SMALL_CHICKEN_WALKING;
  isDead = false;

  currentImage = 0;

  /**
   * Creates a new SmallChicken instance at a random position.
   * @param {number} [minX=1000] - Minimum X position for spawning
   */
  constructor(minX = 1000) {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.x = minX + 200 + Math.random() * 4000;
    this.speed = 0.15 + Math.random() * 0.25;
    this.animate();
  }

  /**
   * Kills the small chicken and schedules its removal.
   */
  die() {
    this.isDead = true;
    this.loadImage(IMAGE_SMALL_CHICKEN_DEAD);
    this.speed = 0;
    setStoppableTimeout(() => {
      this.toBeRemoved = true;
    }, 1000);
  }

  /**
   * Starts the movement and animation intervals for the small chicken.
   */
  animate() {
    setStoppableInterval(() => {
      if (this.world && this.world.paused) return;
      if (!this.isDead) this.moveLeft();
    }, 1000 / 60);

    setStoppableInterval(() => {
      if (this.world && this.world.paused) return;
      if (!this.isDead) this.playAnimation(this.IMAGES_WALKING);
    }, 150);
  }
}
