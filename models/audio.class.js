/**
 * @fileoverview Audio management for El Pollo Loco.
 * @description Manages effect playback, volume and mute state.
 */
class AudioManager {
  soundSources = {
    jump: ["audio/jump.mp3"],
    throwBottle: ["audio/throw.mp3"],
    coin: ["audio/coin.mp3"],
    enemyHit: ["audio/enemy-hit.mp3"],
    enemyDie: ["audio/enemy-die.mp3"],
    playerHurt: ["audio/player-hurt.mp3"],
    gameStart: ["audio/game-start.mp3"],
    gameOver: ["audio/game-over.mp3"],
  };
  muted = false;
  volume = 1;

  constructor(initialVolume = 1) {
    this.volume = this.clampVolume(initialVolume);
    this.muted = localStorage.getItem("epl_muted") === "true";
  }

  /**
   * Plays a sound effect by name.
   * @param {string} name - Sound identifier.
   */
  playSound(name) {
    if (this.muted) return;
    const sources = this.soundSources[name];
    if (!sources?.length) return;
    const src = sources[Math.floor(Math.random() * sources.length)];
    const audio = new Audio(src);
    audio.volume = this.volume;
    audio.muted = this.muted;
    audio.play().catch(() => {});
  }

  /**
   * Register or replace a sound effect mapping.
   * @param {string} name - Sound identifier.
   * @param {string[]} sources - Array of audio source paths.
   */
  registerSound(name, sources) {
    if (!Array.isArray(sources)) return;
    this.soundSources[name] = sources;
  }

  /**
   * Update the global volume for new playback.
   * @param {number} volume
   */
  setVolume(volume) {
    this.volume = this.clampVolume(volume);
  }

  /**
   * Enable or disable all audio.
   * @param {boolean} muted
   */
  setMuted(muted) {
    this.muted = Boolean(muted);
    localStorage.setItem("epl_muted", this.muted);
  }

  /**
   * Toggle mute state and persist it.
   */
  toggleMute() {
    this.setMuted(!this.muted);
  }

  clampVolume(volume) {
    return Math.max(0, Math.min(1, parseFloat(volume) || 0));
  }
}
