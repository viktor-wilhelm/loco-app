class Character extends MovableObject {
  width = 95;
  height = 220;
  y = 95;
  speed = 4;
  world;
  offset = { top: 104, bottom: 10, left: 20, right: 20 };
  lastMoveTime = Date.now();
  deathAnimationDone = false;

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

  isJumpingOn(enemy) {
    return (this.isAboveGround() || this.speedY < 0) && this.y + this.height < enemy.y + enemy.height;
  }

  animate() {
    setInterval(() => {
      if (this.isDead()) return;

      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        this.otherDirection = false;
        this.lastMoveTime = Date.now();
      }

      if (this.world.keyboard.LEFT && this.x > 120) {
        this.moveLeft();
        this.otherDirection = true;
        this.lastMoveTime = Date.now();
      }

      if ((this.world.keyboard.UP || this.world.keyboard.SPACE) && !this.isAboveGround()) {
        this.jump();
        this.lastMoveTime = Date.now();
      }

      this.world.camera_x = -this.x + 120;
    }, 1000 / 60);

    setInterval(() => {
      if (this.isDead()) {
        if (!this.deathAnimationDone) {
          this.playAnimation(IMAGES_CHARACTER_DEAD);
          if (this.currentImage >= IMAGES_CHARACTER_DEAD.length) {
            this.deathAnimationDone = true;
            this.img = this.imageCache[IMAGES_CHARACTER_DEAD[IMAGES_CHARACTER_DEAD.length - 1]];
            setTimeout(() => this.world.showGameOver(), 800);
          }
        }
        return;
      }

      if (this.isHurt()) {
        this.playAnimation(IMAGES_CHARACTER_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(IMAGES_CHARACTER_JUMPING);
      } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(IMAGES_CHARACTER_WALKING);
      } else {
        const idleSeconds = (Date.now() - this.lastMoveTime) / 1000;
        if (idleSeconds > 5) {
          this.playAnimation(IMAGES_CHARACTER_SLEEP);
        } else {
          this.playAnimation(IMAGES_CHARACTER_IDLE);
        }
      }
    }, 100);
  }
}
