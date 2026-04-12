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
  document.getElementById("start-screen").style.display = "none";
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
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
}

window.addEventListener("keydown", (e) => handleKey(e, true));
window.addEventListener("keyup", (e) => handleKey(e, false));
