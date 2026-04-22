/**
 * Represents the player character Pepe.
 * Handles movement, animation states, and death logic.
 * @class Character
 * @extends MovableObject
 */
class Character extends MovableObject {
  width = 95;
  height = 220;
  y = 95;
  speed = 4;
  energy = 50;
  world;
  offset = { top: 104, bottom: 10, left: 20, right: 20 };
  lastMoveTime = Date.now();
  deathAnimationDone = false;

  /**
   * Creates a new Character instance, loads all animation images and starts gravity.
   */
  constructor() {
    super().loadImage(IMAGES_CHARACTER_IDLE[0]);
    this.loadImages(IMAGES_CHARACTER_IDLE);
    this.loadImages(IMAGES_CHARACTER_SLEEP);
    this.loadImages(IMAGES_CHARACTER_WALKING);
    this.loadImages(IMAGES_CHARACTER_JUMPING);
    this.loadImages(IMAGES_CHARACTER_DEAD);
    this.loadImages(IMAGES_CHARACTER_HURT);
    this.applyGravity();
    this.animate();
  }

  /**
   * Checks if the character is jumping on top of an enemy.
   * @param {object} enemy - The enemy to check
   * @returns {boolean}
   */
  isJumpingOn(enemy) {
    const isFalling = this.speedY < 0 || (this.speedY === 0 && this.isAboveGround());
    const pepeFootAboveEnemyBottom =
      this.y + this.height - this.offset.bottom < enemy.y + enemy.height - enemy.offset.bottom;
    return isFalling && pepeFootAboveEnemyBottom;
  }

  /**
   * Handles all movement inputs (right, left, jump).
   */
  handleMovement() {
    this.handleMoveRight();
    this.handleMoveLeft();
    this.handleJump();
  }

  /**
   * Moves the character to the right if RIGHT key is pressed.
   */
  handleMoveRight() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.lastMoveTime = Date.now();
    }
  }

  /**
   * Moves the character to the left if LEFT key is pressed.
   */
  handleMoveLeft() {
    if (this.world.keyboard.LEFT && this.x > 120) {
      this.moveLeft();
      this.otherDirection = true;
      this.lastMoveTime = Date.now();
    }
  }

  /**
   * Makes the character jump if UP or SPACE is pressed and on the ground.
   */
  handleJump() {
    if ((this.world.keyboard.UP || this.world.keyboard.SPACE) && !this.isAboveGround()) {
      this.jump();
      this.world.audioManager?.playSound("jump");
      this.lastMoveTime = Date.now();
    }
  }

  /**
   * Starts movement and animation intervals for the character.
   */
  animate() {
    setStoppableInterval(() => {
      if (this.world.paused || this.isDead() || this.world.gameWon) return;
      this.handleMovement();
      this.world.camera_x = -this.x + 120;
    }, 1000 / 60);

    setStoppableInterval(() => {
      if (this.world.paused || this.isDead() || this.world.gameWon) {
        this.world.audioManager?.stopRunSound();
        if (this.isDead()) return this.handleDeathAnimation();
        return;
      }
      this.handleStateAnimation();
    }, 100);
  }

  /**
   * Plays the death animation and triggers game over when done.
   */
  handleDeathAnimation() {
    if (this.deathAnimationDone) return;
    this.world.audioManager?.stopRunSound();
    this.playAnimation(IMAGES_CHARACTER_DEAD);
    if (this.currentImage >= IMAGES_CHARACTER_DEAD.length) {
      this.deathAnimationDone = true;
      this.img = this.imageCache[IMAGES_CHARACTER_DEAD[IMAGES_CHARACTER_DEAD.length - 1]];
      setStoppableTimeout(() => this.world.showGameOver(), 800);
    }
  }

  /**
   * Plays the appropriate animation based on the current character state.
   */
  handleStateAnimation() {
    if (this.isHurt()) {
      this.world.audioManager?.stopRunSound();
      this.playAnimation(IMAGES_CHARACTER_HURT);
    } else if (this.isAboveGround()) {
      this.world.audioManager?.stopRunSound();
      this.playAnimation(IMAGES_CHARACTER_JUMPING);
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.world.audioManager?.playRunSound();
      this.playAnimation(IMAGES_CHARACTER_WALKING);
    } else {
      this.world.audioManager?.stopRunSound();
      this.playIdleAnimation();
    }
  }

  /**
   * Plays idle or sleep animation depending on inactivity duration.
   */
  playIdleAnimation() {
    const idleSeconds = (Date.now() - this.lastMoveTime) / 1000;
    this.playAnimation(idleSeconds > 5 ? IMAGES_CHARACTER_SLEEP : IMAGES_CHARACTER_IDLE);
  }
}
