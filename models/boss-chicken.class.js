/**
 * Represents the boss chicken enemy with movement, animation, and attack logic.
 * @class BossChicken
 * @extends MovableObject
 */
class BossChicken extends MovableObject {
  height = 120;
  width = 110;
  y = 355;
  offset = { top: 5, bottom: 5, left: 5, right: 5 };
  isDead = false;
  currentImage = 0;
  world;

  static GROUND_Y = 310;

  /**
   * Creates a new BossChicken instance.
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {object} world - Reference to the game world
   */
  constructor(x, y, world) {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(IMAGES_CHICKEN_WALKING);
    this.x = x;
    this.y = y;
    this.world = world;
    this.speed = 0.8 + Math.random() * 0.6;
    this.applyGravity();
    this.speedY = 6;
    this.animate();
  }

  /**
   * Checks if the boss is above ground level.
   * @returns {boolean}
   */
  isAboveGround() {
    return this.y < BossChicken.GROUND_Y;
  }

  /**
   * Draws the boss chicken on the canvas.
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    if (!this.img || !this.img.complete || this.img.naturalWidth === 0) return;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Kills the boss chicken and starts removal timer.
   */
  die() {
    this.isDead = true;
    this.speedY = 0;
    this.loadImage(IMAGE_CHICKEN_DEAD);
    this.speed = 0;
    setStoppableTimeout(() => {
      this.toBeRemoved = true;
    }, 1000);
  }

  /**
   * Starts movement and animation intervals for the boss chicken.
   */
  animate() {
    setStoppableInterval(() => {
      if (this.isDead) return;
      if (this.world && this.world.character.x < this.x) {
        this.x -= this.speed;
        this.otherDirection = false;
      } else {
        this.x += this.speed;
        this.otherDirection = true;
      }
    }, 1000 / 60);

    setStoppableInterval(() => {
      if (!this.isDead) this.playAnimation(IMAGES_CHICKEN_WALKING);
    }, 150);

    setStoppableInterval(
      () => {
        if (!this.isDead && !this.isAboveGround()) {
          this.speedY = 30 + Math.random() * 4;
          if (this.world) this.startJumpDash();
        }
      },
      2000 + Math.random() * 1000,
    );
  }

  /**
   * Initiates a jump dash attack towards the player.
   */
  startJumpDash() {
    const direction = this.world.character.x < this.x ? -1 : 1;
    const jumpDash = setStoppableInterval(() => {
      if (this.isDead) {
        clearInterval(jumpDash);
        return;
      }
      this.x += direction * 3;
    }, 30);
    setStoppableTimeout(() => clearInterval(jumpDash), 600);
  }
}
