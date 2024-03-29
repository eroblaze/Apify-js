// Helper functions
function getEl(selector) {
  return document.querySelector(selector);
}
function empty(el) {
  el.innerHTML = null;
}
function disable(el) {
  el.disabled = true;
}
function remDisable(el) {
  el.disabled = false;
}
function prevent(e) {
  e.preventDefault();
}

const toggleBtn = getEl(".toggle-rect");
const body = document.body;
const mainA = document.querySelectorAll(".links a");
const backBtn = getEl(".back");
const dic = getEl(".dic");
const age = getEl(".age");
const country = getEl(".country");
const ageForm = getEl(".age form");
const dicform = dic.querySelector("form");
const countryForm = country.querySelector("form");
const ageEl = getEl(".age-counter");
const ageIn = getEl("#age-input");
const link = getEl(".links");
const dicIn = getEl("#dic-input");
const conIn = getEl("#country-input");

function adjust(e, res, load, ext = "dic-result-ext") {
  body.classList.add("remove");
  getEl(res).classList.remove(ext);
  empty(getEl(load));
}

dicIn.addEventListener("focus", (e) =>
  adjust(e, ".dic-result", ".loader-container")
);
dicIn.addEventListener("blur", () => {
  body.classList.remove("remove");
});

ageIn.addEventListener("focus", function () {
  body.classList.add("remove");
  getEl(".grid-age").classList.add("img-exp");
});
ageIn.addEventListener("blur", () => {
  body.classList.remove("remove");
  getEl(".grid-age").classList.remove("img-exp");
});

conIn.addEventListener("focus", (e) =>
  adjust(
    e,
    ".country-result",
    ".country-loader-container",
    "country-result-ext"
  )
);
conIn.addEventListener("blur", () => {
  body.classList.remove("remove");
});

// loading animation

setTimeout(() => {
  getEl("#global-loader").style.display = "none";
}, 2000);

dic.classList.add("hide");
age.classList.add("hide");
country.classList.add("hide");

disable(ageIn);
disable(conIn);
disable(dicIn);

function removeGroup() {
  dic.classList.add("hide");
  age.classList.add("hide");
  country.classList.add("hide");

  disable(ageIn);
  disable(conIn);
  disable(dicIn);
}

// For the back btn

backBtn.addEventListener("click", () => {
  mainA.forEach((el) => el.classList.remove("move"));
  removeGroup();
  backBtn.classList.remove("slideBack");
  link.style.transitionDelay = "0s";
  link.style.zIndex = "10";
  // dic section
  getEl(".dic-result").textContent = "";
  getEl("#dic-input").value = "";
  getEl(".dic-result").classList.remove("dic-result-ext");
  empty(getEl(".loader-container"));
  // age section
  ageEl.textContent = "?";
  ageIn.value = "";
  // Country section
  const countryData = document.querySelectorAll(".country-data");
  const country = getEl(".country-result");
  getEl("#country-input").value = "";

  Array.from(countryData).forEach((el) => (el.textContent = ""));

  country.classList.remove("country-result-ext");
  empty(getEl(".country-loader-container"));

  // To remove the disabled attribute from all buttons

  remDisable(getEl("#dic-btn"));
  remDisable(getEl("#age-btn"));
  remDisable(getEl("#age-btn"));
});

toggleBtn.addEventListener("click", toggle);
link.addEventListener("click", (e) => {
  const target = e.target;
  if (target.className === "main-links") animateBtn(e);
});

getEl("#dic-btn").addEventListener("click", getMeaning);

getEl("#age-btn").addEventListener("click", getAge);

getEl("#country-btn").addEventListener("click", getCountry);

dicform.addEventListener("submit", prevent);

ageForm.addEventListener("submit", prevent);

countryForm.addEventListener("submit", prevent);

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
      remDisable(dicIn);
      break;
    case "age":
      age.classList.remove("hide");
      remDisable(ageIn);
      break;
    case "country":
      country.classList.remove("hide");
      remDisable(conIn);
      break;
  }
}

function createLoading(parent) {
  const loaderContainer = getEl(parent);
  const loading = document.createElement("div");
  loading.className = "loading";
  empty(loaderContainer);
  loaderContainer.append(loading);
}

// dic section

function getMeaning(e) {
  class Unknown extends Error {}
  class Invalid extends Error {}
  createLoading(".loader-container");
  disable(e.target);

  const result = getEl(".dic-result");
  result.textContent = "";
  const dicInput = getEl("#dic-input");
  const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

  const createMeaning = (data) => {
    const meaning = data[0].meanings[0].definitions[0].definition;
    const title = document.createElement("div");
    title.className = "dic-title";
    title.textContent = dicInput.value;
    const loaderContainer = getEl(".loader-container");
    empty(loaderContainer);
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
    const loaderContainer = getEl(".loader-container");
    empty(loaderContainer);
    loaderContainer.append(title);
  };

  (async function meaning(e) {
    e.preventDefault();
    try {
      const word = dicInput.value.trim();
      const regex = /^[^\d.\\/]+$/;
      if (regex.test(word)) {
        const response = await fetch(`${url}${word}`);
        getEl(".loading").remove();

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
    } finally {
      remDisable(e.target);
    }
  })(e); // IIFE (Immediately Invoked Function Expression)
}

// For the Age section

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
const extractAge = async (data) => {
  const age = data.age;
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
  disable(e.target);
  const name = ageIn.value.trim();
  const url = "https://api.agify.io/?name=";

  try {
    if (name) {
      const response = await fetch(`${url}${name}`);
      const data = await response.json();
      extractAge(data);
    }
  } catch (error) {
  } finally {
    remDisable(e.target);
  }
}

// For the Country section

const inputCountryData = (data) => {
  const result = getEl(".country-result");
  result.classList.remove("country-error");
  result.classList.add("country-result-ext");

  getEl(".country-name").textContent = data.fullName;
  getEl(".country-capital").textContent = data.capital;
  getEl(".country-region").textContent = data.region;
  getEl(".country-lang").textContent = data.languages.join(", ");
  getEl(".country-lat").textContent = data.lat;
  getEl(".country-long").textContent = data.lng;
  getEl(".country-pop").textContent = data.population;

  getEl(".country-error-html").style.display = "none";
};

const extractCountryData = (data, word) => {
  const { official: fullName } = data[0].name || "Not found";
  const capital = data[0].capital[0] || "Not found";
  const { region } = data[0] || "Not found";
  const languages = Object.values(data[0].languages) || "Not found"; // an Array
  const [lat, lng] = data[0].latlng || "Not found";
  const { population } = data[0] || "Not found";

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
  const loaderContainer = getEl(".country-loader-container");
  empty(loaderContainer);
  loaderContainer.append(heading);
  loaderContainer.append(img);
};

function noCountry(err) {
  const result = getEl(".country-result");
  result.classList.add("country-result-ext");
  result.classList.add("country-error");
  getEl(".country-error-html").style.display = "block";
  getEl(".country-error-html").textContent = err;
  getEl("#country-input").value = "";
  const title = document.createElement("div");
  title.className = "dic-error";
  title.textContent = "Error";
  const loaderContainer = getEl(".country-loader-container");
  empty(loaderContainer);
  loaderContainer.append(title);
}

async function getCountry(e) {
  e.preventDefault();
  disable(e.target);
  createLoading(".country-loader-container");
  try {
    const word = getEl("#country-input").value.trim();
    const url = "https://restcountries.com/v3.1/name/";
    const regex = /^[^\d\?\\/.]+$/;
    if (regex.test(word)) {
      let response = "";
      // To avoid name collision
      if (word.toLowerCase() === "niger" || word.toLowerCase() === "china") {
        response = await fetch(`${url}${word}?fullText=true`);
      } else response = await fetch(`${url}${word}`);

      if (response.ok) {
        const data = await response.json();
        extractCountryData(data, word);
      } else {
        throw new Error("Couldn't get country's data!");
      }
    } else {
      throw new Error("Invalid input!");
    }
  } catch (error) {
    if (
      error.message === "Invalid input!" ||
      error.message === "Couldn't get country's data!"
    )
      noCountry(error.message);
    else noCountry("Something went wrong!");
  } finally {
    remDisable(e.target);
  }
}
