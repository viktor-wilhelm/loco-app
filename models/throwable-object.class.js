class ThrowableObject extends MovableObject {

  constructor() {
    super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
    this.x = 100;
    this.y = 100;
    this.throw(100, 150);
  
   
  }

  throw(x, y) {
     this.x = x;
     this.y = y;
     this.speedY = 30;
     this.applyGravity();
  
  }

}