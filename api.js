const toggleBtn = document.querySelector(".toggle-rect");
const body = document.body;
const mainA = document.querySelectorAll(".links a");
const backBtn = document.querySelector(".back");
const dic = document.querySelector(".dic");
const age = document.querySelector(".age");
const dicform = dic.querySelector("form");
dic.classList.add("hide");
age.classList.add("hide");

function removeGroup() {
  dic.classList.add("hide");
  age.classList.add("hide");
}

backBtn.addEventListener("click", () => {
  mainA.forEach((el) => el.classList.remove("move"));
  removeGroup();
  backBtn.classList.remove("slideBack");
});
toggleBtn.addEventListener("click", toggle);
mainA.forEach((el) => el.addEventListener("click", animateBtn));

dicform.addEventListener("submit", getMeaning);

function toggle() {
  toggleBtn.classList.toggle("toggle-active");
  body.classList.toggle("body-active");
}
function animateBtn(e) {
  e.preventDefault();
  const delayArr = [".2s", ".3s", ".4s", ".5s", ".6s"];
  let i = 0;
  const target = e.target;
  checkGroup(target);
  backBtn.classList.add("slideBack");

  target.style.transitionDelay = "0s";
  mainA.forEach((el) => {
    if (el != target) el.style.transitionDelay = delayArr[i];
    el.classList.add("move");
    i++;
  });
}

function checkGroup(group) {
  const groupData = group.dataset.group;
  switch (groupData) {
    case "dic":
      dic.classList.remove("hide");
      break;
    case "age":
      age.classList.remove("hide");
      break;
  }
}

function createLoading() {
  const loaderContainer = document.querySelector(".loader-container");
  const loading = document.createElement("div");
  loading.className = "loading";
  loaderContainer.append(loading);
}

function getMeaning(e) {
  class Unknown extends Error {}
  class Invalid extends Error {}
  createLoading();

  const dicInput = document.querySelector("#dic-input");
  const result = document.querySelector(".dic-result");
  const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

  const createMeaning = (data) => {
    const meaning = data[0].meanings[0].definitions[0].definition;
    console.log(meaning);
    result.textContent = meaning;
    result.classList.add("dic-result-ext");
  };
  const noWord = (error) => {
    result.textContent = error.message;
    document.querySelector(".loading").remove();
  };

  (async function meaning(e) {
    e.preventDefault();
    try {
      const word = dicInput.value.trim();
      const regex = /^[^\d]+$/;
      if (regex.test(word)) {
        const response = await fetch(`${url}${word}`);
        document.querySelector(".loading").remove();

        if (response.ok) {
          const data = await response.json();
          createMeaning(data);
        } else throw new Unknown("Word not found!");
      } else {
        throw new Invalid("Invalid input!");
      }
    } catch (e) {
      if (e instanceof Invalid || e instanceof Unknown) noWord(e);
      console.log(e.message);
    }
  })(e);
}
