class StatusBar extends DrawableObject {

  percentage = 100;

  constructor(y, images) {
    super();
    this.loadImages(images);
    this.images = images;
    this.setPercentage(100);
    this.x = 10;
    this.y = y;
    this.width = 200;
    this.height = 55;
  }

  // setPercentage(50); 
  setPercentage(percentage) {
    this.percentage = percentage; // => 0 ... 5
    let path = this.images[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}