class Chicken extends MovableObject {
  height = 70;
  width = 70;
  y = 355;
  IMAGES_WALKING = IMAGES_CHICKEN_WALKING;

  currentImage = 0;
  constructor() {
    super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
    this.loadImages(this.IMAGES_WALKING);

    this.x = 200 + Math.random() * 10000; // Zahl zwischen 200 und 10200
    this.speed = 0.15 + Math.random() * 0.5;

    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);

    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 150);
  }
}