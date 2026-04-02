class ThrowableObject extends MovableObject {
  width = 60;
  height = 60;
  speedX = 20;
  animateRotation;

  constructor(x, y) {
    super().loadImage(IMAGES_BOTTLE_ROTATION[0]);
    this.loadImages(IMAGES_BOTTLE_ROTATION);
    this.loadImages(IMAGES_BOTTLE_SPLASH);
    this.x = x;
    this.y = y;
    this.throw();
  }

  throw() {
    this.speedY = 30;
    this.applayGrravity();
    this.animateRotation = setInterval(() => {
      this.playAnimation(IMAGES_BOTTLE_ROTATION);
      this.x += this.speedX;
    }, 1000 / 25);
  }

  splash() {
    clearInterval(this.animateRotation);
    this.speedX = 0;
    this.playAnimation(IMAGES_BOTTLE_SPLASH);
  }
}