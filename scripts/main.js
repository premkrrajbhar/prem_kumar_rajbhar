const splash = document.getElementById("helloSplash");
const words = document.querySelectorAll(".hello-word");

const offcanvas = document.getElementById("offcanvasExample");
const toggleBtn = document.querySelector(".menu-toggle");

const splashShown = sessionStorage.getItem("helloSplashShown");

function initializeAOS() {
    AOS.init({
        once: true,
        duration: 1400
    });

    AOS.refreshHard();
}

if (splash && !splashShown && words.length > 0) {

    sessionStorage.setItem("helloSplashShown", "true");

    let current = 0;

    const interval = setInterval(() => {

        words[current].classList.remove("active");

        current++;

        if (current < words.length) {
            words[current].classList.add("active");
        } else {
            clearInterval(interval);

            splash.classList.add("hide");

            setTimeout(() => {
                splash.remove();

                initializeAOS();

            }, 800);
        }

    }, 350);

} else {

    if (splash) {
        splash.remove();
    }

    initializeAOS();
}


if (offcanvas && toggleBtn) {

    offcanvas.addEventListener("show.bs.offcanvas", () => {
        toggleBtn.classList.add("active");
    });

    offcanvas.addEventListener("hide.bs.offcanvas", () => {
        toggleBtn.classList.remove("active");
    });

}

(function initCodeCopy() {
  "use strict";

  if (!navigator.clipboard) return; 

  function addCopyButton(block) {
    if (block.querySelector(".codeCopy")) return; // avoid duplicates

    var code = block.querySelector("code");
    var codeHeader = block.querySelector(".codeHeader");
    if (!code || !codeHeader) return;

    var button = document.createElement("button");
    button.type = "button";
    button.className = "codeCopy";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy code to clipboard");
    button.setAttribute("aria-live", "polite");

    var resetTimer = null;

    function reset() {
      button.textContent = "Copy";
      button.setAttribute("aria-label", "Copy code to clipboard");
    }

    function flash(label) {
      button.textContent = label;
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(reset, 1600);
    }

    button.addEventListener("click", function () {
      var text = code.textContent.replace(/^\n/, "");
      navigator.clipboard.writeText(text).then(
        function () { flash("Copied"); },
        function () { flash("Failed"); }
      );
    });

    codeHeader.appendChild(button);
  }

  function run() {
    document.querySelectorAll(".codeBlock").forEach(addCopyButton);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();