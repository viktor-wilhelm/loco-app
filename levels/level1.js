function createBackgrounds() {
  const backgrounds = [];
  const layers = [
    { path: "img/5_background/layers/air_1920-1080px.png", speed: 0.0, variant: false },
    { path: "img/5_background/layers/3_third_layer/{n}.png", speed: 0.1, variant: true },
    { path: "img/5_background/layers/2_second_layer/{n}.png", speed: 0.2, variant: true },
    { path: "img/5_background/layers/1_first_layer/{n}.png", speed: 0.3, variant: true },
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

const level1 = new Level(
  [new Chicken(), new Chicken(), new Chicken(), new Endboss()],
  [
    new Cloud(),
    new Cloud(),
    new Cloud(),
    new Cloud(),
    new Cloud(),
    new Cloud(),
    new Cloud(),
    new Cloud(),
    new Cloud(),
    new Cloud(),
  ],
  createBackgrounds(),
);
