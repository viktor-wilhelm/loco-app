/**
 * Represents the final boss enemy with attack patterns, animation, and health logic.
 * @class Endboss
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  height = 340;
  width = 225;
  y = 110;
  speed = 0.08;
  energy = 200;
  isDead = false;
  isHurt = false;
  activated = false;
  hitCount = 0;
  isJumping = false;
  world;

  static GROUND_Y = -110;
  offset = { top: 60, bottom: 20, left: 30, right: 30 };

  /**
   * Creates a new Endboss instance and loads all animation images.
   */
  constructor() {
    super().loadImage(IMAGES_ENDBOSS_WALK[0]);
    this.loadImages(IMAGES_ENDBOSS_WALKING);
    this.loadImages(IMAGES_ENDBOSS_WALK);
    this.loadImages(IMAGES_ENDBOSS_ATTACK);
    this.loadImages(IMAGES_ENDBOSS_HURT);
    this.loadImages(IMAGES_ENDBOSS_DEAD);
    this.x = 719 * 8;
    this.animate();
  }

  /**
   * Checks if the endboss is within close range of the player.
   * @returns {boolean}
   */
  isNearPepe() {
    if (!this.world) return false;
    return Math.abs(this.x - this.world.character.x) < 100;
  }

  /**
   * Activates the endboss, triggers size increase and jump attack loop.
   */
  activate() {
    if (this.activated) return;
    this.activated = true;
    this.height = 560;
    this.width = 370;
    this.y = -110;
    this.applyGravity();
    this.startJumpAttackLoop();
  }

  /**
   * Checks if the endboss is above ground level.
   * @returns {boolean}
   */
  isAboveGround() {
    return this.y < Endboss.GROUND_Y;
  }

  /**
   * Starts the interval loop that triggers jump attacks towards the player.
   */
  startJumpAttackLoop() {
    setStoppableInterval(() => {
      if (this.world && this.world.paused) return;
      if (!this.isDead && this.activated && !this.isJumping && !this.isNearPepe()) {
        this.jumpTowardsPepe();
      }
    }, 5000);
  }

  /**
   * Initiates a jump attack towards the player.
   */
  jumpTowardsPepe() {
    if (!this.world) return;
    this.isJumping = true;
    this.speedY = 35;
    const direction = this.world.character.x < this.x ? -1 : 1;
    this.startJumpMoveInterval(direction);
  }

  /**
   * Starts the horizontal movement during a jump attack.
   * @param {number} direction - Movement direction (-1 left, 1 right)
   */
  startJumpMoveInterval(direction) {
    const jumpMove = setStoppableInterval(() => {
      if (this.world && this.world.paused) return;
      if (this.isDead) {
        clearInterval(jumpMove);
        return;
      }
      this.x += direction * 4;
    }, 30);
    setStoppableTimeout(() => {
      clearInterval(jumpMove);
      this.isJumping = false;
    }, 800);
  }

  /**
   * Reduces endboss energy on hit and triggers death or hurt state.
   */
  hit() {
    this.energy -= 10;
    this.hitCount++;
    if (this.energy <= 0) {
      this.energy = 0;
      this.die();
    } else {
      this.handleHurt();
    }
  }

  /**
   * Handles hurt state: plays sound and spawns chickens.
   */
  handleHurt() {
    this.showHurt();
    this.world.audioManager?.playSound("endbossHurt", 3000);
    if (this.world) this.spawnChickens();
  }

  /**
   * Spawns BossChicken enemies near the endboss when hit.
   */
  spawnChickens() {
    const spawnX = this.x + this.width / 2 - 35;
    const spawnY = this.y + this.height * 0.55;
    for (let i = 0; i < 1; i++) {
      const offsetX = (i - 2) * 30;
      const chicken = new BossChicken(spawnX + offsetX, spawnY, this.world);
      this.world.level.enemies.push(chicken);
    }
  }

  /**
   * Briefly sets the hurt state and resets it after a timeout.
   */
  showHurt() {
    this.isHurt = true;
    setStoppableTimeout(() => {
      this.isHurt = false;
    }, 500);
  }

  /**
   * Kills the endboss and triggers the game won screen.
   */
  die() {
    this.isDead = true;
    this.speed = 0;
    this.world.audioManager?.playSound("endbossDie");
    setStoppableTimeout(() => {
      this.toBeRemoved = true;
      if (this.world) this.world.showGameWon();
    }, 1500);
  }

  /**
   * Starts all movement and animation intervals for the endboss.
   */
  animate() {
    setStoppableInterval(() => {
      if (this.world && this.world.paused) return;
      if (this.isDead) return;
      this.moveLeft();
    }, 30);

    setStoppableInterval(() => {
      if (this.world && this.world.paused) return;
      this.handleBossAnimation();
    }, 100);
  }

  /**
   * Plays the correct animation based on the current boss state.
   */
  handleBossAnimation() {
    if (this.isDead) {
      this.playAnimation(IMAGES_ENDBOSS_DEAD);
    } else if (this.isHurt) {
      this.playAnimation(IMAGES_ENDBOSS_HURT);
    } else if (this.isJumping) {
      this.playAnimation(IMAGES_ENDBOSS_ATTACK);
    } else if (this.activated || this.isNearPepe()) {
      this.playAnimation(IMAGES_ENDBOSS_WALKING);
    } else {
      this.playAnimation(IMAGES_ENDBOSS_WALK);
    }
  }
}
