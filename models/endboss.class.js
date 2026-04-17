class Endboss extends MovableObject {
  height = 340;
  width = 225;
  y = 110;
  speed = 0.08;
  energy = 200;
  isDead = false;
  isHurt = false;
  activated = false;
  hitCount = 0;
  isJumping = false;
  world;

  static GROUND_Y = -110;
  offset = { top: 60, bottom: 20, left: 30, right: 30 };

  constructor() {
    super().loadImage(IMAGES_ENDBOSS_WALK[0]);
    this.loadImages(IMAGES_ENDBOSS_WALKING);
    this.loadImages(IMAGES_ENDBOSS_WALK);
    this.loadImages(IMAGES_ENDBOSS_ATTACK);
    this.loadImages(IMAGES_ENDBOSS_HURT);
    this.loadImages(IMAGES_ENDBOSS_DEAD);
    this.x = 719 * 8;
    this.animate();
  }

  isNearPepe() {
    if (!this.world) return false;
    return Math.abs(this.x - this.world.character.x) < 100;
  }

  activate() {
    if (this.activated) return;
    this.activated = true;
    this.height = 560;
    this.width = 370;
    this.y = -110;
    this.applyGravity();
    this.startJumpAttackLoop();
  }

  isAboveGround() {
    return this.y < Endboss.GROUND_Y;
  }

  startJumpAttackLoop() {
    setStoppableInterval(() => {
      if (this.world && this.world.paused) return;
      if (!this.isDead && this.activated && !this.isJumping && !this.isNearPepe()) {
        this.jumpTowardsPepe();
      }
    }, 5000);
  }

  jumpTowardsPepe() {
    if (!this.world) return;
    this.isJumping = true;
    this.speedY = 35;
    const direction = this.world.character.x < this.x ? -1 : 1;
    this.startJumpMoveInterval(direction);
  }

  startJumpMoveInterval(direction) {
    const jumpMove = setStoppableInterval(() => {
      if (this.world && this.world.paused) return;
      if (this.isDead) {
        clearInterval(jumpMove);
        return;
      }
      this.x += direction * 4;
    }, 30);
    setStoppableTimeout(() => {
      clearInterval(jumpMove);
      this.isJumping = false;
    }, 800);
  }

  hit() {
    this.energy -= 10;
    this.hitCount++;
    if (this.energy <= 0) {
      this.energy = 0;
      this.die();
    } else {
      this.handleHurt();
    }
  }

  handleHurt() {
    this.showHurt();
    if (this.world) this.spawnChickens();
  }

  spawnChickens() {
    const spawnX = this.x + this.width / 2 - 35;
    const spawnY = this.y + this.height * 0.55;
    for (let i = 0; i < 1; i++) {
      const offsetX = (i - 2) * 30;
      const chicken = new BossChicken(spawnX + offsetX, spawnY, this.world);
      this.world.level.enemies.push(chicken);
    }
  }

  showHurt() {
    this.isHurt = true;
    setStoppableTimeout(() => {
      this.isHurt = false;
    }, 500);
  }

  die() {
    this.isDead = true;
    this.speed = 0;
    setStoppableTimeout(() => {
      this.toBeRemoved = true;
      if (this.world) this.world.showGameWon();
    }, 1500);
  }

  animate() {
    setStoppableInterval(() => {
      if (this.world && this.world.paused) return;
      if (this.isDead) return;
      this.moveLeft();
    }, 30);

    setStoppableInterval(() => {
      if (this.world && this.world.paused) return;
      if (this.isDead) {
        this.playAnimation(IMAGES_ENDBOSS_DEAD);
      } else if (this.isHurt) {
        this.playAnimation(IMAGES_ENDBOSS_HURT);
      } else if (this.isJumping) {
        this.playAnimation(IMAGES_ENDBOSS_ATTACK);
      } else if (this.activated) {
        this.playAnimation(IMAGES_ENDBOSS_WALKING);
      } else if (this.isNearPepe()) {
        this.playAnimation(IMAGES_ENDBOSS_WALKING);
      } else {
        this.playAnimation(IMAGES_ENDBOSS_WALK);
      }
    }, 100);
  }
}
