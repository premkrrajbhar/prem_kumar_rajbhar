AOS.init({
  once: true,
});

const offcanvas = document.getElementById("offcanvasExample");
const toggleBtn = document.querySelector(".menu-toggle");

offcanvas.addEventListener("show.bs.offcanvas", () => {
  toggleBtn.classList.add("active");
});

offcanvas.addEventListener("hide.bs.offcanvas", () => {
  toggleBtn.classList.remove("active");
});
