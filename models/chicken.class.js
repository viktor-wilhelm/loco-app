class Chicken extends MovableObject {

  height = 70;
  width = 70;
  y = 360;
  IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];

  currentImage = 0;
  constructor() {
    super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
    this.loadImages(this.IMAGES_WALKING);

    this.x = 200 + Math.random() * 500; // Zahl zwischen 200 und 700
    this.animate();

  }


        animate() {
        setInterval(() => {
            let i = this.currentImage % this.IMAGES_WALKING.length; // let i = 7 % 6; => 1, Rest 1
            let path = this.IMAGES_WALKING[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 150); 
    }


}