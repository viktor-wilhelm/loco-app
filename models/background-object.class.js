class BackgroundObject extends MovableObject {

    width = 720;
    height = 480;
    constructor(imagePath, x, parallaxSpeed = 1) {
        super();
        this.parallaxSpeed = parallaxSpeed;
        this.loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height; // 480 - 400 = 80
    }
}
