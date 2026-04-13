class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar(-10, IMAGES_HEALTH);
  coinBar = new StatusBar(35, IMAGES_COIN, 0);
  bottleBar = new StatusBar(80, IMAGES_BOTTLE, 0);
  endbossBar = new StatusBar(125, IMAGES_ENDBOSS_HEALTH);
  throwableObjects = [];
  throwOnCooldown = false;
  activeEnemyInteraction = false;
  gameOver = false;
  gameOverStep = -1;
  gameOverImages = [];
  gameWon = false;
  gameWonStep = -1;
  gameWonImages = [];
  coinsCollected = 0;
  totalCoins = 0;
  coinHealCounter = 0;
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
    setStoppableTimeout(() => {
      this.level.enemies = createEnemies(this.character.x + 800);
      this.setWorld();
    }, 3000);
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((e) => (e.world = this));
  }

  setEndbossWorld() {
    const boss = this.level.enemies.find((e) => e instanceof Endboss);
    if (boss) boss.world = this;
  }

  run() {
    setStoppableInterval(() => {
      if (this.gameOver || this.gameWon || this.paused) return;
      this.checkThrowObjects();
      this.checkCoinCollisions();
      this.checkBottleCollisions();
    }, 200);

    setStoppableInterval(() => {
      if (this.gameOver || this.gameWon || this.paused) return;
      this.level.enemies = this.level.enemies.filter((e) => !e.toBeRemoved);
      this.checkCollisions();
      this.checkBottleHitsEnemy();
    }, 50);
  }

  checkThrowObjects() {
    this.throwableObjects = this.throwableObjects.filter((b) => !b.isUsed);
    if (!this.keyboard.D && !this.keyboard.THROW_PENDING) {
      this.throwOnCooldown = false;
    }
    if ((this.keyboard.D || this.keyboard.THROW_PENDING) && !this.throwOnCooldown && this.bottlesCollected > 0) {
      this.keyboard.THROW_PENDING = false;
      this.throwOnCooldown = true;
      const facingLeft = this.character.otherDirection;
      const offsetX = facingLeft ? -10 : 40;
      let bottle = new ThrowableObject(this.character.x + offsetX, this.character.y + 100, facingLeft);
      this.throwableObjects.push(bottle);
      this.bottlesCollected--;
      const percentage = Math.max(0, this.bottlesCollected * 10);
      this.bottleBar.setPercentage(percentage);
    }
  }

  checkCollisions() {
    for (const enemy of this.level.enemies) {
      if (!enemy.isDead && this.character.isColliding(enemy)) {
        if (!this.activeEnemyInteraction && this.character.isJumpingOn(enemy)) {
          this.handleJumpOnEnemy(enemy);
          break;
        } else if (
          !this.activeEnemyInteraction &&
          !this.character.isHurt() &&
          !this.character.resumeInvincible &&
          this.character.speedY <= 0
        ) {
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
        }
      }
    }
  }

  handleJumpOnEnemy(enemy) {
    this.activeEnemyInteraction = true;
    if (enemy instanceof Endboss) {
      enemy.activate();
      enemy.hit();
      enemy.hit();
      this.endbossBar.setPercentage(enemy.energy);
      const bounceDirection = this.character.x < enemy.x ? -1 : 1;
      this.character.x -= bounceDirection * 60;
      this.character.speedY = 20;
      this.character.hit();
      this.statusBar.setPercentage(this.character.energy);
      setStoppableTimeout(() => {
        this.activeEnemyInteraction = false;
      }, 800);
    } else {
      enemy.die();
      this.character.speedY = 15;
      setStoppableTimeout(() => {
        this.activeEnemyInteraction = false;
      }, 100);
    }
  }

  checkBottleHitsEnemy() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.isSplashing) return;
      this.level.enemies.forEach((enemy) => {
        if (!enemy.isDead && bottle.isColliding(enemy)) {
          if (enemy instanceof Endboss) {
            enemy.activate();
            enemy.hit();
            this.endbossBar.setPercentage(enemy.energy);
          } else {
            enemy.die();
          }
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
        this.coinHealCounter++;
        if (this.coinHealCounter >= 10) {
          this.coinHealCounter = 0;
          if (this.character.energy < 100) {
            this.character.heal(100);
            this.statusBar.setPercentage(this.character.energy);
          }
        }
        return false;
      }
      return true;
    });
  }

  checkBottleCollisions() {
    if (this.bottlesCollected >= 10) return;
    const c = this.character;
    const pepeCenterX = c.x + c.offset.left + (c.width - c.offset.left - c.offset.right) / 2;
    const pepeBottom = c.y + c.height - c.offset.bottom;
    const pepeMidY = c.y + c.height / 2;
    this.level.bottles = this.level.bottles.filter((bottle) => {
      const bLeft = bottle.x + bottle.offset.left;
      const bRight = bottle.x + bottle.width - bottle.offset.right;
      const bTop = bottle.y + bottle.offset.top;
      const bBottom = bottle.y + bottle.height - bottle.offset.bottom;
      const hits = pepeCenterX > bLeft && pepeCenterX < bRight && pepeBottom > bTop && pepeMidY < bBottom;
      if (hits) {
        this.bottlesCollected++;
        const percentage = Math.min(100, this.bottlesCollected * 10);
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
    this.addToMap(this.endbossBar);
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
      if (!self.paused) self.draw();
    });

    if (this.gameOver && this.gameOverStep >= 0 && this.gameOverImages[this.gameOverStep]) {
      this.ctx.fillStyle = "rgba(0,0,0,0.55)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      const img = this.gameOverImages[this.gameOverStep];
      const scale = Math.min(this.canvas.width / img.width, this.canvas.height / img.height) * 0.85;
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = (this.canvas.width - dw) / 2;
      const dy = (this.canvas.height - dh) / 2;
      this.ctx.drawImage(img, dx, dy, dw, dh);
    }

    if (this.gameWon && this.gameWonStep >= 0 && this.gameWonImages[this.gameWonStep]) {
      this.ctx.fillStyle = "rgba(0,0,0,0.55)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      const img = this.gameWonImages[this.gameWonStep];
      const scale = Math.min(this.canvas.width / img.width, this.canvas.height / img.height) * 0.85;
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = (this.canvas.width - dw) / 2;
      const dy = (this.canvas.height - dh) / 2;
      this.ctx.drawImage(img, dx, dy, dw, dh);
    }
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

  showGameWon() {
    const paths = ["img/You won, you lost/You Win A.png", "img/You won, you lost/You won A.png"];
    this.gameWonImages = paths.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
    this.gameWon = true;
    this.gameWonStep = 0;
    const delays = [1500, 0];
    let step = 0;
    const next = () => {
      if (delays[step] > 0) {
        setStoppableTimeout(() => {
          step++;
          this.gameWonStep = step;
          next();
        }, delays[step]);
      } else {
        setStoppableTimeout(() => menuGoHome(), 2500);
      }
    };
    next();
  }

  showGameOver() {
    const paths = [
      "img/You won, you lost/Game Over.png",
      "img/You won, you lost/You lost b.png",
      "img/You won, you lost/You lost.png",
      "img/You won, you lost/Game over A.png",
    ];
    this.gameOverImages = paths.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
    this.gameOver = true;
    this.gameOverStep = 0;
    const delays = [1500, 1500, 1500, 0];
    let step = 0;
    const next = () => {
      if (delays[step] > 0) {
        setStoppableTimeout(() => {
          step++;
          this.gameOverStep = step;
          next();
        }, delays[step]);
      } else {
        setStoppableTimeout(() => menuGoHome(), 2500);
      }
    };
    next();
  }
}
