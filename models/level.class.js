/**
 * Represents a game level containing all objects and configuration.
 * @class Level
 */
class Level {
  /** @type {object[]} All enemy objects in the level */
  enemies;
  /** @type {Cloud[]} All cloud objects in the level */
  clouds;
  /** @type {BackgroundObject[]} All background layer objects */
  backgroundObjects;
  /** @type {Coin[]} All coin objects in the level */
  coins;
  /** @type {BottlePickup[]} All bottle pickup objects in the level */
  bottles;
  /** @type {number} X position of the level end (9 screens × 719px) */
  level_end_x = 719 * 9;

  /**
   * Creates a new Level instance.
   * @param {object[]} enemies - Array of enemy objects
   * @param {Cloud[]} clouds - Array of cloud objects
   * @param {BackgroundObject[]} backgroundObjects - Array of background layer objects
   * @param {Coin[]} [coins=[]] - Array of coin objects
   * @param {BottlePickup[]} [bottles=[]] - Array of bottle pickup objects
   */
  constructor(enemies, clouds, backgroundObjects, coins = [], bottles = []) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}
