const input1 = document.getElementById("input1");
const input2 = document.getElementById("input2");
const currencyGroup1 = document.getElementById("currencyGroup1");
const currencyGroup2 = document.getElementById("currencyGroup2");
const alertBox = document.querySelector(".alert");
const p_input = document.querySelector(".p_input");
const p_output = document.querySelector(".p_output");
let currency1 = "RUB";
let currency2 = "USD";
const apiKey = "336818d1460e9225f4cf7aba2372064a";
const apiUrl = `http://data.fixer.io/api/latest?access_key=${apiKey}`;
currencyGroup1.addEventListener("click", async (e) => {
  if (e.target.tagName === "BUTTON") {
    currency1 = e.target.getAttribute("data-currency");
    updateActiveButton(currencyGroup1, e.target);
    localStorage.setItem("currency1", currency1);
    await fetchExchangeRate();
    convertInputs(); 
  }
});
currencyGroup2.addEventListener("click", async (e) => {
  if (e.target.tagName === "BUTTON") {
    currency2 = e.target.getAttribute("data-currency");
    updateActiveButton(currencyGroup2, e.target);
    localStorage.setItem("currency2", currency2);
    await fetchExchangeRate();
    convertInputs(); 
  }
});
function updateActiveButton(group, activeButton) {
  Array.from(group.children).forEach((button) => {
    button.classList.remove("active");
  });
  activeButton.classList.add("active");
}
async function getExchangeRate(fromCurrency, toCurrency) {
  try {
    const response = await fetch(`${apiUrl}${fromCurrency}`);
    const data = await response.json();
    return data.conversion_rates[toCurrency];
  } catch (error) {
    console.error("Ошибка в запросе API:", error);
    alertBox.textContent = "Не удалось загрузить информацию о тарифах. Пожалуйста, попробуйте еще раз.";
    return null;
  }
}
async function fetchExchangeRate() {
  try {
    const rate = await getExchangeRate(currency1, currency2);
    const reverseRate = await getExchangeRate(currency2, currency1);

    if (rate && reverseRate) {
      p_input.textContent = `1 ${currency1} = ${rate.toFixed(5)} ${currency2}`;
      p_output.textContent = `1 ${currency2} = ${reverseRate.toFixed(5)} ${currency1}`;
      alertBox.textContent = "";
    } else {
      throw new Error("Exchange rate unavailable");
    }
  } catch (error) {
    alertBox.textContent = "Проблема с сетью. Пожалуйста, проверьте подключение к Интернету.";
    console.error("Ошибка оценки:", error);
  }
}
async function convertInputs() {
  const rate = await getExchangeRate(currency1, currency2);
  const reverseRate = await getExchangeRate(currency2, currency1);

  if (rate && reverseRate) {
    if (input1.value) {
      const amountFrom = parseFloat(input1.value) || 0;
      input2.value = (amountFrom * rate).toFixed(5);
    } else if (input2.value) {
      const amountTo = parseFloat(input2.value) || 0;
      input1.value = (amountTo * reverseRate).toFixed(5);
    }
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  input1.value = localStorage.getItem("input1") || "";
  input2.value = localStorage.getItem("input2") || "";
  currency1 = localStorage.getItem("currency1") || "RUB";
  currency2 = localStorage.getItem("currency2") || "USD";
  setActiveCurrency(currencyGroup1, currency1);
  setActiveCurrency(currencyGroup2, currency2);
  await fetchExchangeRate();
  convertInputs(); 
});
function setActiveCurrency(group, currency) {
  Array.from(group.children).forEach((button) => {
    if (button.getAttribute("data-currency") === currency) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}
input1.addEventListener("input", async () => {
  const rate = await getExchangeRate(currency1, currency2);
  if (input1.value) {
    const amountFrom = parseFloat(input1.value) || 0;
    input2.value = (amountFrom * rate).toFixed(5);
  } else {
    input2.value = "";
  }
});
input2.addEventListener("input", async () => {
  const reverseRate = await getExchangeRate(currency2, currency1);
  if (input2.value) {
    const amountTo = parseFloat(input2.value) || 0;
    input1.value = (amountTo * reverseRate).toFixed(5);
  } else {
    input1.value = "";
  }
});
input1.addEventListener("input", () => {
  input1.value = input1.value.replace(/[^0-9.]/g, "").replace(/\.+/, ".");
  if (input1.value.length > 24) {
    input1.value = input1.value.slice(0, 24);
  }
  fetchExchangeRate();
});
input2.addEventListener("input", () => {
  input2.value = input2.value.replace(/[^0-9.]/g, "").replace(/\.+/, ".");
  if (input2.value.length > 24) {
    input2.value = input1.value.slice(0, 24);
  }
  fetchExchangeRate();
});
function toggleMenu() {
  const menu = document.getElementById("navbarMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}
document.addEventListener("DOMContentLoaded", fetchExchangeRate);
