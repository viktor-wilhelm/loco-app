/**
 * Central interval/timeout registry for El Pollo Loco.
 * Replaces native setInterval/setTimeout so every ID is tracked
 * and can be cleared all at once on game reset.
 *
 * Usage:
 *   setStoppableInterval(fn, ms)  – drop-in replacement for setInterval
 *   setStoppableTimeout(fn, ms)   – drop-in replacement for setTimeout
 *   clearAllIntervals()           – clears every registered interval + timeout
 */

/** @type {number[]} */
let intervalIds = [];

/** @type {number[]} */
let timeoutIds = [];

/**
 * Creates a setInterval and registers its ID.
 * @param {Function} fn - Callback to execute.
 * @param {number} time - Interval delay in milliseconds.
 * @returns {number} The interval ID.
 */
function setStoppableInterval(fn, time) {
  const id = setInterval(fn, time);
  intervalIds.push(id);
  return id;
}

/**
 * Creates a setTimeout and registers its ID.
 * @param {Function} fn - Callback to execute.
 * @param {number} time - Delay in milliseconds.
 * @returns {number} The timeout ID.
 */
function setStoppableTimeout(fn, time) {
  const id = setTimeout(() => {
    timeoutIds = timeoutIds.filter((t) => t !== id);
    fn();
  }, time);
  timeoutIds.push(id);
  return id;
}

/**
 * Clears all registered intervals (but NOT timeouts), then resets the interval registry.
 * Use this when active timeouts (e.g. overlay sequences) must continue.
 */
function clearIntervalIdsOnly() {
  intervalIds.forEach((id) => clearInterval(id));
  intervalIds = [];
}

/**
 * Clears all registered intervals and timeouts, then resets both registries.
 */
function clearAllIntervals() {
  intervalIds.forEach((id) => clearInterval(id));
  timeoutIds.forEach((id) => clearTimeout(id));
  intervalIds = [];
  timeoutIds = [];
}
