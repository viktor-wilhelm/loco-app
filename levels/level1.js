function createObjects(count, factory) {
  return Array.from({ length: count }, factory);
}

function createBackgrounds() {
  const backgrounds = [];
  const layers = [
    { path: "img/5_background/layers/air_1920-1080px.png", speed: 0.0, variant: false },
    { path: "img/5_background/layers/3_third_layer/{n}.png", speed: 0.17, variant: true },
    { path: "img/5_background/layers/2_second_layer/{n}.png", speed: 0.2, variant: true },
    { path: "img/5_background/layers/1_first_layer/{n}.png", speed: 1.0, variant: true },
  ];

  for (let i = -2; i <= 9; i++) {
    const n = Math.abs(i % 2) + 1; // wechselt zwischen 1 und 2
    layers.forEach((layer) => {
      const path = layer.variant ? layer.path.replace("{n}", n) : layer.path;
      backgrounds.push(new BackgroundObject(path, 719 * i, layer.speed));
    });
  }
  return backgrounds;
}

function createCoins() {
  const coins = [];
  // 20 Münzen gleichmäßig über die Karte verteilt
  for (let i = 0; i < 30; i++) {
    const x = 400 + i * 320 + Math.random() * 150;
    // Abwechselnd Boden- und Luftmünzen
    const y =
      i % 2 === 0
        ? 340 + Math.random() * 20 // am Boden (340–360)
        : 160 + Math.random() * 100; // in der Luft, per Sprung erreichbar (160–260)
    coins.push(new Coin(x, y));
  }
  return coins;
}

const level1 = new Level(
  [...createObjects(20, () => new Chicken()), ...createObjects(25, () => new SmallChicken()), new Endboss()],
  createObjects(20, (_, i) => new Cloud(i * 350)),
  createBackgrounds(),
  createCoins(),
);
