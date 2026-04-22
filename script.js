import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDMhniu1SEmiIWoXzwJy6zVSOZkHELhfLc",
  authDomain: "family-sales.firebaseapp.com",
  databaseURL: "https://family-sales-default-rtdb.firebaseio.com",
  projectId: "family-sales",
  storageBucket: "family-sales.firebasestorage.app",
  messagingSenderId: "590845027956",
  appId: "1:590845027956:web:676df074fe6150e8d39321"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const JESSICA_BUILT = [
  { name: "Classic #1", price: 10, sub: "20 minis" },
  { name: "Classic #2", price: 12, sub: "25 minis" },
  { name: "Churro Overload", price: 15, sub: "30 minis" },
  { name: "Oreo Banana Dulce", price: 10, sub: "20 minis style pricing" },
  { name: "Dubai Chocolate", price: 12, sub: "25 minis style pricing" },
  { name: "Oreo Overload", price: 15, sub: "30 minis style pricing" },
  { name: "Tres Leches", price: 15, sub: "30 minis style pricing" },
  { name: "S'mores", price: 15, sub: "30 minis style pricing" }
];

const JESSICA_YOUR_WAY_SIZES = [
  { name: "20 Minis", price: 8 },
  { name: "25 Minis", price: 10 },
  { name: "30 Minis", price: 12 }
];

const CLASSIC_FLAVORS = [
  "Blackberry",
  "Blue Raspberry",
  "Cherry",
  "Coconut",
  "Dragon Fruit",
  "Green Apple",
  "Lychee",
  "Mango",
  "Passionfruit",
  "Peach",
  "Pineapple",
  "Pomegranate",
  "Raspberry",
  "Strawberry",
  "Vanilla",
  "Watermelon"
];

const SPECIALTY_DRINKS = [
  "Bahama Mama",
  "Cali Sunset",
  "Cherry Limeade",
  "Cherry Bomb",
  "Fun Dip",
  "Green Apple",
  "Lychee Berry Twist",
  "Mangonada",
  "Melon Berry",
  "Marry Me",
  "Mr. Dill",
  "Peachy Princess",
  "Pink Paradise",
  "Shark Attack",
  "Strawberry Bliss",
  "Triple Berry Blast",
  "Watermelon Lychee Splash"
];

const CREAMY_DRINKS = [
  "Blue Cream Dream",
  "Brazilian Limeade",
  "Cherries & Creme",
  "Mango Dragon Splash",
  "Peaches N Cream",
  "Piña Colada",
  "Pink Dragon",
  "Strawberries N Cream"
];

const SUGAR_FREE_DRINKS = [
  "Island Splash",
  "Peachy Princess",
  "Sweet Peach Bliss",
  "Sunset Splash",
  "Tigers Blood",
  "Watermelon Sugar"
];

const REDBULL_CHOICES = [
  ...CLASSIC_FLAVORS.map(name => ({ name, category: "Classic Flavor" })),
  ...SPECIALTY_DRINKS.map(name => ({ name, category: "Specialty" })),
  ...CREAMY_DRINKS.map(name => ({ name, category: "Creamy" })),
  ...SUGAR_FREE_DRINKS.map(name => ({ name, category: "Sugar Free" }))
];

const jessicaMenuButtons = [
  { id: "built", name: "Built Pancakes", emoji: "🥞" },
  { id: "your_way", name: "Stack It Your Way", emoji: "💗" },
  { id: "bite_stack", name: "Bite Stack", emoji: "🧁" },
  { id: "dubai_strawberries", name: "Dubai Strawberries", emoji: "🍓" }
];

const janieMenuButtons = [
  { id: "classic", name: "Classic Lemonade", emoji: "🍋" },
  { id: "specialty", name: "Specialty Lemonade", emoji: "⭐" },
  { id: "creamy", name: "Creamy Lemonade", emoji: "🍦" },
  { id: "sugarfree", name: "Sugar Free Lemonade", emoji: "🩷" },
  { id: "redbull", name: "Red Bull Drinks", emoji: "⚡" },
  { id: "64classic", name: "64 oz Classic", emoji: "🧃" },
  { id: "64specialty", name: "64 oz Specialty", emoji: "🥤" }
];

const state = {
  date: "",
  jessicaTotal: 0,
  janieTotal: 0,
  cashTotal: 0,
  digitalTotal: 0,
  tips: 0
};

const popupState = {
  owner: "",
  payment: "cash",
  selectedLabel: "",
  selectedAmount: 0,
  onChoose: null
};

let historyBound = false;

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function todayLocalValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().split("T")[0];
}

function formatDateForDisplay(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${month}/${day}/${year}`;
}

function setDefaultDate() {
  const datePicker = document.getElementById("datePicker");
  if (!datePicker.value) {
    datePicker.value = todayLocalValue();
  }
  state.date = datePicker.value;
}

function renderMenus() {
  const jessicaMenuList = document.getElementById("jessicaMenuList");
  const janieMenuList = document.getElementById("janieMenuList");

  jessicaMenuList.innerHTML = "";
  janieMenuList.innerHTML = "";

  jessicaMenuButtons.forEach(item => {
    jessicaMenuList.appendChild(buildMenuRow(item, "jessica"));
  });

  janieMenuButtons.forEach(item => {
    janieMenuList.appendChild(buildMenuRow(item, "janie"));
  });
}

function buildMenuRow(item, owner) {
  const row = document.createElement("div");
  row.className = "menu-row";

  row.innerHTML = `
    <div class="menu-left">
      <div class="menu-icon">${item.emoji}</div>
      <div class="menu-name">${item.name}</div>
    </div>
    <button class="menu-open-btn" type="button">Open</button>
  `;

  row.querySelector(".menu-open-btn").addEventListener("click", () => {
    handleMenuOpen(owner, item.id);
  });

  return row;
}

function handleMenuOpen(owner, id) {
  if (owner === "jessica") {
    if (id === "built") openJessicaBuilt();
    if (id === "your_way") openJessicaYourWay();
    if (id === "bite_stack") openSimpleSale("jessica", "Bite Stack", 5);
    if (id === "dubai_strawberries") openSimpleSale("jessica", "Dubai Strawberries", 12);
    return;
  }

  if (id === "classic") openClassicLemonade();
  if (id === "specialty") openJanieList("janie", "Specialty Lemonade", SPECIALTY_DRINKS, 8);
  if (id === "creamy") openJanieList("janie", "Creamy Lemonade", CREAMY_DRINKS, 8);
  if (id === "sugarfree") openJanieList("janie", "Sugar Free Lemonade", SUGAR_FREE_DRINKS, 8);
  if (id === "redbull") openRedBull();
  if (id === "64classic") open64Classic();
  if (id === "64specialty") open64Specialty();
}

function openPopup(title, stepTitle = "") {
  document.getElementById("popupTitle").textContent = title;
  document.getElementById("popupStepTitle").textContent = stepTitle;
  document.getElementById("popupOptions").innerHTML = "";
  document.getElementById("popupOverlay").classList.remove("hidden");

  popupState.payment = "cash";
  setPopupPayment("cash");
  popupState.selectedLabel = "";
  popupState.selectedAmount = 0;
  popupState.onChoose = null;

  updatePopupSummary();
}

function closePopup() {
  document.getElementById("popupOverlay").classList.add("hidden");
}

function renderPopupOptions(options, onChoose) {
  const wrap = document.getElementById("popupOptions");
  wrap.innerHTML = "";

  popupState.onChoose = onChoose;

  options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "popup-option";
    btn.type = "button";
    btn.innerHTML = `
      <div class="popup-option-title">${option.name}</div>
      ${option.sub ? `<div class="popup-option-sub">${option.sub}</div>` : ""}
    `;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".popup-option").forEach(el => el.classList.remove("active"));
      btn.classList.add("active");
      onChoose(option, index);
    });
    wrap.appendChild(btn);
  });
}

function setPopupPayment(method) {
  popupState.payment = method;
  document.getElementById("popupCashBtn").classList.toggle("active", method === "cash");
  document.getElementById("popupDigitalBtn").classList.toggle("active", method === "digital");
}

function updatePopupSummary() {
  const box = document.getElementById("popupSummary");

  if (!popupState.selectedLabel) {
    box.textContent = "Nothing selected yet.";
    return;
  }

  box.textContent = `${popupState.selectedLabel} • ${money(popupState.selectedAmount)} • ${popupState.payment}`;
}

function openSimpleSale(owner, name, amount) {
  popupState.owner = owner;
  openPopup(name, "Choose payment, then tap Done.");

  popupState.selectedLabel = name;
  popupState.selectedAmount = amount;
  updatePopupSummary();

  document.getElementById("popupOptions").innerHTML = `
    <button class="popup-option active" type="button">
      <div class="popup-option-title">${name}</div>
      <div class="popup-option-sub">${money(amount)}</div>
    </button>
  `;
}

function openJessicaBuilt() {
  popupState.owner = "jessica";
  openPopup("Built Pancakes", "Choose one built option.");

  renderPopupOptions(
    JESSICA_BUILT.map(item => ({
      name: `${item.name} • ${money(item.price)}`,
      sub: item.sub
    })),
    (_, index) => {
      const item = JESSICA_BUILT[index];
      popupState.selectedLabel = item.name;
      popupState.selectedAmount = item.price;
      updatePopupSummary();
    }
  );
}

function openJessicaYourWay() {
  popupState.owner = "jessica";
  openPopup("Stack It Your Way", "Choose a size.");

  renderPopupOptions(
    JESSICA_YOUR_WAY_SIZES.map(item => ({
      name: `${item.name} • ${money(item.price)}`,
      sub: "2 toppings, 1 drizzle, 1 fruit + whip"
    })),
    (_, index) => {
      const item = JESSICA_YOUR_WAY_SIZES[index];
      popupState.selectedLabel = `Stack It Your Way - ${item.name}`;
      popupState.selectedAmount = item.price;
      updatePopupSummary();
    }
  );
}

function openClassicLemonade() {
  popupState.owner = "janie";
  openPopup("Classic Lemonade", "Choose plain or flavored.");

  renderPopupOptions(
    [
      { name: "No Flavor • $6", sub: "Regular classic lemonade" },
      { name: "Flavored • base $6 + $1 per flavor", sub: "Choose from regular flavors" }
    ],
    (_, index) => {
      if (index === 0) {
        popupState.selectedLabel = "Classic Lemonade - No Flavor";
        popupState.selectedAmount = 6;
        updatePopupSummary();
        return;
      }

      renderPopupOptions(
        CLASSIC_FLAVORS.map(flavor => ({
          name: `${flavor} • $7`,
          sub: "Classic flavored lemonade"
        })),
        (choice) => {
          const flavorName = choice.name.replace(" • $7", "");
          popupState.selectedLabel = `Classic Lemonade - ${flavorName}`;
          popupState.selectedAmount = 7;
          updatePopupSummary();
        }
      );

      document.getElementById("popupStepTitle").textContent = "Choose one classic flavor.";
    }
  );
}

function openJanieList(owner, title, items, price) {
  popupState.owner = owner;
  openPopup(title, "Choose a drink.");

  renderPopupOptions(
    items.map(name => ({
      name: `${name} • ${money(price)}`
    })),
    (choice) => {
      const label = choice.name.replace(` • ${money(price)}`, "");
      popupState.selectedLabel = `${title} - ${label}`;
      popupState.selectedAmount = price;
      updatePopupSummary();
    }
  );
}

function openRedBull() {
  popupState.owner = "janie";
  openPopup("Red Bull Drinks", "Choose one Red Bull flavor or drink.");

  renderPopupOptions(
    REDBULL_CHOICES.map(item => ({
      name: `${item.name} • $9`,
      sub: item.category
    })),
    (choice) => {
      const label = choice.name.replace(" • $9", "");
      popupState.selectedLabel = `Red Bull - ${label}`;
      popupState.selectedAmount = 9;
      updatePopupSummary();
    }
  );
}

function open64Classic() {
  popupState.owner = "janie";
  openPopup("64 oz Classic", "Choose plain or flavored.");

  renderPopupOptions(
    [
      { name: "No Flavor • $12", sub: "64 oz classic" },
      { name: "Flavored • $13", sub: "64 oz classic with one flavor" }
    ],
    (_, index) => {
      if (index === 0) {
        popupState.selectedLabel = "64 oz Classic - No Flavor";
        popupState.selectedAmount = 12;
        updatePopupSummary();
        return;
      }

      renderPopupOptions(
        CLASSIC_FLAVORS.map(flavor => ({
          name: `${flavor} • $13`,
          sub: "64 oz classic flavored"
        })),
        (choice) => {
          const flavorName = choice.name.replace(" • $13", "");
          popupState.selectedLabel = `64 oz Classic - ${flavorName}`;
          popupState.selectedAmount = 13;
          updatePopupSummary();
        }
      );

      document.getElementById("popupStepTitle").textContent = "Choose one classic flavor.";
    }
  );
}

function open64Specialty() {
  popupState.owner = "janie";
  openPopup("64 oz Specialty", "Choose a specialty drink.");

  renderPopupOptions(
    SPECIALTY_DRINKS.map(name => ({
      name: `${name} • $15`
    })),
    (choice) => {
      const label = choice.name.replace(" • $15", "");
      popupState.selectedLabel = `64 oz Specialty - ${label}`;
      popupState.selectedAmount = 15;
      updatePopupSummary();
    }
  );
}

function confirmPopupSale() {
  if (!popupState.owner || !popupState.selectedAmount) {
    alert("Choose an item first.");
    return;
  }

  if (popupState.owner === "jessica") {
    state.jessicaTotal += popupState.selectedAmount;
  } else {
    state.janieTotal += popupState.selectedAmount;
  }

  if (popupState.payment === "cash") {
    state.cashTotal += popupState.selectedAmount;
  } else {
    state.digitalTotal += popupState.selectedAmount;
  }

  updateTotalsUI();
  closePopup();
}

function updateTotalsUI() {
  const combined = state.jessicaTotal + state.janieTotal;
  state.tips = Number(document.getElementById("tipsInput").value || 0);

  document.getElementById("jessicaTotal").textContent = money(state.jessicaTotal);
  document.getElementById("janieTotal").textContent = money(state.janieTotal);
  document.getElementById("cashTotal").textContent = money(state.cashTotal);
  document.getElementById("digitalTotal").textContent = money(state.digitalTotal);
  document.getElementById("tipsTotal").textContent = money(state.tips);
  document.getElementById("summaryJessica").textContent = money(state.jessicaTotal);
  document.getElementById("summaryJanie").textContent = money(state.janieTotal);
  document.getElementById("combinedTotal").textContent = money(combined);
  document.getElementById("summaryTips").textContent = money(state.tips);
}

async function saveDay() {
  const date = document.getElementById("datePicker").value;

  if (!date) {
    alert("Please select a date first.");
    return;
  }

  state.date = date;
  state.tips = Number(document.getElementById("tipsInput").value || 0);

  const payload = {
    date,
    createdAt: Date.now(),
    jessicaTotal: Number(state.jessicaTotal.toFixed(2)),
    janieTotal: Number(state.janieTotal.toFixed(2)),
    combinedTotal: Number((state.jessicaTotal + state.janieTotal).toFixed(2)),
    cashTotal: Number(state.cashTotal.toFixed(2)),
    digitalTotal: Number(state.digitalTotal.toFixed(2)),
    tips: Number(state.tips.toFixed(2))
  };

  try {
    await set(ref(db, `dailySales/${date}`), payload);
    alert("Day saved.");
  } catch (error) {
    console.error(error);
    alert("Could not save the day. Check your Firebase setup.");
  }
}

function renderHistoryRows(data) {
  const historyList = document.getElementById("historyList");
  const rows = Object.values(data || {}).sort((a, b) => {
    if ((a?.date || "") < (b?.date || "")) return 1;
    if ((a?.date || "") > (b?.date || "")) return -1;
    return 0;
  });

  if (!rows.length) {
    historyList.innerHTML = `
      <div class="history-row">
        <div class="history-date">No saved days yet.</div>
      </div>
    `;
    return;
  }

  historyList.innerHTML = "";

  rows.forEach(day => {
    const row = document.createElement("div");
    row.className = "history-row";

    row.innerHTML = `
      <div class="history-date">
        <span>📅</span>
        <span>${formatDateForDisplay(day.date)}</span>
      </div>

      <div class="history-stat jess">
        <div class="label">Jessica</div>
        <div class="value">${money(day.jessicaTotal)}</div>
      </div>

      <div class="history-stat janie">
        <div class="label">Janie</div>
        <div class="value">${money(day.janieTotal)}</div>
      </div>

      <div class="history-stat cash">
        <div class="label">Cash</div>
        <div class="value">${money(day.cashTotal)}</div>
      </div>

      <div class="history-stat digital">
        <div class="label">Digital</div>
        <div class="value">${money(day.digitalTotal)}</div>
      </div>

      <div class="history-stat tips">
        <div class="label">Tips</div>
        <div class="value">${money(day.tips)}</div>
      </div>

      <div class="history-arrow">›</div>
    `;

    historyList.appendChild(row);
  });
}

function loadHistory() {
  const historyList = document.getElementById("historyList");

  if (!historyBound) {
    historyList.innerHTML = `
      <div class="history-row">
        <div class="history-date">Loading...</div>
      </div>
    `;

    onValue(
      ref(db, "dailySales"),
      (snapshot) => {
        const data = snapshot.val() || {};
        renderHistoryRows(data);
      },
      (error) => {
        console.error(error);
        historyList.innerHTML = `
          <div class="history-row">
            <div class="history-date">Could not load history.</div>
          </div>
        `;
      }
    );

    historyBound = true;
  }
}

function bindEvents() {
  document.getElementById("datePicker").addEventListener("change", (e) => {
    state.date = e.target.value;
  });

  document.getElementById("tipsInput").addEventListener("input", () => {
    updateTotalsUI();
  });

  document.getElementById("saveDayBtn").addEventListener("click", saveDay);
  document.getElementById("refreshHistoryBtn").addEventListener("click", loadHistory);

  document.getElementById("closePopupBtn").addEventListener("click", closePopup);
  document.getElementById("popupDoneBtn").addEventListener("click", confirmPopupSale);
  document.getElementById("popupCashBtn").addEventListener("click", () => {
    setPopupPayment("cash");
    updatePopupSummary();
  });
  document.getElementById("popupDigitalBtn").addEventListener("click", () => {
    setPopupPayment("digital");
    updatePopupSummary();
  });

  document.getElementById("popupOverlay").addEventListener("click", (e) => {
    if (e.target.id === "popupOverlay") {
      closePopup();
    }
  });
}

function init() {
  renderMenus();
  bindEvents();
  setDefaultDate();
  updateTotalsUI();
  loadHistory();
}

init();
