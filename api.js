const toggleBtn = document.querySelector(".toggle-rect");
const body = document.body;
const mainA = document.querySelectorAll(".links a");
const firstA = mainA[0];
const secondA = mainA[1];
const thirdA = mainA[2];
const fourthA = mainA[3];
const backBtn = document.querySelector(".back");
const dic = document.querySelector(".dic");
const age = document.querySelector(".age");
const country = document.querySelector(".country");
const ageForm = document.querySelector(".age form");
const dicform = dic.querySelector("form");
const countryForm = country.querySelector("form");
const ageEl = document.querySelector(".age-counter");
const ageIn = document.querySelector("#age-input");
const link = document.querySelector(".links");

dic.classList.add("hide");
age.classList.add("hide");
country.classList.add("hide");

function removeGroup() {
  dic.classList.add("hide");
  age.classList.add("hide");
  country.classList.add("hide");
}

backBtn.addEventListener("click", () => {
  mainA.forEach((el) => el.classList.remove("move"));
  removeGroup();
  backBtn.classList.remove("slideBack");
  link.style.transitionDelay = "0s";
  link.style.zIndex = "10";
  // dic section
  const dic = document.querySelector(".dic-result");
  const dicInput = document.querySelector("#dic-input");
  dicInput.value = "";
  dic.textContent = "";
  dic.classList.remove("dic-result-ext");
  const loaderContainer = document.querySelector(".loader-container");
  loaderContainer.replaceChildren();
  // age section
  ageEl.textContent = "?";
  ageIn.value = "";
  // Country section
  const countryData = document.querySelectorAll(".country-data");
  const country = document.querySelector(".country-result");
  const countryInput = document.querySelector("#country-input");
  countryInput.value = "";

  Array.from(countryData).forEach((el) => (el.textContent = ""));

  country.classList.remove("country-result-ext");
  const countryLoader = document.querySelector(".country-loader-container");
  countryLoader.replaceChildren();
});
toggleBtn.addEventListener("click", toggle);
// mainA.forEach((el) => el.addEventListener("click", animateBtn));
firstA.addEventListener("click", animateBtn);
secondA.addEventListener("click", animateBtn);
thirdA.addEventListener("click", animateBtn);
fourthA.addEventListener("click", animateBtn);

dicform.addEventListener("submit", getMeaning);

ageForm.addEventListener("submit", getAge);

countryForm.addEventListener("submit", getCountry);

function toggle() {
  toggleBtn.classList.toggle("toggle-active");
  body.classList.toggle("body-active");
}
function animateBtn(e) {
  const target = e.target;
  link.style.transitionDelay = ".4s";
  link.style.zIndex = "-10";
  if (!(target.dataset.link === "github")) {
    e.preventDefault();
    const delayArr = [".2s", ".3s", ".4s"];
    let i = 0;
    checkGroup(target);
    backBtn.classList.add("slideBack");

    target.style.transitionDelay = "0s";
    mainA.forEach((el) => {
      if (el != target) {
        el.style.transitionDelay = delayArr[i];
        i++;
      }
      el.classList.add("move");
    });
  }
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
    case "country":
      country.classList.remove("hide");
      break;
  }
}

function createLoading(parent) {
  const loaderContainer = document.querySelector(parent);
  const loading = document.createElement("div");
  loading.className = "loading";
  loaderContainer.replaceChildren();
  loaderContainer.append(loading);
}

// dic section

function getMeaning(e) {
  class Unknown extends Error {}
  class Invalid extends Error {}
  createLoading(".loader-container");

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

    // For the sliding up effect
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

// For the Country section

function getEl(selector) {
  return document.querySelector(selector);
}

function createEl(elName, ...elClass) {
  const newEl = document.createElement("elName");
  elClass.forEach((cls) => newEl.classList.add(cls));
  return newEl;
}

const inputCountryData = (data) => {
  const result = getEl(".country-result");
  result.classList.add("country-result-ext");
  result.classList.remove("country-error");
  const fullName = getEl(".country-name");
  const capital = getEl(".country-capital");
  const region = getEl(".country-region");
  const lang = getEl(".country-lang");
  const lat = getEl(".country-lat");
  const lng = getEl(".country-long");
  const population = getEl(".country-pop");

  fullName.textContent = data.fullName;
  capital.textContent = data.capital;
  region.textContent = data.region;
  lang.textContent = data.languages;
  lng.textContent = data.lng;
  population.textContent = data.population;
  lat.textContent = data.lat;
  getEl(".country-error-html").style.display = "none";
};

const extractCountryData = (data, word) => {
  const { official: fullName } = data[0].name || "Not found";
  console.log(fullName);
  const capital = data[0].capital[0] || "Not found";
  console.log(capital);
  const { region } = data[0] || "Not found";
  console.log(region);
  const languages = Object.values(data[0].languages) || "Not found"; // an Array
  languages.forEach((el) => console.log(el));
  const [lat, lng] = data[0].latlng || "Not found";
  console.log(lat, lng);
  const { population } = data[0] || "Not found";
  console.log(population);

  const obj = {
    fullName,
    capital,
    region,
    languages,
    lat,
    lng,
    population,
  };
  inputCountryData(obj);
  getEl("#country-input").value = "";
  const heading = document.createElement("h3");
  heading.textContent = word;
  const img = document.createElement("img");
  img.src = data[0].flags.png;
  const loaderContainer = document.querySelector(".country-loader-container");
  loaderContainer.replaceChildren();
  loaderContainer.append(heading);
  loaderContainer.append(img);
};

function noCountry(err) {
  console.log(err);

  const result = document.querySelector(".country-result");
  result.classList.add("country-result-ext");
  result.classList.add("country-error");
  getEl(".country-error-html").style.display = "block";
  getEl(".country-error-html").textContent = err;
  getEl("#country-input").value = "";
  const title = document.createElement("div");
  title.className = "dic-error";
  title.textContent = "Error";
  const loaderContainer = getEl(".country-loader-container");
  loaderContainer.replaceChildren();
  loaderContainer.append(title);
}

async function getCountry(e) {
  e.preventDefault();
  createLoading(".country-loader-container");
  try {
    const word = document.querySelector("#country-input").value.trim();
    const url = "https://restcountries.com/v3.1/name/";
    const regex = /^[^\d\?\\]+$/;
    if (regex.test(word)) {
      let response = "";
      // To avoid name collision
      if (word.toLowerCase() === "niger" || word.toLowerCase() === "china") {
        response = await fetch(`${url}${word}?fullText=true`);
      } else response = await fetch(`${url}${word}`);

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        extractCountryData(data, word);
      } else {
        throw new Error("Couldn't get country's data");
      }
    } else {
      console.log("invalid input");
      throw new Error("Invalid input!");
    }
  } catch (error) {
    if (
      error.message === "Invalid input!" ||
      error.message === "Couldn't get country's data"
    )
      noCountry(error.message);
    // else noCountry("Something went wrong!");
    else noCountry(error);
  }
}
