/**
 * @fileoverview Fullscreen management for El Pollo Loco.
 * @description Handles fullscreen toggle functionality.
 */

/**
 * Toggle fullscreen mode for the game container.
 */
function toggleFullscreen() {
  const container = document.querySelector(".game-container");
  if (!document.fullscreenElement) {
    container.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}
