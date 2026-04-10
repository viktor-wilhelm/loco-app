class Chicken extends MovableObject {
  height = 70;
  width = 70;
  y = 355;
  offset = { top: 5, bottom: 5, left: 5, right: 5 };
  IMAGES_WALKING = IMAGES_CHICKEN_WALKING;
  isDead = false;

  currentImage = 0;
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);

    this.x = 1000 + Math.random() * 5400;
    this.speed = 0.15 + Math.random() * 0.5;

    this.animate();
  }

  die() {
    this.isDead = true;
    this.loadImage(IMAGE_CHICKEN_DEAD);
    this.speed = 0;
    setTimeout(() => {
      this.toBeRemoved = true;
    }, 1000);
  }

  animate() {
    const walkInterval = setInterval(() => {
      if (!this.isDead) this.moveLeft();
    }, 1000 / 60);

    setInterval(() => {
      if (!this.isDead) this.playAnimation(this.IMAGES_WALKING);
    }, 150);
  }
}
