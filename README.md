# El Pollo Loco

A fast-paced 2D jump & run game for the browser – crafted entirely with vanilla JavaScript, HTML5 Canvas, and CSS3. Take control of Pepe and face off against a crazy army of chickens and the notorious end boss! Collect coins, throw salsa bottles, dodge obstacles, and enjoy smooth animations, charming graphics, and an energetic soundtrack.

**Features:**

- Modern OOP architecture (ES6 classes)
- Parallax scrolling & dynamic backgrounds
- Smooth animations & character state machine
- Responsive UI for desktop & mobile (touch controls)
- Sound effects & music (with mute option)
- Progress saving (localStorage)
- Instantly playable – no installation or build required

Dive into a humorous adventure, defeat the chickens, and become the hero of El Pollo Loco!

![El Pollo Loco Screenshot](img/9_intro_outro_screens/start/startscreen_1.png)

## Demo

> Deploy or open `index.html` directly in a browser. No build step required.

## Gameplay

| Action       | Key                     |
| ------------ | ----------------------- |
| Move right   | `→` Arrow Right         |
| Move left    | `←` Arrow Left          |
| Jump         | `↑` Arrow Up or `Space` |
| Duck         | `↓` Arrow Down          |
| Throw bottle | `D`                     |

- Collect **coins** to increase your score
- Collect **salsa bottles** to fill your throw inventory
- Jump **on top of** chickens to defeat them
- Throw bottles at the **Endboss** to deal damage
- Survive — when your health bar empties, it's game over

## Architecture


The project follows an **OOP class hierarchy** with a single rendering loop via `requestAnimationFrame`.

```
DrawableObject
└── MovableObject
    ├── Character         — player-controlled character with full animation state machine
    ├── Chicken           — standard enemy, patrolling
    ├── SmallChicken      — fast, small enemy
    ├── BossChicken       — alternate boss enemy
    ├── Endboss           — main boss enemy with alert/attack phases
    ├── Coin              — collectible coin
    ├── BottlePickup      — collectible salsa bottle
    ├── ThrowableObject   — thrown salsa bottle
    ├── BackgroundObject  — parallax background layer
    ├── Cloud             — decorative, auto-scrolling
    └── StatusBar         — HUD element for health / bottles / coins
```

**Core files:**

| File                              | Responsibility                                        |
| --------------------------------- | ----------------------------------------------------- |
| `js/game.js`                      | Entry point — initialises canvas, world, and keyboard |
| `js/assets.js`                    | Centralised image/audio asset registry                |
| `js/fullscreen.js`                | Fullscreen toggle logic                               |
| `js/include-html.js`              | Loads HTML templates dynamically                      |
| `js/intervals.js`                 | Manages game intervals/timers                         |
| `models/world.class.js`           | Game loop, collision detection, draw cycle            |
| `models/character.class.js`       | Player input, animation states, physics               |
| `models/chicken.class.js`         | Standard enemy logic                                  |
| `models/small-chicken.class.js`   | Small enemy logic                                     |
| `models/boss-chicken.class.js`    | Alternate boss logic                                  |
| `models/endboss.class.js`         | Main boss logic                                       |
| `models/coin.class.js`            | Collectible coin logic                                |
| `models/bottle-pickup.class.js`   | Collectible salsa bottle logic                        |
| `models/throwable-object.class.js`| Thrown salsa bottle logic                             |
| `models/background-object.class.js`| Parallax background layers                           |
| `models/cloud.class.js`           | Decorative cloud logic                                |
| `models/status-bar.class.js`      | HUD for health, bottles, coins                        |
| `models/keyboard.class.js`        | Keyboard input handler                                |
| `models/level.class.js`           | Level data container                                  |
| `levels/level1.js`                | Enemy, coin, bottle, and background placement         |

## Project Structure

```
loco-app/
├── index.html
├── style.css
├── js/
│   ├── assets.js
│   ├── fullscreen.js
│   ├── game.js
│   ├── include-html.js
│   └── intervals.js
├── models/
│   ├── audio.class.js
│   ├── background-object.class.js
│   ├── boss-chicken.class.js
│   ├── bottle-pickup.class.js
│   ├── character.class.js
│   ├── chicken.class.js
│   ├── cloud.class.js
│   ├── coin.class.js
│   ├── drawable-object.class.js
│   ├── endboss.class.js
│   ├── keyboard.class.js
│   ├── level.class.js
│   ├── movable-object.class.js
│   ├── small-chicken.class.js
│   ├── status-bar.class.js
│   ├── throwable-object.class.js
│   └── world.class.js
├── levels/
│   └── level1.js
├── styles/
│   ├── fonts.css
│   ├── footer.css
│   ├── game.css
│   ├── menu.css
│   ├── overlay.css
│   └── preloader.css
├── templates/
│   ├── legal-notice.html
│   ├── menu-controls.html
│   └── privacy-policy.html
├── img/
├── audio/
├── fonts/
├── docs/
└── checkliste.md
```

## Getting Started

```bash
# Clone the repository
git clone https://github.com/<your-username>/el-pollo-loco.git
cd el-pollo-loco/loco-app

# Open in browser — no server needed for local development
open index.html         # macOS
xdg-open index.html     # Linux
start index.html        # Windows
```

> For features that require a local server (e.g. audio autoplay policies), use:
>
> ```bash
> npx serve .
> ```

## Browser Support

| Browser                | Status           |
| ---------------------- | ---------------- |
| Chrome / Edge (latest) | ✓ Supported      |
| Firefox (latest)       | ✓ Supported      |
| Safari (latest)        | ✓ Supported      |
| Mobile (landscape)     | ✓ Touch controls |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit with a descriptive message: `git commit -m "feat: add sleep animation trigger"`
4. Push and open a Pull Request

## Author

**Viktor Wilhelm**

[![Email](https://img.shields.io/badge/Email-hello%40viktor--wilhelm.de-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:hello@viktor-wilhelm.de)
[![GitHub](https://img.shields.io/badge/GitHub-viktor--wilhelm-24292f?style=for-the-badge&logo=github&logoColor=white)](https://github.com/viktor-wilhelm)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-viktor--wilhelm-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/viktor-wilhelm-802b4a332/)

## License

This project was created as part of the [Developer Akademie](https://developerakademie.com) curriculum. Game assets are provided by the course and remain the property of their respective owners.
