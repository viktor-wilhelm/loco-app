/**
 * @fileoverview Audio management for El Pollo Loco.
 * @description Manages effect playback, volume and mute state.
 */
class AudioManager {
  soundSources = {
    jump: ["audio/pepe-jump-dragon-studio-cartoon.mp3"],
    throwBottle: [],
    bottleSplash: ["audio/pepe-glass-bottle-smash.mp3"],
    bottlePickup: ["audio/pepe-pickup-bottle.mp3"],
    coin: ["audio/pepe-coin.mp3"],
    enemyHit: ["audio/chicken-death.mp3", "audio/chicken-small-death.mp3"],
    enemyDie: ["audio/chicken-death.mp3"],
    smallChickenDie: ["audio/chicken-small-death.mp3"],
    endbossDie: ["audio/Endboss-death.mp3"],
    endbossHurt: ["audio/Endboss-hurt.mp3"],
    playerHurt: ["audio/pepe-hurt.mp3"],
    gameStart: [],
    gameOver: ["audio/game-over-deep-male-voice-clip.mp3"],
    gameWon: ["audio/you-win.mp3"],
  };

  runSoundSource = "audio/pepe-running-on-sand.mp3";
  runSoundElement = null;
  runSoundTimer = null;
  runSoundSegmentMs = 1550;

  bgmSources = {
    menu: ["audio/background-desert-shimmer.mp3"],
    game: ["audio/background-gregorquendel-tetris-theme-korobeiniki-arranged-for-piano.mp3"],
  };

  bgmElement = null;
  currentBgmName = null;
  muted = false;
  volume = 1;
  bgmVolume = 0.6; // Menu background music volume
  gameBgmVolume = 0.8; // Game background music volume, slightly louder than menu
  sfxVolume = 0.4; // Sound effects volume (quieter)

  constructor(initialVolume = 1) {
    this.volume = this.clampVolume(initialVolume);
    this.muted = localStorage.getItem("epl_muted") === "true";
  }

  /**
   * Plays a sound effect by name.
   * @param {string} name - Sound identifier.
   * @param {number} [durationMs] - Optional maximum play duration in milliseconds.
   */
  playSound(name, durationMs) {
    if (this.muted) return;
    const sources = this.soundSources[name];
    if (!sources?.length) return;
    const src = sources[Math.floor(Math.random() * sources.length)];
    const audio = new Audio(src);
    audio.volume = this.sfxVolume;
    audio.muted = this.muted;
    audio.play().catch(() => {});
    if (durationMs > 0) {
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, durationMs);
    }
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
    audio.volume = name === "game" ? this.gameBgmVolume : this.bgmVolume;
    audio.muted = this.muted;
    audio.play().catch(() => {});
    this.bgmElement = audio;
    this.currentBgmName = name;
  }

  /**
   * Play a looping sound effect when Pepe is running.
   */
  playRunSound() {
    if (this.muted) return;
    if (this.runSoundElement && !this.runSoundElement.paused) return;
    if (!this.runSoundSource) return;

    this.stopRunSound();
    this.runSoundElement = new Audio(this.runSoundSource);
    this.runSoundElement.volume = this.sfxVolume;
    this.runSoundElement.muted = this.muted;
    this.runSoundElement.currentTime = 0;
    this.runSoundElement.play().catch(() => {});

    this.runSoundTimer = setInterval(() => {
      if (!this.runSoundElement) return;
      this.runSoundElement.pause();
      this.runSoundElement.currentTime = 0;
      this.runSoundElement.play().catch(() => {});
    }, this.runSoundSegmentMs);
  }

  /**
   * Stop the running sound.
   */
  stopRunSound() {
    if (this.runSoundTimer) {
      clearInterval(this.runSoundTimer);
      this.runSoundTimer = null;
    }
    if (this.runSoundElement) {
      this.runSoundElement.pause();
      this.runSoundElement.currentTime = 0;
      this.runSoundElement = null;
    }
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
    const clampedVolume = this.clampVolume(volume);
    if (this.volume === 0 && clampedVolume > 0) {
      // First time setting volume from 0, set relative volumes
      this.bgmVolume = clampedVolume * 0.8;
      this.sfxVolume = clampedVolume * 0.6;
    } else if (this.volume > 0) {
      // Adjust existing volumes proportionally
      const ratio = clampedVolume / this.volume;
      this.bgmVolume = Math.min(1, this.bgmVolume * ratio);
      this.sfxVolume = Math.min(1, this.sfxVolume * ratio);
    }
    this.volume = clampedVolume;
    if (this.bgmElement) {
      this.bgmElement.volume = this.bgmVolume;
    }
    if (this.runSoundElement) {
      this.runSoundElement.volume = this.sfxVolume;
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
