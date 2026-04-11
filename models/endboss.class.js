class Endboss extends MovableObject {
  height = 340;
  width = 225;
  y = 110;
  speed = 0.8;
  energy = 100;
  isDead = false;
  isHurt = false;
  activated = false;
  hitCount = 0;
  isJumping = false;
  world;

  static GROUND_Y = 0;
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
    this.height = 450;
    this.width = 300;
    this.y = 0;
    this.applyGravity();
    this.startJumpAttackLoop();
  }

  isAboveGround() {
    return this.y < Endboss.GROUND_Y;
  }

  startJumpAttackLoop() {
    setInterval(() => {
      if (!this.isDead && this.activated && !this.isJumping && !this.isNearPepe()) {
        this.jumpTowardsPepe();
      }
    }, 5000);
  }

  jumpTowardsPepe() {
    if (!this.world) return;
    this.isJumping = true;
    this.speedY = 20;
    const direction = this.world.character.x < this.x ? -1 : 1;
    const jumpMove = setInterval(() => {
      if (this.isDead) {
        clearInterval(jumpMove);
        return;
      }
      this.x += direction * 4;
    }, 30);
    setTimeout(() => {
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
      this.showHurt();
      if (this.world && this.hitCount % 1 === 0) this.spawnChickens();
    }
  }

  spawnChickens() {
    const spawnX = this.x + this.width / 2 - 35;
    const spawnY = this.y + this.height * 0.55;
    for (let i = 0; i < 5; i++) {
      const offsetX = (i - 2) * 30;
      const chicken = new BossChicken(spawnX + offsetX, spawnY, this.world);
      this.world.level.enemies.push(chicken);
    }
  }

  showHurt() {
    this.isHurt = true;
    setTimeout(() => {
      this.isHurt = false;
    }, 500);
  }

  die() {
    this.isDead = true;
    this.speed = 0;
    setTimeout(() => {
      this.toBeRemoved = true;
    }, 1500);
  }

  animate() {
    setInterval(() => {
      if (this.isDead) return;
      if (this.activated) {
        if (!this.isNearPepe()) this.moveLeft();
      } else {
        if (!this.isNearPepe()) this.moveLeft();
      }
    }, 30);

    setInterval(() => {
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
