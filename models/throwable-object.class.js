class ThrowableObject extends MovableObject {
  isSplashing = false;
  isUsed = false;
  onSplash = null;

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

  throw() {
    this.speedY = 15;
    this.applyGravity();
    const direction = this.facingLeft ? -10 : 10;

    const moveInterval = setStoppableInterval(() => {
      if (!this.isSplashing) {
        this.x += direction;
        this.playAnimation(IMAGES_BOTTLE_ROTATION);
      }
    }, 25);

    const groundInterval = setStoppableInterval(() => {
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

    if (this.onSplash) {
      setTimeout(() => {
        this.onSplash?.();
      }, 120);
    }

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
