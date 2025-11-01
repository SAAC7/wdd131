// scripts/getdates.js
// Fill the copyright year and last modified text.
// This file is referenced with `defer` in the head so the DOM elements exist.

(function () {
  try {
    const yearSpan = document.getElementById('currentyear');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }

    const lm = document.getElementById('lastModified');
    if (lm) {
      // document.lastModified returns a string (as required by the assignment)
      lm.textContent = 'Last modified: ' + document.lastModified;
    }
  } catch (err) {
    // Avoid console errors interfering when testing — but report if needed
    console.error('getdates.js error:', err);
  }
})();
