/**
 * Loads an HTML template into the overlay container and shows it.
 * @param {string} filePath - Path to the HTML template file.
 * @returns {Promise<void>}
 */
async function loadOverlay(filePath) {
  const container = document.getElementById("overlay-container");

  try {
    const response = await fetch(filePath);

    if (!response.ok) throw new Error("Template could not be loaded.");

    container.innerHTML = await response.text();
    container.removeAttribute("hidden");
  } catch (error) {
    container.innerHTML = `
      <div class="overlay" aria-modal="true" role="dialog" aria-label="Error">
        <div class="overlay__backdrop" onclick="hideOverlay()"></div>
        <div class="overlay__panel">
          <button class="overlay__close" onclick="hideOverlay()" aria-label="Close">&times;</button>
          <h2 class="overlay__title">Error</h2>
          <div class="overlay__body">
            <section class="overlay__section">
              <p>The template could not be loaded. Please open the project via a local server.</p>
            </section>
          </div>
        </div>
      </div>
    `;
    container.removeAttribute("hidden");
  }
}

/**
 * Hides the overlay container and clears its content.
 * @returns {void}
 */
function hideOverlay() {
  const container = document.getElementById("overlay-container");
  container.setAttribute("hidden", "");
  container.innerHTML = "";
}
