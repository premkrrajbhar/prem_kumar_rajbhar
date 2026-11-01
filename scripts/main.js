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