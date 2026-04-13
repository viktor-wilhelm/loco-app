let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  document.querySelector(".preloader").classList.add("preloader--hidden");
  const slider = document.getElementById("volume-slider");
  const savedVolume = localStorage.getItem("masterVolume");
  if (savedVolume !== null) slider.value = savedVolume;
  window.masterVolume = parseFloat(slider.value);
  updateSliderFill(slider);
  slider.addEventListener("input", () => {
    window.masterVolume = parseFloat(slider.value);
    localStorage.setItem("masterVolume", slider.value);
    updateSliderFill(slider);
  });
}

function updateSliderFill(slider) {
  const pct = parseFloat(slider.value) * 100;
  slider.style.setProperty("--fill", pct + "%");
}

function startGame() {
  clearAllIntervals();
  level1 = createLevel1();
  document.getElementById("start-screen").style.display = "none";
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

function openMenu() {
  if (world) world.paused = true;
  const menuSlider = document.getElementById("menu-volume-slider");
  menuSlider.value = document.getElementById("volume-slider").value;
  updateSliderFill(menuSlider);
  menuSlider.addEventListener("input", () => {
    window.masterVolume = parseFloat(menuSlider.value);
    localStorage.setItem("masterVolume", menuSlider.value);
    updateSliderFill(menuSlider);
    document.getElementById("volume-slider").value = menuSlider.value;
    updateSliderFill(document.getElementById("volume-slider"));
  });
  document.getElementById("menu-popup").removeAttribute("hidden");
}

function closeMenu() {
  document.getElementById("menu-popup").setAttribute("hidden", "");
  if (world) world.paused = false;
}

function menuStartGame() {
  closeMenu();
  startGame();
}

function menuGoHome() {
  closeMenu();
  clearAllIntervals();
  if (world) {
    world.gameOver = true;
    world.gameWon = true;
  }
  world = null;
  document.getElementById("start-screen").style.display = "";
}

function menuShowControls() {
  loadOverlay("templates/controls.html");
  closeMenu();
}
function toggleFullscreen() {
  const container = document.getElementById("game-container");
  if (!document.fullscreenElement) {
    container.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

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
  if (e.key === "d" && isPressed) keyboard.THROW_PENDING = true;
  if (e.key === "Escape" && isPressed && world) {
    document.getElementById("menu-popup").hasAttribute("hidden") ? openMenu() : closeMenu();
  }
}

window.addEventListener("keydown", (e) => handleKey(e, true));
window.addEventListener("keyup", (e) => handleKey(e, false));
