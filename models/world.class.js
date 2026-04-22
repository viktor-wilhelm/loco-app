/**
 * Main game class for El Pollo Loco. Manages game logic, rendering, and collisions.
 * @class World
 */
class World {
  /**
   * @type {WorldRenderer}
   */
  renderer;
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
  activeEnemyInteraction = false;
  gameOver = false;
  gameOverStep = -1;
  gameOverImages = IMAGES_GAME_OVER.map((src) => Object.assign(new Image(), { src }));
  gameWon = false;
  gameWonStep = -1;
  gameWonImages = IMAGES_GAME_WON.map((src) => Object.assign(new Image(), { src }));
  coinsCollected = 0;
  totalCoins = 0;
  coinHealCounter = 0;
  bottlesCollected = 0;
  totalBottles = 0;
  bottleRefillCount = 0;

  /**
   * Creates a new World instance.
   * @param {HTMLCanvasElement} canvas - The canvas element for rendering.
   * @param {Keyboard} keyboard - Keyboard handler for input.
   * @param {object} audioManager - Audio manager for sounds.
   */
  constructor(canvas, keyboard, audioManager) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.audioManager = audioManager;
    this.totalCoins = this.level.coins.length;
    this.totalBottles = this.level.bottles.length;
    this.renderer = new WorldRenderer(this);
    this.renderer.draw();
    this.setWorld();
    this.run();
    setStoppableTimeout(() => {
      this.level.enemies = createEnemies(this.character.x + 800);
      this.setWorld();
    }, 3000);
  }

  /**
   * Links world reference to character and enemies.
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((e) => (e.world = this));
  }

  /**
   * Sets the world reference for the endboss.
   */
  setEndbossWorld() {
    const boss = this.level.enemies.find((e) => e instanceof Endboss);
    if (boss) boss.world = this;
  }

  /**
   * Starts the main game intervals (game loop).
   */
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
      this.checkEnemyRespawn();
      this.checkCollisions();
      this.checkBottleHitsEnemy();
    }, 50);
  }

  /**
   * Checks if new enemies need to be spawned.
   */
  checkEnemyRespawn() {
    const hasChickens = this.level.enemies.some(
      (e) => (e instanceof Chicken || e instanceof SmallChicken) && !e.isDead,
    );
    if (!hasChickens) this.spawnChickenWave();
  }

  /**
   * Spawns a new wave of enemies (without endboss).
   */
  spawnChickenWave() {
    const newEnemies = createEnemies(this.character.x + 800).filter((e) => !(e instanceof Endboss));
    newEnemies.forEach((e) => (e.world = this));
    this.level.enemies.push(...newEnemies);
  }

  /**
   * Checks if a bottle should be thrown.
   */
  checkThrowObjects() {
    this.throwableObjects = this.throwableObjects.filter((b) => !b.isUsed);
    if (!this.keyboard.THROW_PENDING) return;
    this.keyboard.THROW_PENDING = false;
    if (this.bottlesCollected > 0) this.throwBottle();
  }

  /**
   * Throws a bottle and removes it from inventory.
   */
  throwBottle() {
    const facingLeft = this.character.otherDirection;
    const offsetX = facingLeft ? -10 : 40;
    const bottle = new ThrowableObject(this.character.x + offsetX, this.character.y + 100, facingLeft);
    bottle.onSplash = () => {
      this.audioManager?.playSound("bottleSplash");
    };
    this.throwableObjects.push(bottle);
    this.bottlesCollected--;
    this.bottleBar.setPercentage(this.calcBottleBarPct());
    if (this.bottlesCollected === 0 && this.level.bottles.length === 0) {
      this.spawnBottleRefill();
    }
  }

  /**
   * Refills bottles if none are left.
   */
  spawnBottleRefill() {
    if (this.bottleRefillCount >= 1) return;
    this.bottleRefillCount++;
    this.level.bottles = createBottles(10);
  }

  /**
   * Checks collisions between character and enemies.
   */
  checkCollisions() {
    for (const enemy of this.level.enemies) {
      if (!enemy.isDead && this.character.isColliding(enemy)) {
        if (!this.activeEnemyInteraction && this.character.isJumpingOn(enemy)) {
          this.handleJumpOnEnemy(enemy);
          break;
        } else if (this.canTakeDamage()) {
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
          this.audioManager?.playSound("playerHurt");
        }
      }
    }
  }

  /**
   * Checks if the character can take damage.
   * @returns {boolean} true if damage is possible
   */
  canTakeDamage() {
    return (
      !this.activeEnemyInteraction &&
      !this.character.isHurt() &&
      !this.character.resumeInvincible &&
      this.character.speedY <= 0
    );
  }

  /**
   * Handles jumping on an enemy.
   * @param {object} enemy - The enemy object hit
   */
  handleJumpOnEnemy(enemy) {
    this.activeEnemyInteraction = true;
    if (enemy instanceof Endboss) {
      this.handleJumpOnEndboss(enemy);
    } else {
      this.handleJumpOnChicken(enemy);
    }
  }

  /**
   * Handles jumping on the endboss.
   * @param {Endboss} enemy - The endboss
   */
  handleJumpOnEndboss(enemy) {
    enemy.activate();
    enemy.hit();
    enemy.hit();
    this.endbossBar.setPercentage(enemy.energy);
    this.character.speedY = 30;
    setStoppableTimeout(() => {
      this.activeEnemyInteraction = false;
    }, 800);
  }

  /**
   * Handles jumping on a chicken.
   * @param {Chicken|SmallChicken} enemy - The chicken
   */
  handleJumpOnChicken(enemy) {
    enemy.die();
    this.audioManager?.playSound(enemy instanceof SmallChicken ? "smallChickenDie" : "enemyDie", 1000);
    this.character.speedY = 15;
    setStoppableTimeout(() => {
      this.activeEnemyInteraction = false;
    }, 100);
  }

  /**
   * Checks if thrown bottles hit enemies.
   */
  checkBottleHitsEnemy() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.isSplashing) return;
      this.level.enemies.forEach((enemy) => {
        if (!enemy.isDead && bottle.isColliding(enemy)) {
          this.applyBottleHit(bottle, enemy);
        }
      });
    });
  }

  /**
   * Applies bottle hit to an enemy.
   * @param {ThrowableObject} bottle - The bottle
   * @param {object} enemy - The enemy object hit
   */
  applyBottleHit(bottle, enemy) {
    if (enemy instanceof Endboss) {
      enemy.activate();
      enemy.hit();
      this.endbossBar.setPercentage(enemy.energy);
      this.audioManager?.playSound("enemyHit");
    } else {
      enemy.die();
      this.audioManager?.playSound(enemy instanceof SmallChicken ? "smallChickenDie" : "enemyDie", 1000);
    }
    bottle.isSplashing = true;
    bottle.playSplash();
  }

  /**
   * Checks if coins are collected.
   */
  checkCoinCollisions() {
    if (this.coinsCollected >= this.totalCoins) return;
    this.level.coins = this.level.coins.filter((coin) => {
      const isAirCoin = coin.y < 300;
      const canCollect = !isAirCoin || this.character.isAboveGround();
      if (canCollect && this.character.isColliding(coin)) {
        this.collectCoin();
        return false;
      }
      return true;
    });
  }

  /**
   * Collects a coin and updates the display.
   */
  collectCoin() {
    this.coinsCollected++;
    const percentage = Math.round((this.coinsCollected / this.totalCoins) * 100);
    this.coinBar.setPercentage(percentage);
    this.audioManager?.playSound("coin");
    this.coinHealCounter++;
    if (this.coinHealCounter >= 10 && this.character.energy < 100) {
      this.coinHealCounter = 0;
      this.character.heal(100);
      this.statusBar.setPercentage(this.character.energy);
    }
  }

  /**
   * Checks if bottles are collected.
   */
  checkBottleCollisions() {
    if (this.bottlesCollected >= 10) return;
    this.level.bottles = this.level.bottles.filter((bottle) => {
      if (this.isBottleHittingCharacter(bottle)) {
        this.collectBottle();
        return false;
      }
      return true;
    });
  }

  /**
   * Checks if a bottle hits the character.
   * @param {object} bottle - The bottle
   * @returns {boolean} true if hit
   */
  isBottleHittingCharacter(bottle) {
    const c = this.character;
    const centerX = c.x + c.offset.left + (c.width - c.offset.left - c.offset.right) / 2;
    const bottom = c.y + c.height - c.offset.bottom;
    const midY = c.y + c.height / 2;
    const bLeft = bottle.x + bottle.offset.left;
    const bRight = bottle.x + bottle.width - bottle.offset.right;
    const bTop = bottle.y + bottle.offset.top;
    const bBottom = bottle.y + bottle.height - bottle.offset.bottom;
    return centerX > bLeft && centerX < bRight && bottom > bTop && midY < bBottom;
  }

  /**
   * Calculates the percentage for the bottle bar.
   * @returns {number} Percentage (0-100)
   */
  calcBottleBarPct() {
    if (this.bottlesCollected === 0) return 0;
    return Math.min(100, Math.ceil((this.bottlesCollected / 10) * 5) * 20);
  }

  /**
   * Collects a bottle and updates the display.
   */
  collectBottle() {
    this.bottlesCollected++;
    this.bottleBar.setPercentage(this.calcBottleBarPct());
    this.audioManager?.playSound("bottlePickup");
  }

  /**
   * Starts an image sequence for overlays.
   * @param {number[]} delays - Delays per step
   * @param {function(number):void} onStep - Callback per step
   */
  startImageSequence(delays, onStep) {
    let step = 0;
    const next = () => {
      if (delays[step] > 0) {
        setStoppableTimeout(() => {
          step++;
          onStep(step);
          next();
        }, delays[step]);
      } else {
        setStoppableTimeout(() => menuGoHome(), 2500);
      }
    };
    next();
  }

  /**
   * Shows the win screen and starts the sequence.
   */
  showGameWon() {
    this.gameWon = true;
    this.audioManager?.playSound("gameWon");
    document.getElementById("touch-controls").classList.remove("game__touch-controls--active");
    this.gameWonStep = 0;
    this.startImageSequence([1500, 0], (s) => (this.gameWonStep = s));
  }

  /**
   * Shows the game over screen and starts the sequence.
   */
  showGameOver() {
    this.gameOver = true;
    this.audioManager?.playSound("gameOver");
    document.getElementById("touch-controls").classList.remove("game__touch-controls--active");
    this.gameOverStep = 0;
    this.startImageSequence([1500, 1500, 1500, 0], (s) => (this.gameOverStep = s));
  }
}
