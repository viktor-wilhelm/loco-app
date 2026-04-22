/**
 * Main game class for El Pollo Loco. Manages game logic, rendering, and collisions.
 * @class World
 */
class World {
  /**
   * @type {WorldRenderer}
   */
  renderer;
  /**
   * @type {WorldItemCollector}
   */
  collector;
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
    this.collector = new WorldItemCollector(this);
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
   * Starts the main game intervals (game loop).
   */
  run() {
    setStoppableInterval(() => {
      if (this.gameOver || this.gameWon || this.paused) return;
      this.checkThrowObjects();
      this.collector.checkCoinCollisions();
      this.collector.checkBottleCollisions();
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
    this.bottleBar.setPercentage(this.collector.calcBottleBarPct());
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
    this.character.speedY = 35;
    this.startEndbossKnockback();
    setStoppableTimeout(() => {
      this.activeEnemyInteraction = false;
    }, 800);
  }

  /**
   * Pushes Pepe horizontally away from the endboss after a jump hit.
   * Runs for a short duration to simulate a knockback effect.
   */
  startEndbossKnockback() {
    let ticks = 0;
    const knockback = setStoppableInterval(() => {
      this.character.x -= 54;
      ticks++;
      if (ticks >= 10) clearInterval(knockback);
    }, 25);
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
        setStoppableTimeout(() => showEndScreen(), 1500);
      }
    };
    next();
  }

  /**
   * Stops all game intervals and audio. Keeps the render loop and
   * pending timeouts (overlay sequence) alive.
   */
  stopGame() {
    clearIntervalIdsOnly();
    this.audioManager?.stopBackground();
    this.audioManager?.stopRunSound();
  }

  /**
   * Shows the win screen and starts the sequence.
   */
  showGameWon() {
    this.gameWon = true;
    this.stopGame();
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
    this.stopGame();
    this.audioManager?.playSound("gameOver");
    document.getElementById("touch-controls").classList.remove("game__touch-controls--active");
    this.gameOverStep = 0;
    this.startImageSequence([1500, 1500, 1500, 0], (s) => (this.gameOverStep = s));
  }
}
