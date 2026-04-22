/**
 * Handles coin and bottle collection logic for the World.
 * @class WorldItemCollector
 */
class WorldItemCollector {
  /** @type {number} Margin applied to shrink hitboxes for coin collection. */
  static COIN_MARGIN = 18;

  /**
   * Creates a new WorldItemCollector instance.
   * @param {World} world - The game world instance.
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Filters the coin list and collects any coin the character overlaps.
   */
  checkCoinCollisions() {
    const w = this.world;
    if (w.coinsCollected >= w.totalCoins) return;
    w.level.coins = w.level.coins.filter((coin) => {
      const isAirCoin = coin.y < 300;
      const canCollect = !isAirCoin || w.character.isAboveGround();
      if (canCollect && this.isCoinHitboxOverlap(w.character, coin)) {
        this.collectCoin();
        return false;
      }
      return true;
    });
  }

  /**
   * Checks if the character's tightened hitbox overlaps with a coin.
   * @param {MovableObject} char - The character
   * @param {Coin} coin - The coin
   * @returns {boolean}
   */
  isCoinHitboxOverlap(char, coin) {
    const m = WorldItemCollector.COIN_MARGIN;
    const left = char.x + char.offset.left + m;
    const right = char.x + char.width - char.offset.right - m;
    const top = char.y + char.offset.top + m;
    const bottom = char.y + char.height - char.offset.bottom - m;
    const coinLeft = coin.x + coin.offset.left + m;
    const coinRight = coin.x + coin.width - coin.offset.right - m;
    const coinTop = coin.y + coin.offset.top + m;
    const coinBottom = coin.y + coin.height - coin.offset.bottom - m;
    return right > coinLeft && bottom > coinTop && left < coinRight && top < coinBottom;
  }

  /**
   * Registers a collected coin, updates HUD and heals on milestone.
   */
  collectCoin() {
    const w = this.world;
    w.coinsCollected++;
    const percentage = Math.round((w.coinsCollected / w.totalCoins) * 100);
    w.coinBar.setPercentage(percentage);
    w.audioManager?.playSound("coin");
    w.coinHealCounter++;
    if (w.coinHealCounter >= 10 && w.character.energy < 100) {
      w.coinHealCounter = 0;
      w.character.heal(100);
      w.statusBar.setPercentage(w.character.energy);
    }
  }

  /**
   * Filters the bottle list and collects any bottle the character overlaps.
   */
  checkBottleCollisions() {
    const w = this.world;
    if (w.bottlesCollected >= 10) return;
    w.level.bottles = w.level.bottles.filter((bottle) => {
      if (this.isBottleHittingCharacter(bottle)) {
        this.collectBottle();
        return false;
      }
      return true;
    });
  }

  /**
   * Checks if a bottle overlaps with the character's lower body center.
   * @param {BottlePickup} bottle - The bottle pickup object
   * @returns {boolean}
   */
  isBottleHittingCharacter(bottle) {
    const c = this.world.character;
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
   * Calculates the fill percentage for the bottle status bar.
   * @returns {number} A value between 0 and 100, stepping in increments of 20.
   */
  calcBottleBarPct() {
    const w = this.world;
    if (w.bottlesCollected === 0) return 0;
    return Math.min(100, Math.ceil((w.bottlesCollected / 10) * 5) * 20);
  }

  /**
   * Registers a collected bottle and updates the HUD.
   */
  collectBottle() {
    const w = this.world;
    w.bottlesCollected++;
    w.bottleBar.setPercentage(this.calcBottleBarPct());
    w.audioManager?.playSound("bottlePickup");
  }
}
