const toggleBtn = document.querySelector(".toggle-rect");
const body = document.body;
const mainA = document.querySelectorAll(".links a");
const backBtn = document.querySelector(".back");

backBtn.addEventListener("click", () => {
  mainA.forEach((el) => el.classList.remove("move"));
});
toggleBtn.addEventListener("click", toggle);
mainA.forEach((el) => el.addEventListener("click", animateBtn));

function toggle() {
  toggleBtn.classList.toggle("toggle-active");
  body.classList.toggle("body-active");
}
function animateBtn(e) {
  e.preventDefault();
  const delayArr = [".2s", ".3s", ".4s", ".5s", ".6s"];
  let i = 0;
  const target = e.target;
  target.style.transitionDelay = "0s";
  mainA.forEach((el) => {
    if (el != target) el.style.transitionDelay = delayArr[i];
    el.classList.add("move");
    i++;
  });
}
console.log(mainA);
