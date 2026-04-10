class Endboss extends MovableObject {
  height = 450;
  width = 300;
  y = 0;
  energy = 100;
  isDead = false;
  isHurt = false;
  offset = { top: 60, bottom: 20, left: 30, right: 30 };

  constructor() {
    super().loadImage(IMAGES_ENDBOSS_WALKING[0]);
    this.loadImages(IMAGES_ENDBOSS_WALKING);
    this.loadImages(IMAGES_ENDBOSS_HURT);
    this.loadImages(IMAGES_ENDBOSS_DEAD);
    this.x = 719 * 8;
    this.animate();
  }

  hit() {
    this.energy -= 10;
    if (this.energy <= 0) {
      this.energy = 0;
      this.die();
    } else {
      this.showHurt();
    }
  }

  showHurt() {
    this.isHurt = true;
    setTimeout(() => {
      this.isHurt = false;
    }, 500);
  }

  die() {
    this.isDead = true;
    this.speed = 0;
    setTimeout(() => {
      this.toBeRemoved = true;
    }, 1500);
  }

  animate() {
    setInterval(() => {
      if (!this.isDead) this.moveLeft();
    }, 30);

    setInterval(() => {
      if (this.isDead) {
        this.playAnimation(IMAGES_ENDBOSS_DEAD);
      } else if (this.isHurt) {
        this.playAnimation(IMAGES_ENDBOSS_HURT);
      } else {
        this.playAnimation(IMAGES_ENDBOSS_WALKING);
      }
    }, 100);
  }
}
