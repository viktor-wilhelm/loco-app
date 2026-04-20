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

  bgmSources = {
    menu: ["audio/background-desert-shimmer.mp3"],
    game: ["audio/background-gregorquendel-tetris-theme-korobeiniki-arranged-for-piano.mp3"],
  };

  bgmElement = null;
  currentBgmName = null;
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
   * Play a looping background track by name.
   * @param {string} name - Background music identifier.
   */
  playBackground(name) {
    if (this.currentBgmName === name && this.bgmElement && !this.bgmElement.paused) {
      return;
    }

    const sources = this.bgmSources[name];
    if (!sources?.length) return;

    this.stopBackground();
    const src = sources[Math.floor(Math.random() * sources.length)];
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = this.volume;
    audio.muted = this.muted;
    audio.play().catch(() => {});
    this.bgmElement = audio;
    this.currentBgmName = name;
  }

  /**
   * Stop the currently playing background music.
   */
  stopBackground() {
    if (this.bgmElement) {
      this.bgmElement.pause();
      this.bgmElement.currentTime = 0;
      this.bgmElement = null;
      this.currentBgmName = null;
    }
  }

  /**
   * Update the global volume for new playback.
   * @param {number} volume
   */
  setVolume(volume) {
    this.volume = this.clampVolume(volume);
    if (this.bgmElement) {
      this.bgmElement.volume = this.volume;
    }
  }

  /**
   * Enable or disable all audio.
   * @param {boolean} muted
   */
  setMuted(muted) {
    this.muted = Boolean(muted);
    localStorage.setItem("epl_muted", this.muted);
    if (this.bgmElement) {
      this.bgmElement.muted = this.muted;
    }
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
