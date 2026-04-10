class ThrowableObject extends MovableObject {
  isSplashing = false;
  isUsed = false;

  constructor(x, y) {
    super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
    this.loadImages(IMAGES_BOTTLE_ROTATION);
    this.loadImages(IMAGES_BOTTLE_SPLASH);
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 60;
    this.throw();
  }

  throw() {
    this.speedY = 15;
    this.applyGravity();

    const moveInterval = setInterval(() => {
      if (!this.isSplashing) {
        this.x += 10;
        this.playAnimation(IMAGES_BOTTLE_ROTATION);
      }
    }, 25);

    const groundInterval = setInterval(() => {
      if (!this.isSplashing && this.y >= 350) {
        this.isSplashing = true;
        clearInterval(moveInterval);
        clearInterval(groundInterval);
        this.playSplash();
      }
    }, 25);
  }

  playSplash() {
    this.speedY = 0;
    const splashY = this.y;
    let frame = 0;
    const splashInterval = setInterval(() => {
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
