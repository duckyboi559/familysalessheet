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

const jessicaItems = [
  { id: "built_stack", name: "Built Mini Pancake Stacks", emoji: "🧁" },
  { id: "your_way", name: "Stack It Your Way", emoji: "💗" },
  { id: "dubai_strawberries", name: "Dubai Strawberries", emoji: "🍓" }
];

const janieItems = [
  { id: "classic_lemonade", name: "Classic Lemonade", emoji: "🍊" },
  { id: "specialty_lemonade", name: "Specialty Lemonade", emoji: "⭐" },
  { id: "creamy_lemonade", name: "Creamy Lemonade", emoji: "🍦" },
  { id: "64oz_lemonades", name: "64oz Lemonades", emoji: "🧃" },
  { id: "redbull_drinks", name: "Red Bull Drinks", emoji: "⚡" }
];

let currentPaymentMethod = "cash";
let historyBound = false;

const state = {
  date: "",
  jessica: {},
  janie: {},
  jessicaTotal: 0,
  janieTotal: 0,
  cashTotal: 0,
  digitalTotal: 0,
  tips: 0
};

function createInitialCounts(items) {
  const result = {};
  items.forEach((item) => {
    result[item.id] = {
      qty: 0,
      amount: 0
    };
  });
  return result;
}

function resetState() {
  state.jessica = createInitialCounts(jessicaItems);
  state.janie = createInitialCounts(janieItems);
  state.jessicaTotal = 0;
  state.janieTotal = 0;
  state.cashTotal = 0;
  state.digitalTotal = 0;
  state.tips = Number(document.getElementById("tipsInput")?.value || 0);
}

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

function setPaymentMethod(method) {
  currentPaymentMethod = method;

  document.getElementById("payCashBtn").classList.toggle("active", method === "cash");
  document.getElementById("payDigitalBtn").classList.toggle("active", method === "digital");
  document.getElementById("paySplitBtn").classList.toggle("active", method === "split");
}

function buildMenuRow(item, owner) {
  const row = document.createElement("div");
  row.className = "menu-row";

  const left = document.createElement("div");
  left.className = "menu-left";

  const icon = document.createElement("div");
  icon.className = "menu-icon";
  icon.textContent = item.emoji;

  const name = document.createElement("div");
  name.className = "menu-name";
  name.textContent = item.name;

  left.appendChild(icon);
  left.appendChild(name);

  const amount = document.createElement("div");
  amount.className = "menu-right";
  amount.id = `${owner}-${item.id}-amount`;
  amount.textContent = "$0.00";

  const addBtn = document.createElement("button");
  addBtn.className = "add-btn";
  addBtn.type = "button";
  addBtn.textContent = "+";
  addBtn.addEventListener("click", () => openAmountPrompt(owner, item.id));

  row.appendChild(left);
  row.appendChild(amount);
  row.appendChild(addBtn);

  return row;
}

function renderMenus() {
  const jessicaMenuList = document.getElementById("jessicaMenuList");
  const janieMenuList = document.getElementById("janieMenuList");

  jessicaMenuList.innerHTML = "";
  janieMenuList.innerHTML = "";

  jessicaItems.forEach((item) => {
    jessicaMenuList.appendChild(buildMenuRow(item, "jessica"));
  });

  janieItems.forEach((item) => {
    janieMenuList.appendChild(buildMenuRow(item, "janie"));
  });
}

function openAmountPrompt(owner, itemId) {
  const amountText = window.prompt("Enter the dollar amount for this sale:", "0");
  if (amountText === null) return;

  const amount = Number(amountText);
  if (Number.isNaN(amount) || amount <= 0) {
    window.alert("Please enter a valid amount greater than 0.");
    return;
  }

  addSale(owner, itemId, amount);
}

function addSale(owner, itemId, amount) {
  const ownerBucket = state[owner];
  if (!ownerBucket[itemId]) return;

  ownerBucket[itemId].qty += 1;
  ownerBucket[itemId].amount += amount;

  if (owner === "jessica") {
    state.jessicaTotal += amount;
  } else {
    state.janieTotal += amount;
  }

  if (currentPaymentMethod === "cash") {
    state.cashTotal += amount;
  } else if (currentPaymentMethod === "digital") {
    state.digitalTotal += amount;
  } else {
    const half = amount / 2;
    state.cashTotal += half;
    state.digitalTotal += half;
  }

  updateItemAmountsUI();
  updateTotalsUI();
}

function updateItemAmountsUI() {
  jessicaItems.forEach((item) => {
    const el = document.getElementById(`jessica-${item.id}-amount`);
    if (el) {
      el.textContent = money(state.jessica[item.id].amount);
    }
  });

  janieItems.forEach((item) => {
    const el = document.getElementById(`janie-${item.id}-amount`);
    if (el) {
      el.textContent = money(state.janie[item.id].amount);
    }
  });
}

function updateTotalsUI() {
  const combined = state.jessicaTotal + state.janieTotal;

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
    window.alert("Please select a date first.");
    return;
  }

  state.date = date;
  state.tips = Number(document.getElementById("tipsInput").value || 0);

  const payload = {
    date,
    createdAt: Date.now(),
    paymentMethodLastUsed: currentPaymentMethod,
    jessica: state.jessica,
    janie: state.janie,
    jessicaTotal: Number(state.jessicaTotal.toFixed(2)),
    janieTotal: Number(state.janieTotal.toFixed(2)),
    combinedTotal: Number((state.jessicaTotal + state.janieTotal).toFixed(2)),
    cashTotal: Number(state.cashTotal.toFixed(2)),
    digitalTotal: Number(state.digitalTotal.toFixed(2)),
    tips: Number(state.tips.toFixed(2))
  };

  try {
    await set(ref(db, `dailySales/${date}`), payload);
    window.alert("Day saved.");
  } catch (error) {
    console.error(error);
    window.alert("Could not save the day. Check your Firebase setup.");
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

  rows.forEach((day) => {
    const row = document.createElement("div");
    row.className = "history-row";

    row.innerHTML = `
      <div class="history-date">
        <span class="history-mini">📅</span>
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

function bindInputs() {
  document.getElementById("datePicker").addEventListener("change", (e) => {
    state.date = e.target.value;
  });

  document.getElementById("tipsInput").addEventListener("input", (e) => {
    state.tips = Number(e.target.value || 0);
    updateTotalsUI();
  });

  document.getElementById("payCashBtn").addEventListener("click", () => setPaymentMethod("cash"));
  document.getElementById("payDigitalBtn").addEventListener("click", () => setPaymentMethod("digital"));
  document.getElementById("paySplitBtn").addEventListener("click", () => setPaymentMethod("split"));

  document.getElementById("saveDayBtn").addEventListener("click", saveDay);
  document.getElementById("refreshHistoryBtn").addEventListener("click", loadHistory);
}

function init() {
  resetState();
  renderMenus();
  bindInputs();
  setDefaultDate();
  setPaymentMethod("cash");
  updateItemAmountsUI();
  updateTotalsUI();
  loadHistory();
}

init();
