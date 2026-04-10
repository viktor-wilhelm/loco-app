class SmallChicken extends MovableObject {
  height = 45;
  width = 45;
  y = 380;
  offset = { top: 2, bottom: 2, left: 2, right: 2 };
  IMAGES_WALKING = IMAGES_SMALL_CHICKEN_WALKING;
  isDead = false;

  currentImage = 0;

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.x = 1000 + Math.random() * 5400;
    this.speed = 0.15 + Math.random() * 0.25;
    this.animate();
  }

  die() {
    this.isDead = true;
    this.loadImage(IMAGE_SMALL_CHICKEN_DEAD);
    this.speed = 0;
    setTimeout(() => {
      this.toBeRemoved = true;
    }, 1000);
  }

  animate() {
    setInterval(() => {
      if (!this.isDead) this.moveLeft();
    }, 1000 / 60);

    setInterval(() => {
      if (!this.isDead) this.playAnimation(this.IMAGES_WALKING);
    }, 150);
  }
}
