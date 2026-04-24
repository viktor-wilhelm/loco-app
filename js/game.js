/**
 * @fileoverview Main game initialization and UI control logic for El Pollo Loco.
 * @description Handles volume controls, menu state, input bindings and game start/stop.
 */

let canvas;
let world;
let audioManager;
let keyboard = new Keyboard();

/**
 * Initialize the game UI, volume slider, and audio manager.
 */
function init() {
  document.querySelector(".preloader").classList.add("preloader--hidden");
  const slider = document.getElementById("volume-slider");
  const savedVolume = parseFloat(localStorage.getItem("masterVolume"));
  if (savedVolume > 0) slider.value = savedVolume;
  window.masterVolume = parseFloat(slider.value);
  audioManager = new AudioManager(window.masterVolume);
  audioManager.playBackground("menu");
  registerAutoplayFallback();
  updateMuteButton();
  updateSliderFill(slider);
  slider.addEventListener("input", () => {
    window.masterVolume = parseFloat(slider.value);
    audioManager.setVolume(window.masterVolume);
    localStorage.setItem("masterVolume", slider.value);
    updateSliderFill(slider);
  });
}

/**
 * Registers one-time event listeners to resume BGM if autoplay was blocked.
 */
function registerAutoplayFallback() {
  const resumeBgm = () => {
    if (audioManager.bgmElement?.paused) audioManager.bgmElement.play().catch(() => {});
    else if (!audioManager.bgmElement) audioManager.playBackground("menu");
  };
  document.addEventListener("pointerdown", resumeBgm, { once: true });
  document.addEventListener("keydown", resumeBgm, { once: true });
}

/**
 * Update the CSS fill level for a volume slider.
 * @param {HTMLInputElement} slider - The range input element.
 */
function updateSliderFill(slider) {
  const pct = parseFloat(slider.value) * 100;
  slider.style.setProperty("--fill", pct + "%");
}

/**
 * Show or hide mobile touch controls.
 * @param {boolean} visible - Whether the touch controls should be visible.
 */
function setTouchControlsVisible(visible) {
  document.getElementById("touch-controls").classList.toggle("game__touch-controls--active", visible);
}

/**
 * Start the game, create the world, and switch to gameplay state.
 */
function startGame() {
  clearAllIntervals();
  level1 = createLevel1();
  document.getElementById("start-screen").style.display = "none";
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard, audioManager);
  audioManager?.playBackground("game");
  audioManager?.playSound("gameStart");
  setTouchControlsVisible(true);
}

/**
 * Keep the in-menu volume slider synced with the main UI slider.
 */
function syncMenuSlider() {
  const menuSlider = document.getElementById("menu-volume-slider");
  menuSlider.value = document.getElementById("volume-slider").value;
  updateSliderFill(menuSlider);
  menuSlider.addEventListener("input", () => {
    window.masterVolume = parseFloat(menuSlider.value);
    audioManager?.setVolume(window.masterVolume);
    localStorage.setItem("masterVolume", menuSlider.value);
    updateSliderFill(menuSlider);
    document.getElementById("volume-slider").value = menuSlider.value;
    updateSliderFill(document.getElementById("volume-slider"));
  });
}

/**
 * Update the visible mute button icon according to audio state.
 */
function updateMuteButton() {
  const muteBtn = document.getElementById("mute-btn");
  if (!muteBtn || !audioManager) return;
  muteBtn.textContent = audioManager.muted ? "🔇" : "🔊";
}

/**
 * Toggle master audio mute state and refresh the button.
 */
function toggleMute() {
  audioManager?.toggleMute();
  updateMuteButton();
}

/**
 * Update the primary menu button text and action.
 */
function updatePrimaryMenuBtn() {
  const primaryBtn = document.querySelector(".menu-btn--primary");
  if (world) {
    primaryBtn.textContent = "▶ Continue";
    primaryBtn.onclick = () => closeMenu();
  } else {
    primaryBtn.textContent = "▶ Start Game";
    primaryBtn.onclick = () => menuStartGame();
  }
}

/**
 * Open the in-game menu and pause gameplay if necessary.
 */
function openMenu() {
  if (world) world.paused = true;
  setTouchControlsVisible(false);
  syncMenuSlider();
  updateMuteButton();
  updatePrimaryMenuBtn();
  document.getElementById("menu-popup").removeAttribute("hidden");
}

/**
 * Close the in-game menu and resume gameplay.
 */
function closeMenu() {
  document.getElementById("menu-popup").setAttribute("hidden", "");
  if (world) {
    world.character.resumeInvincible = true;
    setStoppableTimeout(() => {
      world.character.resumeInvincible = false;
    }, 1000);
    world.paused = false;
    setTouchControlsVisible(true);
  }
}

/**
 * Close the menu and start a new game.
 */
function menuStartGame() {
  closeMenu();
  startGame();
}

/**
 * Return to the home screen and reset the current game.
 */
/**
 * Shows the end-screen buttons after game over or win.
 */
function showEndScreen() {
  document.getElementById("end-screen").removeAttribute("hidden");
}

/**
 * Hides the end screen, then starts a new game.
 */
function endScreenStartGame() {
  document.getElementById("end-screen").setAttribute("hidden", "");
  startGame();
}

function menuGoHome() {
  document.getElementById("end-screen").setAttribute("hidden", "");
  closeMenu();
  clearAllIntervals();
  if (world) {
    world.gameOver = true;
    world.gameWon = true;
  }
  world = null;
  document.getElementById("start-screen").style.display = "";
  audioManager?.playBackground("menu");
  setTouchControlsVisible(false);
}

/**
 * Open the controls overlay from the menu.
 */
function menuShowControls() {
  loadOverlay("templates/menu-controls.html");
  closeMenu();
}

/**
 * Handle keyboard input and translate keys into game actions.
 * @param {KeyboardEvent} e - The keyboard event.
 * @param {boolean} isPressed - Whether the key is pressed or released.
 */
function handleKey(e, isPressed) {
  const keyMap = {
    ArrowRight: "RIGHT",
    ArrowLeft: "LEFT",
    ArrowUp: "UP",
    ArrowDown: "DOWN",
    " ": "SPACE",
    d: "D",
  };
  if (keyMap[e.key] !== undefined) keyboard[keyMap[e.key]] = isPressed;
  if (e.key === "d" && isPressed && !e.repeat) keyboard.THROW_PENDING = true;
  if (e.key === "Escape" && isPressed && world) {
    document.getElementById("menu-popup").hasAttribute("hidden") ? openMenu() : closeMenu();
  }
}

window.addEventListener("keydown", (e) => handleKey(e, true));
window.addEventListener("keyup", (e) => handleKey(e, false));

/**
 * Bind touch buttons to game input actions for mobile devices.
 */
/**
 * Create an array of mobile touch button bindings.
 * @returns {Array<[string, Function, Function]>}
 */
function createTouchMap() {
  return [
    ["touch-left", () => (keyboard.LEFT = true), () => (keyboard.LEFT = false)],
    ["touch-right", () => (keyboard.RIGHT = true), () => (keyboard.RIGHT = false)],
    ["touch-jump", () => (keyboard.UP = true), () => (keyboard.UP = false)],
    [
      "touch-throw",
      () => {
        keyboard.D = true;
        keyboard.THROW_PENDING = true;
      },
      () => {
        keyboard.D = false;
      },
    ],
  ];
}

/**
 * Attach touch event handlers to a button element.
 * @param {string} id
 * @param {Function} onStart
 * @param {Function} onEnd
 */
function bindTouchButton(id, onStart, onEnd) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      onStart();
    },
    { passive: false },
  );
  btn.addEventListener("touchend", onEnd);
}

/**
 * Bind touch buttons to game input actions for mobile devices.
 */
function bindTouchEvents() {
  createTouchMap().forEach(([id, onStart, onEnd]) => bindTouchButton(id, onStart, onEnd));
}

document.addEventListener("DOMContentLoaded", bindTouchEvents);
