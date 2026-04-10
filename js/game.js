let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
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
