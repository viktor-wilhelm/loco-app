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
  // Base volume ratios (applied as multipliers of master volume)
  baseBgmVolume = 0.6; // Menu background music base
  baseGameBgmVolume = 0.8; // Game background music base
  baseSfxVolume = 0.4; // Sound effects base
  bgmVolume = 0.6;
  gameBgmVolume = 0.8;
  sfxVolume = 0.4;
  bgmStartOffsets = {
    game: 1.95,
  };

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
    const audio = this.createBgmAudio(name, src);
    audio.play().catch(() => {});
    this.bgmElement = audio;
    this.currentBgmName = name;
  }

  /**
   * Create and configure a background music audio element.
   * @param {string} name - Background music identifier.
   * @param {string} src - Audio source path.
   * @returns {HTMLAudioElement}
   */
  createBgmAudio(name, src) {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = name === "game" ? this.gameBgmVolume : this.bgmVolume;
    audio.muted = this.muted;
    this.applyBgmStartOffset(audio, name);
    return audio;
  }

  /**
   * Apply a configured start offset for a background music track.
   * @param {HTMLAudioElement} audio - Audio element.
   * @param {string} name - Background music identifier.
   */
  applyBgmStartOffset(audio, name) {
    const offset = this.bgmStartOffsets[name] || 0;
    if (offset <= 0) return;
    audio.addEventListener("loadedmetadata", () => {
      if (audio.currentTime < offset) audio.currentTime = offset;
    });
  }

  /**
   * Play a looping sound effect when Pepe is running.
   */
  playRunSound() {
    if (this.muted) return;
    if (this.runSoundElement && !this.runSoundElement.paused) return;
    if (!this.runSoundSource) return;
    this.stopRunSound();
    this.runSoundElement = this.createRunAudio();
    this.runSoundElement.play().catch(() => {});
    this.startRunSoundLoop();
  }

  /**
   * Create and configure a running sound audio element.
   * @returns {HTMLAudioElement}
   */
  createRunAudio() {
    const audio = new Audio(this.runSoundSource);
    audio.volume = this.sfxVolume;
    audio.muted = this.muted;
    audio.currentTime = 0;
    return audio;
  }

  /**
   * Start the looping interval for the running sound.
   */
  startRunSoundLoop() {
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
    this.updateVolumeRatios(clampedVolume);
    this.volume = clampedVolume;
    this.applyVolumeToElements();
  }

  /**
   * Calculate and update BGM and SFX volume ratios based on new master volume.
   * @param {number} clampedVolume - The new master volume (0-1).
   */
  updateVolumeRatios(clampedVolume) {
    this.bgmVolume = clampedVolume * this.baseBgmVolume;
    this.gameBgmVolume = clampedVolume * this.baseGameBgmVolume;
    this.sfxVolume = clampedVolume * this.baseSfxVolume;
  }

  /**
   * Apply current volume settings to active audio elements.
   */
  applyVolumeToElements() {
    if (this.bgmElement) this.bgmElement.volume = this.bgmVolume;
    if (this.runSoundElement) this.runSoundElement.volume = this.sfxVolume;
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
