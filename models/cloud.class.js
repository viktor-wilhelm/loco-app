class Cloud extends MovableObject {
  x = 500 + Math.random() * 500;
  y = 20;
  width = 500;
  height = 250;
  parallaxSpeed = 0.15;

  constructor(x) {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.x = x;
    this.speed = 0.15 + Math.random() * 0.25;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }
}
