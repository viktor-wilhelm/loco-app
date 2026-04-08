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
    return Math.min(5, Math.floor(this.percentage / 20));
  }
}
