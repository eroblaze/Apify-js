const toggleBtn = document.querySelector(".toggle-rect");
const body = document.body;
toggleBtn.addEventListener("click", toggle);

function toggle() {
  toggleBtn.classList.toggle("toggle-active");
  body.classList.toggle("body-active");
}
