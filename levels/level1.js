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
  const startX = 400;
  const endX = 6200;
  const count = 30;
  const step = (endX - startX) / (count - 1);

  for (let i = 0; i < count; i++) {
    const x = startX + i * step + (Math.random() - 0.5) * (step * 0.5);
    const y =
      i % 2 === 0
        ? 340 + Math.random() * 20 
        : 80 + Math.random() * 60; 
    coins.push(new Coin(x, y));
  }
  return coins;
}

function createBottles() {
  const bottles = [];
  const MIN_DISTANCE = 200;
  let attempts = 0;
  while (bottles.length < 20 && attempts < 2000) {
    const x = 600 + Math.random() * 5400;
    const tooClose = bottles.some((b) => Math.abs(b.x - x) < MIN_DISTANCE);
    if (!tooClose) {
      const y = 340 + Math.random() * 10;
      bottles.push(new BottlePickup(x, y));
    }
    attempts++;
  }
  return bottles;
}

function createEnemies(minX = 1000) {
  return [
    ...createObjects(8, () => new Chicken(minX)),
    ...createObjects(8, () => new SmallChicken(minX)),
    new Endboss(),
  ];
}

function createLevel1() {
  return new Level(
    [],
    createObjects(20, (_, i) => new Cloud(i * 350)),
    createBackgrounds(),
    createCoins(),
    createBottles(),
  );
}

let level1 = createLevel1();
