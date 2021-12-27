const toggleBtn = document.querySelector(".toggle-rect");
const body = document.body;
const mainA = document.querySelectorAll(".links a");
const backBtn = document.querySelector(".back");
const dic = document.querySelector(".dic");
const age = document.querySelector(".age");
const ageForm = document.querySelector(".age form");
const dicform = dic.querySelector("form");
const ageEl = document.querySelector(".age-counter");
const ageIn = document.querySelector("#age-input");

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
  // dic section
  const dic = document.querySelector(".dic-result");
  dic.textContent = "";
  dic.classList.remove("dic-result-ext");
  const loaderContainer = document.querySelector(".loader-container");
  loaderContainer.replaceChildren();
  // age section
  ageEl.textContent = "?";
  ageIn.value = "";
});
toggleBtn.addEventListener("click", toggle);
mainA.forEach((el) => el.addEventListener("click", animateBtn));

dicform.addEventListener("submit", getMeaning);

ageForm.addEventListener("submit", getAge);

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
  loaderContainer.replaceChildren();
  loaderContainer.append(loading);
}

function getMeaning(e) {
  class Unknown extends Error {}
  class Invalid extends Error {}
  createLoading();

  const result = document.querySelector(".dic-result");
  result.textContent = "";
  const dicInput = document.querySelector("#dic-input");
  const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

  const createMeaning = (data) => {
    const meaning = data[0].meanings[0].definitions[0].definition;
    const title = document.createElement("div");
    title.className = "dic-title";
    title.textContent = dicInput.value;
    const loaderContainer = document.querySelector(".loader-container");
    loaderContainer.replaceChildren();
    loaderContainer.append(title);

    result.textContent = meaning;
    result.classList.add("dic-result-ext");
    dicInput.value = "";
  };
  const noWord = (error) => {
    result.textContent = error.message || error;
    result.classList.add("dic-result-ext");
    dicInput.value = "";
    const title = document.createElement("div");
    title.className = "dic-error";
    title.textContent = "Error";
    const loaderContainer = document.querySelector(".loader-container");
    loaderContainer.replaceChildren();
    loaderContainer.append(title);
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
      else noWord("Something went wrong!");
    }
  })(e);
}

// For the Age section
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
const extractAge = async (data) => {
  const age = data.age;
  console.log(age);
  if (age) {
    count = 0;
    while (count <= Number(age)) {
      ageEl.textContent = count;
      count++;
      await sleep(100);
    }
  } else {
    ageEl.textContent = "?";
  }
};
async function getAge(e) {
  e.preventDefault();
  const name = ageIn.value.trim();
  const url = "https://api.agify.io/?name=";

  if (name) {
    const response = await fetch(`${url}${name}`);
    const data = await response.json();
    extractAge(data);
  }
}
