class Level {
  enemies;
  clouds;
  backgroundObjects;
  level_end_x = 719 * 12; // Ende der Karte (9 Screens à 719px)

  constructor(enemies, clouds, backgroundObjects) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
  }
}