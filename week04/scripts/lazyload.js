(function() {
    const lm = document.getElementById("lastModified");
    if (lm) {
        lm.textContent = `Last Modified: ${document.lastModified}`;
    }
    console.log("Last modified script loaded.");
})();