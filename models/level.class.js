class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  level_end_x = 719 * 9; // Ende der Karte (9 Screens à 719px)

  constructor(enemies, clouds, backgroundObjects, coins = []) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
  }
}
