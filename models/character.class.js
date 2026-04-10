class Character extends MovableObject {
  width = 95;
  height = 220;
  y = 95;
  speed = 4;
  world;
  offset = { top: 110, bottom: 10, left: 20, right: 20 };

  constructor() {
    super().loadImage(IMAGES_CHARACTER_WALKING[0]);
    this.loadImages(IMAGES_CHARACTER_WALKING);
    this.loadImages(IMAGES_CHARACTER_JUMPING);
    this.loadImages(IMAGES_CHARACTER_DEAD);
    this.loadImages(IMAGES_CHARACTER_HURT);
    this.applyGravity();
    this.animate();
  }

  isJumpingOn(enemy) {
    const pepeCollisionTop = this.y + this.offset.top;
    const enemyMidpoint = enemy.y + enemy.height / 2;
    return this.speedY < 0 && pepeCollisionTop < enemyMidpoint;
  }

  animate() {
    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        this.otherDirection = false;
      }

      if (this.world.keyboard.LEFT && this.x > 120) {
        this.moveLeft();
        this.otherDirection = true;
      }

      if ((this.world.keyboard.UP || this.world.keyboard.SPACE) && !this.isAboveGround()) {
        this.jump();
      }

      this.world.camera_x = -this.x + 120;
    }, 1000 / 60);

    setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(IMAGES_CHARACTER_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(IMAGES_CHARACTER_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(IMAGES_CHARACTER_JUMPING);
      } else {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(IMAGES_CHARACTER_WALKING);
        }
      }
    }, 50);
  }
}
