class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar(-10, IMAGES_HEALTH);
  coinBar = new StatusBar(35, IMAGES_COIN);
  bottleBar = new StatusBar(80, IMAGES_BOTTLE);
  throwableObjects = [];
  coinsCollected = 0;
  totalCoins = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.totalCoins = this.level.coins.length;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkCoinCollisions();
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D) {
      let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
      this.throwableObjects.push(bottle);
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  checkCoinCollisions() {
    if (this.coinsCollected >= this.totalCoins) return;
    this.level.coins = this.level.coins.filter((coin) => {
      const isAirCoin = coin.y < 350;
      const canCollect = !isAirCoin || this.character.isAboveGround();
      if (canCollect && this.character.isColliding(coin)) {
        this.coinsCollected++;
        const percentage = Math.round((this.coinsCollected / this.totalCoins) * 100);
        this.coinBar.setPercentage(percentage);
        return false;
      }
      return true;
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#5dbde0";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.addBackgroundObjectsParallax(this.level.backgroundObjects);
    this.addBackgroundObjectsParallax(this.level.clouds);

    // -------- Space for fixed objects --------
    this.addToMap(this.statusBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.bottleBar);
    this.ctx.translate(this.camera_x, 0); // Forwards

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0); // Backwards

    // draw() wird immer wieder aufgerufen
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addBackgroundObjectsParallax(backgroundObjects) {
    backgroundObjects.forEach((bg) => {
      this.ctx.save();
      const parallaxX = this.camera_x * bg.parallaxSpeed;
      this.ctx.translate(parallaxX, 0);
      bg.draw(this.ctx);
      this.ctx.restore();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
