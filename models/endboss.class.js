class Endboss extends MovableObject {
  height = 450;
  width = 300;
  y = 0;

  constructor() {
    super().loadImage(IMAGES_ENDBOSS_WALKING[0]);
    this.loadImages(IMAGES_ENDBOSS_WALKING);
    this.x = 719 * 9; // Endboss am Ende der Karte platzieren
    this.animate();
  }

  animate() {

    setInterval(() => {
      this.moveLeft();
    }, 30);

    setInterval(() => {
      // walking animation
      let i = this.currentImage % IMAGES_ENDBOSS_WALKING.length;
      let path = IMAGES_ENDBOSS_WALKING[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 100);
  }
}