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
  bottlesCollected = 0;
  totalBottles = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.totalCoins = this.level.coins.length;
    this.totalBottles = this.level.bottles.length;
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
      this.checkBottleCollisions();
    }, 200);

    setInterval(() => {
      this.checkBottleHitsEnemy();
    }, 50);
  }

  checkThrowObjects() {
    this.throwableObjects = this.throwableObjects.filter((b) => !b.isUsed);
    if (this.keyboard.D && this.bottlesCollected > 0) {
      let bottle = new ThrowableObject(this.character.x + 40, this.character.y + 100);
      this.throwableObjects.push(bottle);
      this.bottlesCollected--;
      const percentage = Math.round((this.bottlesCollected / this.totalBottles) * 100);
      this.bottleBar.setPercentage(percentage);
    }
  }

  checkCollisions() {
    this.level.enemies = this.level.enemies.filter((e) => !e.toBeRemoved);
    this.level.enemies.forEach((enemy) => {
      if (!enemy.isDead && this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  checkBottleHitsEnemy() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.isSplashing) return;
      this.level.enemies.forEach((enemy) => {
        if (!enemy.isDead && bottle.isColliding(enemy)) {
          enemy.die();
          bottle.isSplashing = true;
          bottle.playSplash();
        }
      });
    });
  }

  checkCoinCollisions() {
    if (this.coinsCollected >= this.totalCoins) return;
    this.level.coins = this.level.coins.filter((coin) => {
      const isAirCoin = coin.y < 300;
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

  checkBottleCollisions() {
    if (this.bottlesCollected >= this.totalBottles) return;
    this.level.bottles = this.level.bottles.filter((bottle) => {
      if (this.character.isColliding(bottle)) {
        this.bottlesCollected++;
        const percentage = Math.round((this.bottlesCollected / this.totalBottles) * 100);
        this.bottleBar.setPercentage(percentage);
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
    this.addObjectsToMap(this.level.bottles);
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
