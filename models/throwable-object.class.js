class ThrowableObject {
   
    speedY = 30;
    speedX = 20;

 Throw() {
     setInterval(() => {
          this.x += this.speedX;
          this.y -= this.speedY;
          this.speedY -= this.acceleration;
     }, 1000 / 25);
 }



}