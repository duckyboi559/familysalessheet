import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  remove,
  onValue,
  get
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "PASTE_YOURS",
  authDomain: "PASTE_YOURS",
  databaseURL: "PASTE_YOURS",
  projectId: "PASTE_YOURS",
  storageBucket: "PASTE_YOURS",
  messagingSenderId: "PASTE_YOURS",
  appId: "PASTE_YOURS"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const FAMILY_PATH = "familyKDS";

/* -------------------- MENUS -------------------- */

const PANCAKE_BUILDS = {
  "Classic #1": ["Strawberries", "Bananas", "Powder Sugar", "Syrup"],
  "Classic #2": ["Strawberries", "Bananas", "Lechera", "Nutella", "Powder Sugar"],
  "Churro Overload": ["Cinnamon Sugar", "Cajeta", "Lechera", "Strawberries"],
  "Oreo Banana Dulce": ["Bananas", "Oreos", "Cajeta", "Lechera"],
  "Dubai Chocolate": ["Strawberries", "Crushed Pistachio", "Pistachio Cream", "Chocolate Drizzle", "Kataifi"],
  "Oreo Overload": ["Oreos", "Lechera", "Nutella", "Strawberries"],
  "Tres Leches": ["Tres Leches", "Nutella", "Lechera", "Strawberries", "Pecans"],
  "S'mores": ["Hershey Syrup", "Graham Cracker", "Mini Marshmallows", "Chocolate Chunks"]
};

const PANCAKE_TOPPINGS = [
  "Powder Sugar", "Almonds", "Mazapan", "Fruity Pebbles", "Oreos",
  "Coconut Flakes", "Pecans", "M&M's", "Sprinkles", "Chocolate Chips",
  "English Toffee Bits", "Crushed Pistachio", "Kataifi"
];

const PANCAKE_DRIZZLES = [
  "Cajeta", "Lechera", "Nutella", "Syrup", "Strawberry",
  "Hershey", "Pistachio Cream", "Chocolate Drizzle", "Tres Leches"
];

const PANCAKE_FRUITS = ["Strawberries", "Bananas"];

const PANCAKE_BOXES = [
  { name: "Classic #1", image: "images/classic-1.png", price: "20 $10 · 25 $12 · 30 $15" },
  { name: "Classic #2", image: "images/classic-2.png", price: "20 $10 · 25 $12 · 30 $15" },
  { name: "Churro Overload", image: "images/churro-overload.png", price: "20 $10 · 25 $12 · 30 $15" },
  { name: "Oreo Banana Dulce", image: "images/oreo-banana-dulce.png", price: "20 $10 · 25 $12 · 30 $15" },
  { name: "Dubai Chocolate", image: "images/dubai-chocolate.png", price: "20 $10 · 25 $12 · 30 $15" },
  { name: "Oreo Overload", image: "images/oreo-overload.png", price: "20 $10 · 25 $12 · 30 $15" },
  { name: "Tres Leches", image: "images/tres-leches.png", price: "20 $10 · 25 $12 · 30 $15" },
  { name: "S'mores", image: "images/smores.png", price: "20 $10 · 25 $12 · 30 $15" },
  { name: "Stack It Your Way", image: "images/your-way.png", price: "20 $8 · 25 $10 · 30 $12" },
  { name: "Dubai Strawberries", image: "images/dubai-strawberries.png", price: "$12" }
];

const CLASSIC_FLAVORS = [
  "Blackberry", "Blue Raspberry", "Cherry", "Coconut", "Dragon Fruit",
  "Green Apple", "Lychee", "Mango", "Passionfruit", "Peach",
  "Pineapple", "Pomegranate", "Raspberry", "Strawberry",
  "Vanilla", "Watermelon"
];

const SPECIALTY_DRINKS = {
  "Bahama Mama": ["watermelon", "mango", "pineapple", "watermelon gummies", "neon worms", "rings"],
  "Cali Sunset": ["mango", "pineapple", "pomegranate", "rings", "neon worms", "pineapple gummies"],
  "Cherry Limeade": ["cherry", "cherries", "rings", "cherry gummies", "neon worms"],
  "Cherry Bomb": ["cherry", "pomegranate", "cherries", "rings", "cherry gummies", "neon worms"],
  "Fun Dip": ["blue raspberry", "green apple", "fun dip", "green apple rings", "raspberry rim", "nerds", "rainbow belts", "nerd clusters"],
  "Green Apple": ["green apple", "caramel drizzle", "apple slices", "green apple rings", "caramel apple lollipop"],
  "Lychee Berry Twist": ["lychee", "strawberry", "fresh strawberries", "boba", "rings"],
  "Mangonada": ["mangonada", "mango chunks", "chamoy rim", "chilito powder", "mango gummies", "tamarindo stick"],
  "Melon Berry": ["watermelon", "strawberry", "fresh strawberry", "chamoy", "chilito powder", "salsagheti", "tamarindo stick"],
  "Marry Me": ["peach", "strawberry", "peach rings", "ring pop"],
  "Mr. Dill": ["chamoy rim", "pickle juice", "pickle chunks", "chilito powder", "tamarindo stick"],
  "Peachy Princess": ["strawberry", "peach", "coconut", "peach rings", "neon worms", "peach gummies"],
  "Pink Paradise": ["pineapple", "strawberry", "rings", "neon worms", "strawberry gummies"],
  "Shark Attack": ["blue raspberry", "coconut", "grenadine", "blue raspberry chamoy rim", "neon worms", "gummy sharks", "tamarindo stick"],
  "Strawberry Bliss": ["strawberry", "fresh strawberries", "rings", "neon worms", "strawberry gummies"],
  "Triple Berry Blast": ["blackberry", "strawberry", "raspberry", "sour belts", "nerd clusters"],
  "Watermelon Lychee Splash": ["watermelon", "lychee", "popping boba", "watermelon gummies", "sour belts"]
};

const CREAMY_DRINKS = {
  "Blue Cream Dream": ["blue raspberry", "sweet cream", "popping boba", "blue raspberry rings", "neon worms"],
  "Brazilian Limeade": ["limeade base", "sweetened condensed milk", "gummy rings", "neon worms"],
  "Cherries & Creme": ["cherry", "sweet cream", "cherries", "cherry gummies", "neon worms"],
  "Mango Dragon Splash": ["dragon fruit", "mango", "sweet cream", "DF chunks", "rings", "neon worms", "mango gummies"],
  "Peaches N Cream": ["peach", "dole peaches", "sweet cream", "peach rings", "peaches gummies", "neon worms"],
  "Piña Colada": ["pineapple", "coconut", "sweet cream", "pineapple chunks", "maraschino cherries", "pineapple rings"],
  "Pink Dragon": ["dragon fruit", "passion fruit", "sweet cream", "rings", "neon worms"],
  "Strawberries N Cream": ["strawberry", "condensed milk", "fresh strawberries", "strawberry rings", "strawberry gummies", "neon worms"]
};

const SF_DRINKS = {
  "Island Splash": ["coconut SF", "mango SF", "peach SF"],
  "Peachy Princess": ["coconut SF", "peach SF", "strawberry SF"],
  "Sweet Peach Bliss": ["peach SF", "mango SF"],
  "Sunset Splash": ["peach SF", "strawberry SF"],
  "Tigers Blood": ["coconut SF", "strawberry SF", "peach SF"],
  "Watermelon Sugar": ["strawberry SF", "watermelon SF"]
};

const LEMONADE_BOXES = [
  { name: "Classic Lemonade", image: "images/lemonade-box.png", price: "$6 + $1 flavor" },
  { name: "Specialty Lemonade", image: "images/lemonade-box.png", price: "$8" },
  { name: "Creamy Lemonade", image: "images/lemonade-box.png", price: "$8" },
  { name: "Sugar Free Lemonade", image: "images/lemonade-box.png", price: "$8" },
  { name: "64 oz Classic", image: "images/lemonade-box.png", price: "$10 + $1 flavor" },
  { name: "64 oz Specialty", image: "images/lemonade-box.png", price: "$15" },
  { name: "Red Bull", image: "images/lemonade-box.png", price: "$9" }
];

const HOTDOG_BOXES = [
  { name: "$5 Hotdog", image: "images/hotdog-box.png", price: "$5" },
  { name: "$8 Combo", image: "images/combo-box.png", price: "$8" },
  { name: "$10 Asada Fries", image: "images/asada-fries-box.png", price: "$10" },
  { name: "$6 Tray of Fries", image: "images/fries-box.png", price: "$6" }
];

const HOTDOG_TOPPINGS = ["Mayo", "Ketchup", "Mustard", "Cheetos", "Grilled Onions"];
const FRIES_TOPPINGS = ["Sour Cream", "Cheese", "Onion", "Cilantro", "Salsa"];

/* -------------------- STATE -------------------- */

let currentMode = null;
let orderTab = "pancakes";
let state = {
  meta: { nextOrderNumber: 1 },
  openOrders: {},
  paidOrders: {},
  handedOrders: {},
  reviewDay: {},
  days: {}
};

let draftItems = [];
let builder = { data: {} };
let editingDraftIndex = null;
let pendingCashOrderKey = null;
let reviewDayVisible = false;

/* -------------------- HELPERS -------------------- */

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function toMoney(value) {
  return Number(Number(value || 0).toFixed(2));
}

function esc(str) {
  return String(str).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function todayDefaultInput() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function labelFromDate(dateStr) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString();
}

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function topLabel(counts) {
  let best = "—";
  let bestCount = 0;
  Object.entries(counts || {}).forEach(([name, count]) => {
    if (count > bestCount) {
      best = `${name} (${count})`;
      bestCount = count;
    }
  });
  return best;
}

function ensureCashTipUI() {
  const cashPanel = document.querySelector(".cash-panel");
  if (!cashPanel) return;

  if (!document.getElementById("tipInput")) {
    const tipWrap = document.createElement("div");
    tipWrap.className = "cash-panel";
    tipWrap.innerHTML = `
      <label for="tipInput"><strong>Tip</strong></label>
      <input type="number" id="tipInput" class="cash-input" placeholder="0.00" step="0.01" />
    `;
    cashPanel.parentNode.insertBefore(tipWrap, cashPanel);
  }

  if (!document.getElementById("cashFinalTotal")) {
    const totalsBoxes = cashPanel.parentNode.querySelectorAll(".totals-box");
    if (totalsBoxes[0]) {
      const extra = document.createElement("div");
      extra.className = "totals-box";
      extra.innerHTML = `
        <div class="line">
          <span>Total With Tip</span>
          <strong id="cashFinalTotal">$0.00</strong>
        </div>
      `;
      totalsBoxes[0].insertAdjacentElement("afterend", extra);
    }
  }
}

function getSelectedCashOrder() {
  return pendingCashOrderKey ? state.openOrders[pendingCashOrderKey] : null;
}

function getCashTipValue() {
  const el = document.getElementById("tipInput");
  return toMoney(el ? el.value : 0);
}

function getCashGivenValue() {
  const el = document.getElementById("cashGivenInput");
  return toMoney(el ? el.value : 0);
}

function updateCashPanelTotals() {
  const order = getSelectedCashOrder();
  const tip = getCashTipValue();
  const given = getCashGivenValue();

  const subtotal = toMoney(order?.subtotal || 0);
  const finalTotal = toMoney(subtotal + tip);
  const change = Math.max(toMoney(given - finalTotal), 0);

  const totalEl = document.getElementById("cashOrderTotal");
  const finalEl = document.getElementById("cashFinalTotal");
  const changeEl = document.getElementById("cashChangeOutput");

  if (totalEl) totalEl.textContent = formatMoney(subtotal);
  if (finalEl) finalEl.textContent = formatMoney(finalTotal);
  if (changeEl) changeEl.textContent = formatMoney(change);
}

function resetCashPanelUI() {
  pendingCashOrderKey = null;
  const tipEl = document.getElementById("tipInput");
  const givenEl = document.getElementById("cashGivenInput");
  const totalEl = document.getElementById("cashOrderTotal");
  const finalEl = document.getElementById("cashFinalTotal");
  const changeEl = document.getElementById("cashChangeOutput");

  if (tipEl) tipEl.value = "";
  if (givenEl) givenEl.value = "";
  if (totalEl) totalEl.textContent = formatMoney(0);
  if (finalEl) finalEl.textContent = formatMoney(0);
  if (changeEl) changeEl.textContent = formatMoney(0);
}

function askTip(defaultValue = 0) {
  const raw = prompt("Enter tip amount", String(defaultValue || 0));
  if (raw === null || raw.trim() === "") return 0;
  const tip = Number(raw);
  if (Number.isNaN(tip) || tip < 0) {
    alert("Invalid tip amount.");
    return null;
  }
  return toMoney(tip);
}

function totalsFromOrders(orderObj) {
  let cash = 0, cashApp = 0, applePay = 0, square = 0;

  Object.values(orderObj || {}).forEach(order => {
    const pay = order.payment || {};
    const finalTotal = Number(pay.finalTotal ?? pay.total ?? order.subtotal ?? 0);

    if (pay.type === "cash") {
      cash += finalTotal;
    }

    if (pay.type === "digital") {
      if (pay.method === "Cash App") cashApp += finalTotal;
      if (pay.method === "Apple Pay") applePay += finalTotal;
      if (pay.method === "Square") square += finalTotal;
    }

    if (pay.type === "split") {
      cash += Number(pay.cashAmount || 0);
      if (pay.digitalMethod === "Cash App") cashApp += Number(pay.digitalAmount || 0);
      if (pay.digitalMethod === "Apple Pay") applePay += Number(pay.digitalAmount || 0);
      if (pay.digitalMethod === "Square") square += Number(pay.digitalAmount || 0);
    }
  });

  return { cash, cashApp, applePay, square, total: cash + cashApp + applePay + square };
}

function countItemsFromOrders(orderObj) {
  const counts = {};
  Object.values(orderObj || {}).forEach(order => {
    (order.items || []).forEach(item => {
      counts[item.displayName] = (counts[item.displayName] || 0) + Number(item.quantity || 0);
    });
  });
  return counts;
}

function allCompletedOrders() {
  return { ...state.paidOrders, ...state.handedOrders };
}

function currentModeTitle() {
  if (currentMode === "order") return "Order Mode";
  if (currentMode === "pancakes") return "Pancake Mode";
  if (currentMode === "lemonade") return "Lemonade Mode";
  if (currentMode === "hotdogs") return "Hotdog Mode";
  return "Family KDS System";
}

/* -------------------- MODES + TABS -------------------- */

window.setMode = function(mode) {
  currentMode = mode;
  document.getElementById("modeScreen").classList.add("hidden");
  document.getElementById("appScreen").classList.remove("hidden");

  document.getElementById("screenTitle").textContent = currentModeTitle();
  document.getElementById("currentModeLabel").textContent = currentModeTitle();
  document.getElementById("screenSubtitle").textContent =
    mode === "order" ? "Take full customer orders" :
    mode === "pancakes" ? "Jessica station items only" :
    mode === "lemonade" ? "Janie station items only" :
    "Adrian station items only";

  document.getElementById("stationFeedTitle").textContent =
    mode === "order" ? "Order Feed" : `${currentModeTitle()} Feed`;

  const tabs = document.getElementById("menuTabs");
  if (mode === "order") {
    tabs.classList.remove("hidden");
  } else {
    tabs.classList.add("hidden");
  }

  document.getElementById("saveDateInput").value = todayDefaultInput();
  ensureCashTipUI();
  clearBuilder();
  clearDraft(false);
  resetCashPanelUI();
  renderScreen();
};

window.goModePicker = function() {
  document.getElementById("modeScreen").classList.remove("hidden");
  document.getElementById("appScreen").classList.add("hidden");
};

window.setOrderTab = function(tab) {
  orderTab = tab;
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  const index = { pancakes: 0, lemonade: 1, hotdogs: 2 }[tab];
  const btns = document.querySelectorAll(".tab-btn");
  if (btns[index]) btns[index].classList.add("active");
  clearBuilder();
  renderBoxMenu();
};

window.toggleReviewDay = function() {
  reviewDayVisible = !reviewDayVisible;
  document.getElementById("reviewDayPanel").classList.toggle("hidden", !reviewDayVisible);
  renderReviewDay();
};

/* -------------------- MENUS -------------------- */

function selectedMenuBoxes() {
  if (currentMode === "pancakes") return PANCAKE_BOXES;
  if (currentMode === "lemonade") return LEMONADE_BOXES;
  if (currentMode === "hotdogs") return HOTDOG_BOXES;
  if (orderTab === "pancakes") return PANCAKE_BOXES;
  if (orderTab === "lemonade") return LEMONADE_BOXES;
  return HOTDOG_BOXES;
}

function todaySoldForBox(name) {
  const counts = countItemsFromOrders(allCompletedOrders());
  if (PANCAKE_BUILDS[name]) {
    let total = 0;
    Object.entries(counts).forEach(([k, v]) => {
      if (k.includes(name)) total += v;
    });
    return total;
  }
  return counts[name] || 0;
}

function renderBoxMenu() {
  const wrap = document.getElementById("boxMenu");
  if (!wrap) return;

  document.getElementById("menuTitle").textContent =
    currentMode === "order" ? `Order Menu — ${orderTab[0].toUpperCase()}${orderTab.slice(1)}` : currentModeTitle();

  wrap.innerHTML = selectedMenuBoxes().map(box => `
    <button type="button" class="menu-box" style="background-image:url('${box.image}')" onclick="selectMenuBox('${esc(box.name)}')">
      <div class="menu-box-content">
        <h3>${box.name}</h3>
        <p>${box.price}</p>
        <p>Today Sold: ${todaySoldForBox(box.name)}</p>
      </div>
    </button>
  `).join("");
}

window.selectMenuBox = function(name) {
  builder = { data: { itemType: name } };
  editingDraftIndex = null;
  renderBuilder();
  renderReview();
};

/* -------------------- BUILDER -------------------- */

window.clearBuilder = function() {
  builder = { data: {} };
  editingDraftIndex = null;
  renderBuilder();
  renderReview();
};

window.setBuilderValue = function(key, value) {
  builder.data[key] = value;
  renderBuilder();
  renderReview();
};

window.toggleBuilderArray = function(key, value) {
  if (!Array.isArray(builder.data[key])) builder.data[key] = [];
  const arr = builder.data[key];
  const idx = arr.indexOf(value);
  if (idx >= 0) arr.splice(idx, 1);
  else arr.push(value);
  renderBuilder();
  renderReview();
};

function choiceButtons(items, key, isMulti = false, columns = 2) {
  return `
    <div class="choice-grid" style="grid-template-columns: repeat(${columns}, 1fr);">
      ${items.map(item => {
        const selected = isMulti
          ? (Array.isArray(builder.data[key]) && builder.data[key].includes(item))
          : builder.data[key] === item;
        const cls = selected
          ? `choice-btn selected ${isMulti ? "multi-selected" : ""}`
          : "choice-btn";
        const click = isMulti
          ? `toggleBuilderArray('${key}', '${esc(item)}')`
          : `setBuilderValue('${key}', '${esc(item)}')`;
        return `<button type="button" class="${cls}" onclick="${click}">${item}</button>`;
      }).join("")}
    </div>
  `;
}

function renderBuilder() {
  const el = document.getElementById("builderStage");
  if (!el) return;

  const type = builder.data.itemType;
  if (!type) {
    el.innerHTML = `<p>Tap a box to begin.</p>`;
    return;
  }

  let html = `<h3>${type}</h3>`;

  if (PANCAKE_BUILDS[type]) {
    html += `<h4>Choose Size</h4>${choiceButtons(["20 Minis", "25 Minis", "30 Minis"], "pancakeSize")}`;
    if (builder.data.pancakeSize) {
      html += `<h4>Ingredients</h4><div class="review-card">${PANCAKE_BUILDS[type].map(i => `<p>${i}</p>`).join("")}</div>`;
      html += `<h4>Quantity</h4>${choiceButtons(["1", "2", "3", "4"], "quantity")}`;
    }
  } else if (type === "Stack It Your Way") {
    html += `<h4>Choose Size</h4>${choiceButtons(["20 Minis", "25 Minis", "30 Minis"], "yourWaySize")}`;
    if (builder.data.yourWaySize) {
      html += `<h4>Toppings</h4>${choiceButtons(PANCAKE_TOPPINGS, "yourWayToppings", true)}`;
      html += `<h4>Drizzles</h4>${choiceButtons(PANCAKE_DRIZZLES, "yourWayDrizzles", true)}`;
      html += `<h4>Fruits</h4>${choiceButtons(PANCAKE_FRUITS, "yourWayFruits", true)}`;
      html += `<h4>Quantity</h4>${choiceButtons(["1", "2", "3", "4"], "quantity")}`;
    }
  } else if (type === "Dubai Strawberries") {
    html += `<div class="review-card">
      <p>Strawberries</p>
      <p>Pistachio Cream</p>
      <p>Chocolate Drizzle</p>
      <p>Kataifi</p>
      <p>Crushed Pistachio</p>
    </div>`;
    html += `<h4>Quantity</h4>${choiceButtons(["1", "2", "3", "4"], "quantity")}`;
  } else if (type === "Classic Lemonade") {
    html += `<h4>Flavor</h4>${choiceButtons(CLASSIC_FLAVORS, "classicFlavor", false, 2)}`;
    if (builder.data.classicFlavor) html += `<h4>Quantity</h4>${choiceButtons(["1","2","3","4","5"], "quantity")}`;
  } else if (type === "Specialty Lemonade") {
    html += `<h4>Specialty</h4>${choiceButtons(Object.keys(SPECIALTY_DRINKS), "specialtyDrink", false, 2)}`;
    if (builder.data.specialtyDrink) {
      html += `<div class="review-card">${SPECIALTY_DRINKS[builder.data.specialtyDrink].map(i => `<p>${i}</p>`).join("")}</div>`;
      html += `<h4>Quantity</h4>${choiceButtons(["1","2","3","4","5"], "quantity")}`;
    }
  } else if (type === "Creamy Lemonade") {
    html += `<h4>Creamy Drink</h4>${choiceButtons(Object.keys(CREAMY_DRINKS), "creamyDrink", false, 2)}`;
    if (builder.data.creamyDrink) {
      html += `<div class="review-card">${CREAMY_DRINKS[builder.data.creamyDrink].map(i => `<p>${i}</p>`).join("")}</div>`;
      html += `<h4>Quantity</h4>${choiceButtons(["1","2","3","4","5"], "quantity")}`;
    }
  } else if (type === "Sugar Free Lemonade") {
    html += `<h4>Sugar Free Drink</h4>${choiceButtons(Object.keys(SF_DRINKS), "sfDrink", false, 2)}`;
    if (builder.data.sfDrink) {
      html += `<div class="review-card">${SF_DRINKS[builder.data.sfDrink].map(i => `<p>${i}</p>`).join("")}</div>`;
      html += `<h4>Quantity</h4>${choiceButtons(["1","2","3","4","5"], "quantity")}`;
    }
  } else if (type === "64 oz Classic") {
    html += `<h4>Flavor</h4>${choiceButtons(CLASSIC_FLAVORS, "classic64Flavor", false, 2)}`;
    if (builder.data.classic64Flavor) html += `<h4>Quantity</h4>${choiceButtons(["1","2","3","4"], "quantity")}`;
  } else if (type === "64 oz Specialty") {
    html += `<h4>Specialty</h4>${choiceButtons(Object.keys(SPECIALTY_DRINKS), "specialty64Drink", false, 2)}`;
    if (builder.data.specialty64Drink) {
      html += `<div class="review-card">${SPECIALTY_DRINKS[builder.data.specialty64Drink].map(i => `<p>${i}</p>`).join("")}</div>`;
      html += `<h4>Quantity</h4>${choiceButtons(["1","2","3","4"], "quantity")}`;
    }
  } else if (type === "Red Bull") {
    html += `<h4>Type</h4>${choiceButtons(["Regular Flavor", "Specialty", "Creamy", "Sugar Free"], "redbullType")}`;
    if (builder.data.redbullType === "Regular Flavor") {
      html += `<h4>Flavor</h4>${choiceButtons(CLASSIC_FLAVORS, "redbullFlavor", false, 2)}`;
    }
    if (builder.data.redbullType === "Specialty") {
      html += `<h4>Specialty</h4>${choiceButtons(Object.keys(SPECIALTY_DRINKS), "redbullSpecialty", false, 2)}`;
      if (builder.data.redbullSpecialty) {
        html += `<div class="review-card">${SPECIALTY_DRINKS[builder.data.redbullSpecialty].map(i => `<p>${i}</p>`).join("")}</div>`;
      }
    }
    if (builder.data.redbullType === "Creamy") {
      html += `<h4>Creamy Drink</h4>${choiceButtons(Object.keys(CREAMY_DRINKS), "redbullCreamy", false, 2)}`;
      if (builder.data.redbullCreamy) {
        html += `<div class="review-card">${CREAMY_DRINKS[builder.data.redbullCreamy].map(i => `<p>${i}</p>`).join("")}</div>`;
      }
    }
    if (builder.data.redbullType === "Sugar Free") {
      html += `<h4>Sugar Free Drink</h4>${choiceButtons(Object.keys(SF_DRINKS), "redbullSF", false, 2)}`;
      if (builder.data.redbullSF) {
        html += `<div class="review-card">${SF_DRINKS[builder.data.redbullSF].map(i => `<p>${i}</p>`).join("")}</div>`;
      }
    }
    if (builder.data.redbullFlavor || builder.data.redbullSpecialty || builder.data.redbullCreamy || builder.data.redbullSF) {
      html += `<h4>Quantity</h4>${choiceButtons(["1","2","3","4"], "quantity")}`;
    }
  } else if (type === "$5 Hotdog") {
    html += `<h4>Quantity</h4>${choiceButtons(["1","2","3","4","5"], "quantity")}`;
    if (builder.data.quantity) html += `<h4>Toppings</h4>${choiceButtons(HOTDOG_TOPPINGS, "hotdogToppings", true)}`;
  } else if (type === "$8 Combo") {
    html += `<h4>Quantity</h4>${choiceButtons(["1","2","3","4"], "quantity")}`;
    if (builder.data.quantity) {
      html += `<h4>Hotdog Toppings</h4>${choiceButtons(HOTDOG_TOPPINGS, "comboHotdogToppings", true)}`;
      html += `<div class="review-card"><p>Includes fries</p></div>`;
    }
  } else if (type === "$10 Asada Fries") {
    html += `<h4>Quantity</h4>${choiceButtons(["1","2","3","4"], "quantity")}`;
    if (builder.data.quantity) html += `<h4>Toppings</h4>${choiceButtons(FRIES_TOPPINGS, "asadaFriesToppings", true)}`;
  } else if (type === "$6 Tray of Fries") {
    html += `<h4>Quantity</h4>${choiceButtons(["1","2","3","4"], "quantity")}`;
  }

  el.innerHTML = html;
}

function buildPreviewItem() {
  const d = builder.data;
  const qty = Number(d.quantity || 0);
  const type = d.itemType;
  if (!type || !qty) return null;

  if (PANCAKE_BUILDS[type]) {
    if (!d.pancakeSize) return null;
    const prices = { "20 Minis": 10, "25 Minis": 12, "30 Minis": 15 };
    return {
      station: "pancakes",
      displayName: `${d.pancakeSize} ${type}`,
      quantity: qty,
      unitPrice: prices[d.pancakeSize],
      totalPrice: prices[d.pancakeSize] * qty,
      details: [`Build: ${type}`, ...PANCAKE_BUILDS[type]],
      builderData: clone(d)
    };
  }

  if (type === "Stack It Your Way") {
    if (!d.yourWaySize) return null;
    const prices = { "20 Minis": 8, "25 Minis": 10, "30 Minis": 12 };
    return {
      station: "pancakes",
      displayName: `${d.yourWaySize} Your Way`,
      quantity: qty,
      unitPrice: prices[d.yourWaySize],
      totalPrice: prices[d.yourWaySize] * qty,
      details: [...(d.yourWayToppings || []), ...(d.yourWayDrizzles || []), ...(d.yourWayFruits || [])],
      builderData: clone(d)
    };
  }

  if (type === "Dubai Strawberries") {
    return {
      station: "pancakes",
      displayName: "Dubai Strawberries",
      quantity: qty,
      unitPrice: 12,
      totalPrice: 12 * qty,
      details: ["Strawberries", "Pistachio Cream", "Chocolate Drizzle", "Kataifi", "Crushed Pistachio"],
      builderData: clone(d)
    };
  }

  if (type === "Classic Lemonade" && d.classicFlavor) {
    const unitPrice = 7;
    return {
      station: "lemonade",
      displayName: `${d.classicFlavor} Classic Lemonade`,
      quantity: qty,
      unitPrice,
      totalPrice: unitPrice * qty,
      details: [`Flavor: ${d.classicFlavor}`, "Flavor +$1"],
      builderData: clone(d)
    };
  }

  if (type === "Specialty Lemonade" && d.specialtyDrink) {
    return {
      station: "lemonade",
      displayName: d.specialtyDrink,
      quantity: qty,
      unitPrice: 8,
      totalPrice: 8 * qty,
      details: SPECIALTY_DRINKS[d.specialtyDrink],
      builderData: clone(d)
    };
  }

  if (type === "Creamy Lemonade" && d.creamyDrink) {
    return {
      station: "lemonade",
      displayName: d.creamyDrink,
      quantity: qty,
      unitPrice: 8,
      totalPrice: 8 * qty,
      details: CREAMY_DRINKS[d.creamyDrink],
      builderData: clone(d)
    };
  }

  if (type === "Sugar Free Lemonade" && d.sfDrink) {
    return {
      station: "lemonade",
      displayName: d.sfDrink,
      quantity: qty,
      unitPrice: 8,
      totalPrice: 8 * qty,
      details: SF_DRINKS[d.sfDrink],
      builderData: clone(d)
    };
  }

  if (type === "64 oz Classic" && d.classic64Flavor) {
    const unitPrice = 11;
    return {
      station: "lemonade",
      displayName: `64 oz ${d.classic64Flavor} Classic`,
      quantity: qty,
      unitPrice,
      totalPrice: unitPrice * qty,
      details: [`Flavor: ${d.classic64Flavor}`, "Flavor +$1"],
      builderData: clone(d)
    };
  }

  if (type === "64 oz Specialty" && d.specialty64Drink) {
    return {
      station: "lemonade",
      displayName: `64 oz ${d.specialty64Drink}`,
      quantity: qty,
      unitPrice: 15,
      totalPrice: 15 * qty,
      details: SPECIALTY_DRINKS[d.specialty64Drink],
      builderData: clone(d)
    };
  }

  if (type === "Red Bull") {
    let name = null;
    let details = [];
    if (d.redbullType === "Regular Flavor" && d.redbullFlavor) {
      name = `${d.redbullFlavor} Red Bull`;
      details = [`Flavor: ${d.redbullFlavor}`];
    } else if (d.redbullType === "Specialty" && d.redbullSpecialty) {
      name = `${d.redbullSpecialty} Red Bull`;
      details = SPECIALTY_DRINKS[d.redbullSpecialty];
    } else if (d.redbullType === "Creamy" && d.redbullCreamy) {
      name = `${d.redbullCreamy} Red Bull`;
      details = CREAMY_DRINKS[d.redbullCreamy];
    } else if (d.redbullType === "Sugar Free" && d.redbullSF) {
      name = `${d.redbullSF} Red Bull`;
      details = SF_DRINKS[d.redbullSF];
    }
    if (!name) return null;
    return {
      station: "lemonade",
      displayName: name,
      quantity: qty,
      unitPrice: 9,
      totalPrice: 9 * qty,
      details,
      builderData: clone(d)
    };
  }

  if (type === "$5 Hotdog") {
    return {
      station: "hotdogs",
      displayName: "$5 Hotdog",
      quantity: qty,
      unitPrice: 5,
      totalPrice: 5 * qty,
      details: d.hotdogToppings || [],
      builderData: clone(d)
    };
  }

  if (type === "$8 Combo") {
    return {
      station: "hotdogs",
      displayName: "$8 Combo",
      quantity: qty,
      unitPrice: 8,
      totalPrice: 8 * qty,
      details: ["Includes fries", ...(d.comboHotdogToppings || [])],
      builderData: clone(d)
    };
  }

  if (type === "$10 Asada Fries") {
    return {
      station: "hotdogs",
      displayName: "$10 Asada Fries",
      quantity: qty,
      unitPrice: 10,
      totalPrice: 10 * qty,
      details: d.asadaFriesToppings || [],
      builderData: clone(d)
    };
  }

  if (type === "$6 Tray of Fries") {
    return {
      station: "hotdogs",
      displayName: "$6 Tray of Fries",
      quantity: qty,
      unitPrice: 6,
      totalPrice: 6 * qty,
      details: [],
      builderData: clone(d)
    };
  }

  return null;
}

function renderReview() {
  const card = document.getElementById("reviewCard");
  const preview = buildPreviewItem();
  if (!preview) {
    card.innerHTML = `<p>No item being built yet.</p>`;
    return;
  }
  card.innerHTML = `
    <p><strong>${preview.displayName}</strong></p>
    <p>Quantity: ${preview.quantity}</p>
    ${preview.details.map(d => `<p>${d}</p>`).join("")}
    <p><strong>Total:</strong> ${formatMoney(preview.totalPrice)}</p>
  `;
}

/* -------------------- DRAFT -------------------- */

window.addBuiltItemToDraft = function() {
  const preview = buildPreviewItem();
  if (!preview) {
    alert("Finish building the item first.");
    return;
  }
  if (editingDraftIndex !== null) {
    draftItems[editingDraftIndex] = preview;
  } else {
    draftItems.push(preview);
  }
  editingDraftIndex = null;
  builder = { data: {} };
  renderBuilder();
  renderReview();
  renderDraft();
};

window.editDraftItem = function(index) {
  const item = draftItems[index];
  if (!item) return;
  builder = { data: clone(item.builderData || {}) };
  editingDraftIndex = index;
  renderBuilder();
  renderReview();
};

window.removeDraftItem = function(index) {
  draftItems.splice(index, 1);
  renderDraft();
};

function clearDraft(confirmIt = true) {
  if (confirmIt && draftItems.length && !confirm("Clear the current draft?")) return;
  draftItems = [];
  editingDraftIndex = null;
  renderDraft();
}
window.clearDraft = clearDraft;

function renderDraft() {
  const list = document.getElementById("draftOrderList");
  const total = draftItems.reduce((s, i) => s + i.totalPrice, 0);
  document.getElementById("draftTotal").textContent = formatMoney(total);
  document.getElementById("editingNotice").classList.toggle("hidden", editingDraftIndex === null);

  if (!draftItems.length) {
    list.innerHTML = `<p>No items in draft yet.</p>`;
    return;
  }

  list.innerHTML = draftItems.map((item, i) => `
    <div class="review-card" style="margin-bottom:8px;">
      <p><strong>${item.displayName}</strong></p>
      <p>Quantity: ${item.quantity}</p>
      ${item.details.map(d => `<p>${d}</p>`).join("")}
      <p><strong>${formatMoney(item.totalPrice)}</strong></p>
      <div class="builder-actions">
        <button type="button" class="secondary-btn" onclick="editDraftItem(${i})">Edit</button>
        <button type="button" class="secondary-btn" onclick="removeDraftItem(${i})">Remove</button>
      </div>
    </div>
  `).join("");
}

window.sendDraftToOpenOrders = async function() {
  if (!draftItems.length) {
    alert("Add at least one item first.");
    return;
  }

  const orderRef = push(ref(db, `${FAMILY_PATH}/current/openOrders`));
  const orderNumber = Number(state.meta.nextOrderNumber || 1);

  await set(orderRef, {
    orderNumber,
    createdAt: Date.now(),
    createdLabel: nowLabel(),
    status: "open",
    subtotal: toMoney(draftItems.reduce((s, i) => s + i.totalPrice, 0)),
    items: clone(draftItems)
  });

  await set(ref(db, `${FAMILY_PATH}/meta/nextOrderNumber`), orderNumber + 1);

  draftItems = [];
  builder = { data: {} };
  editingDraftIndex = null;
  renderBuilder();
  renderReview();
  renderDraft();
};

/* -------------------- ORDER LISTS -------------------- */

function paymentSummaryHtml(payment, orderSubtotal) {
  if (!payment) return "";
  const subtotal = Number(payment.subtotal ?? payment.total ?? orderSubtotal ?? 0);
  const tip = Number(payment.tip || 0);
  const finalTotal = Number(payment.finalTotal ?? subtotal + tip);

  return `
    <p><strong>Payment:</strong> ${payment.type} ${payment.method || payment.digitalMethod || ""}</p>
    <p><strong>Subtotal:</strong> ${formatMoney(subtotal)}</p>
    <p><strong>Tip:</strong> ${formatMoney(tip)}</p>
    <p><strong>Final Total:</strong> ${formatMoney(finalTotal)}</p>
    ${payment.type === "cash" ? `
      <p><strong>Given:</strong> ${formatMoney(payment.given || 0)}</p>
      <p><strong>Change:</strong> ${formatMoney(payment.change || 0)}</p>
    ` : ""}
    ${payment.type === "split" ? `
      <p><strong>Cash Part:</strong> ${formatMoney(payment.cashAmount || 0)}</p>
      <p><strong>Digital Part:</strong> ${formatMoney(payment.digitalAmount || 0)} ${payment.digitalMethod || ""}</p>
    ` : ""}
  `;
}

function orderCard(orderKey, order, type) {
  const actionButtons = [];

  if (type === "open") {
    actionButtons.push(`<button type="button" class="primary-btn" onclick="startCashPayment('${orderKey}')">Cash</button>`);
    actionButtons.push(`<button type="button" class="primary-btn" onclick="payDigital('${orderKey}')">Digital</button>`);
    actionButtons.push(`<button type="button" class="secondary-btn" onclick="paySplit('${orderKey}')">Split</button>`);
  }
  if (type === "paid") {
    actionButtons.push(`<button type="button" class="primary-btn" onclick="markHanded('${orderKey}')">Handed Out</button>`);
  }
  if (type !== "handed") {
    actionButtons.push(`<button type="button" class="secondary-btn" onclick="removeOrder('${orderKey}', '${type}')">Remove</button>`);
  }

  return `
    <div class="review-card" style="margin-bottom:8px;">
      <p><strong>Order #${order.orderNumber}</strong> — ${formatMoney(order.subtotal)}</p>
      <p>${order.createdLabel || ""}</p>
      ${(order.items || []).map(item => `
        <div class="review-card" style="margin-top:6px;">
          <p><strong>${item.displayName}</strong></p>
          <p>Qty: ${item.quantity}</p>
          ${item.details.map(d => `<p>${d}</p>`).join("")}
        </div>
      `).join("")}
      ${paymentSummaryHtml(order.payment, order.subtotal)}
      <div class="builder-actions">${actionButtons.join("")}</div>
    </div>
  `;
}

function renderOpenPaidHanded() {
  document.getElementById("openOrdersList").innerHTML =
    Object.entries(state.openOrders).length
      ? Object.entries(state.openOrders).map(([k, o]) => orderCard(k, o, "open")).join("")
      : "<p>No open orders.</p>";

  document.getElementById("paidOrdersList").innerHTML =
    Object.entries(state.paidOrders).length
      ? Object.entries(state.paidOrders).map(([k, o]) => orderCard(k, o, "paid")).join("")
      : "<p>No paid orders.</p>";

  document.getElementById("handedOrdersList").innerHTML =
    Object.entries(state.handedOrders).length
      ? Object.entries(state.handedOrders).map(([k, o]) => orderCard(k, o, "handed")).join("")
      : "<p>No handed out orders.</p>";
}

/* -------------------- STATION FEED -------------------- */

function renderStationFeed() {
  const list = document.getElementById("stationFeedList");
  let items = [];

  if (currentMode === "order") {
    items = Object.entries(state.openOrders).flatMap(([orderKey, order]) =>
      (order.items || []).map((item, idx) => ({ orderKey, orderNumber: order.orderNumber, item, realIndex: idx }))
    );
  } else {
    items = Object.entries(state.openOrders).flatMap(([orderKey, order]) =>
      (order.items || [])
        .map((item, idx) => ({ orderKey, orderNumber: order.orderNumber, item, realIndex: idx }))
        .filter(entry => entry.item.station === currentMode)
    );
  }

  if (!items.length) {
    list.innerHTML = `<p>No items for this station.</p>`;
    return;
  }

  list.innerHTML = items.map(entry => `
    <div class="review-card" style="margin-bottom:8px;">
      <p><strong>Order #${entry.orderNumber}</strong></p>
      <p><strong>${entry.item.displayName}</strong></p>
      <p>Qty: ${entry.item.quantity}</p>
      ${entry.item.details.map(d => `<p>${d}</p>`).join("")}
      ${currentMode !== "order" ? `<button type="button" class="primary-btn" onclick="stationDone('${entry.orderKey}', ${entry.realIndex})">Done</button>` : ""}
    </div>
  `).join("");
}

window.stationDone = async function(orderKey, realIndex) {
  const order = state.openOrders[orderKey];
  if (!order) return;

  const allItems = order.items || [];
  const doneItem = clone(allItems[realIndex]);
  if (!doneItem) return;

  const reviewRef = push(ref(db, `${FAMILY_PATH}/current/reviewDay`));
  await set(reviewRef, {
    orderNumber: order.orderNumber,
    station: doneItem.station,
    item: doneItem,
    doneAt: Date.now(),
    doneLabel: nowLabel()
  });

  const remainingItems = allItems.filter((_, idx) => idx !== realIndex);

  if (remainingItems.length === 0) {
    await set(ref(db, `${FAMILY_PATH}/current/paidOrders/${orderKey}`), {
      ...order,
      items: [],
      status: "paid",
      paidAt: Date.now(),
      paidLabel: nowLabel(),
      payment: order.payment || {
        type: "station_done",
        subtotal: order.subtotal,
        tip: 0,
        finalTotal: order.subtotal
      }
    });
    await remove(ref(db, `${FAMILY_PATH}/current/openOrders/${orderKey}`));
  } else {
    await set(ref(db, `${FAMILY_PATH}/current/openOrders/${orderKey}`), {
      ...order,
      items: remainingItems
    });
  }
};

/* -------------------- REVIEW DAY -------------------- */

function renderReviewDay() {
  const list = document.getElementById("reviewDayList");
  const entries = Object.values(state.reviewDay || {}).sort((a, b) => (b.doneAt || 0) - (a.doneAt || 0));

  if (!entries.length) {
    list.innerHTML = `<p>No completed items yet.</p>`;
    return;
  }

  list.innerHTML = entries.map(entry => `
    <div class="review-card" style="margin-bottom:8px;">
      <p><strong>Order #${entry.orderNumber}</strong></p>
      <p><strong>${entry.item.displayName}</strong></p>
      <p>Station: ${entry.station}</p>
      <p>${entry.doneLabel}</p>
      ${entry.item.details.map(d => `<p>${d}</p>`).join("")}
    </div>
  `).join("");
}

/* -------------------- PAYMENTS -------------------- */

window.startCashPayment = function(orderKey) {
  const order = state.openOrders[orderKey];
  if (!order) return;

  pendingCashOrderKey = orderKey;
  ensureCashTipUI();
  resetCashPanelUI();
  pendingCashOrderKey = orderKey;
  updateCashPanelTotals();
};

document.addEventListener("input", (e) => {
  if (e.target.id === "cashGivenInput" || e.target.id === "tipInput") {
    updateCashPanelTotals();
  }
});

window.confirmCashPayment = async function() {
  if (!pendingCashOrderKey) {
    alert("Choose a cash order first.");
    return;
  }

  const order = state.openOrders[pendingCashOrderKey];
  if (!order) return;

  const tip = getCashTipValue();
  const given = getCashGivenValue();
  const subtotal = toMoney(order.subtotal);
  const finalTotal = toMoney(subtotal + tip);

  if (given < finalTotal) {
    alert("Amount given must cover the order total plus tip.");
    return;
  }

  const change = toMoney(given - finalTotal);

  await set(ref(db, `${FAMILY_PATH}/current/paidOrders/${pendingCashOrderKey}`), {
    ...order,
    status: "paid",
    paidAt: Date.now(),
    paidLabel: nowLabel(),
    payment: {
      type: "cash",
      subtotal,
      tip,
      finalTotal,
      given,
      change
    }
  });

  await remove(ref(db, `${FAMILY_PATH}/current/openOrders/${pendingCashOrderKey}`));
  resetCashPanelUI();
};

window.payDigital = async function(orderKey) {
  const order = state.openOrders[orderKey];
  if (!order) return;

  const method = prompt("Enter digital method exactly:\nCash App\nApple Pay\nSquare");
  if (method === null) return;

  const m = method.trim();
  if (!["Cash App", "Apple Pay", "Square"].includes(m)) {
    alert("Enter Cash App, Apple Pay, or Square exactly.");
    return;
  }

  const tip = askTip(0);
  if (tip === null) return;

  const subtotal = toMoney(order.subtotal);
  const finalTotal = toMoney(subtotal + tip);

  await set(ref(db, `${FAMILY_PATH}/current/paidOrders/${orderKey}`), {
    ...order,
    status: "paid",
    paidAt: Date.now(),
    paidLabel: nowLabel(),
    payment: {
      type: "digital",
      method: m,
      subtotal,
      tip,
      finalTotal
    }
  });

  await remove(ref(db, `${FAMILY_PATH}/current/openOrders/${orderKey}`));
};

window.paySplit = async function(orderKey) {
  const order = state.openOrders[orderKey];
  if (!order) return;

  const subtotal = toMoney(order.subtotal);
  const tip = askTip(0);
  if (tip === null) return;

  const finalTotal = toMoney(subtotal + tip);

  const cashAmount = Number(prompt(`Order total is ${formatMoney(finalTotal)}.\nEnter CASH amount only:`));
  if (Number.isNaN(cashAmount) || cashAmount < 0 || cashAmount > finalTotal) {
    alert("Invalid cash amount.");
    return;
  }

  const digitalAmount = toMoney(finalTotal - cashAmount);
  const method = prompt(`Digital amount is ${formatMoney(digitalAmount)}.\nEnter digital method:\nCash App\nApple Pay\nSquare`);
  if (method === null) return;

  const m = method.trim();
  if (!["Cash App", "Apple Pay", "Square"].includes(m)) {
    alert("Enter Cash App, Apple Pay, or Square exactly.");
    return;
  }

  await set(ref(db, `${FAMILY_PATH}/current/paidOrders/${orderKey}`), {
    ...order,
    status: "paid",
    paidAt: Date.now(),
    paidLabel: nowLabel(),
    payment: {
      type: "split",
      subtotal,
      tip,
      finalTotal,
      cashAmount: toMoney(cashAmount),
      digitalAmount,
      digitalMethod: m
    }
  });

  await remove(ref(db, `${FAMILY_PATH}/current/openOrders/${orderKey}`));
};

window.markHanded = async function(orderKey) {
  const order = state.paidOrders[orderKey];
  if (!order) return;
  await set(ref(db, `${FAMILY_PATH}/current/handedOrders/${orderKey}`), {
    ...order,
    status: "handed",
    handedAt: Date.now(),
    handedLabel: nowLabel()
  });
  await remove(ref(db, `${FAMILY_PATH}/current/paidOrders/${orderKey}`));
};

window.removeOrder = async function(orderKey, type) {
  if (!confirm("Remove this order?")) return;
  const pathMap = {
    open: `${FAMILY_PATH}/current/openOrders/${orderKey}`,
    paid: `${FAMILY_PATH}/current/paidOrders/${orderKey}`,
    handed: `${FAMILY_PATH}/current/handedOrders/${orderKey}`
  };
  await remove(ref(db, pathMap[type]));

  if (type === "open" && pendingCashOrderKey === orderKey) {
    resetCashPanelUI();
  }
};

/* -------------------- SAVE / RESET -------------------- */

async function setMetaIfMissing() {
  const snap = await get(ref(db, `${FAMILY_PATH}/meta/nextOrderNumber`));
  if (!snap.exists()) {
    await set(ref(db, `${FAMILY_PATH}/meta/nextOrderNumber`), 1);
  }
}

window.saveDay = async function() {
  const saveDate = document.getElementById("saveDateInput").value;
  if (!saveDate) {
    alert("Pick a save date first.");
    return;
  }

  const saveBtn = document.querySelector('button[onclick="saveDay()"]');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";
  }

  try {
    const completed = allCompletedOrders();
    const totals = totalsFromOrders(completed);
    const itemCounts = countItemsFromOrders(completed);

    await set(ref(db, `${FAMILY_PATH}/days/${saveDate}`), {
      label: labelFromDate(saveDate),
      savedDate: saveDate,
      createdAt: Date.now(),
      openOrders: clone(state.openOrders),
      paidOrders: clone(state.paidOrders),
      handedOrders: clone(state.handedOrders),
      reviewDay: clone(state.reviewDay),
      totals,
      itemCounts
    });

    await set(ref(db, `${FAMILY_PATH}/current/openOrders`), {});
    await set(ref(db, `${FAMILY_PATH}/current/paidOrders`), {});
    await set(ref(db, `${FAMILY_PATH}/current/handedOrders`), {});
    await set(ref(db, `${FAMILY_PATH}/current/reviewDay`), {});
    await set(ref(db, `${FAMILY_PATH}/meta/nextOrderNumber`), 1);

    draftItems = [];
    builder = { data: {} };
    renderBuilder();
    renderReview();
    renderDraft();
    resetCashPanelUI();

    alert(`Day saved for ${labelFromDate(saveDate)}.`);
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save Day";
    }
  }
};

window.resetDay = async function() {
  if (!confirm("Reset today without saving?")) return;

  await set(ref(db, `${FAMILY_PATH}/current/openOrders`), {});
  await set(ref(db, `${FAMILY_PATH}/current/paidOrders`), {});
  await set(ref(db, `${FAMILY_PATH}/current/handedOrders`), {});
  await set(ref(db, `${FAMILY_PATH}/current/reviewDay`), {});
  await set(ref(db, `${FAMILY_PATH}/meta/nextOrderNumber`), 1);

  draftItems = [];
  builder = { data: {} };
  renderBuilder();
  renderReview();
  renderDraft();
  resetCashPanelUI();
};

/* -------------------- SUMMARY -------------------- */

function getWeeklyTotal() {
  const start = getWeekStart();
  let total = 0;
  Object.values(state.days || {}).forEach(day => {
    const d = day.savedDate ? new Date(day.savedDate + "T12:00:00") : new Date(day.createdAt || 0);
    if (d >= start) total += Number(day.totals?.total || 0);
  });
  return total;
}

function renderCountsAndTotals() {
  const completed = allCompletedOrders();
  const totals = totalsFromOrders(completed);
  document.getElementById("dayTotal").textContent = formatMoney(totals.total);
  document.getElementById("cashTotal").textContent = formatMoney(totals.cash);
  document.getElementById("cashAppTotal").textContent = formatMoney(totals.cashApp);
  document.getElementById("applePayTotal").textContent = formatMoney(totals.applePay);
  document.getElementById("squareTotal").textContent = formatMoney(totals.square);
  document.getElementById("reviewCount").textContent = Object.keys(state.reviewDay).length;
  document.getElementById("weekTotal").textContent = formatMoney(getWeeklyTotal());
}

/* -------------------- RENDER -------------------- */

function renderScreen() {
  if (!currentMode) return;
  ensureCashTipUI();
  renderBoxMenu();
  renderBuilder();
  renderReview();
  renderDraft();
  renderOpenPaidHanded();
  renderStationFeed();
  renderReviewDay();
  renderCountsAndTotals();
  updateCashPanelTotals();
}

/* -------------------- LISTENERS -------------------- */

function attachListeners() {
  onValue(ref(db, `${FAMILY_PATH}/meta`), snap => {
    state.meta = snap.val() || { nextOrderNumber: 1 };
    renderScreen();
  });

  onValue(ref(db, `${FAMILY_PATH}/current/openOrders`), snap => {
    state.openOrders = snap.val() || {};
    if (pendingCashOrderKey && !state.openOrders[pendingCashOrderKey]) {
      resetCashPanelUI();
    }
    renderScreen();
  });

  onValue(ref(db, `${FAMILY_PATH}/current/paidOrders`), snap => {
    state.paidOrders = snap.val() || {};
    renderScreen();
  });

  onValue(ref(db, `${FAMILY_PATH}/current/handedOrders`), snap => {
    state.handedOrders = snap.val() || {};
    renderScreen();
  });

  onValue(ref(db, `${FAMILY_PATH}/current/reviewDay`), snap => {
    state.reviewDay = snap.val() || {};
    renderScreen();
  });

  onValue(ref(db, `${FAMILY_PATH}/days`), snap => {
    state.days = snap.val() || {};
    renderScreen();
  });
}

/* -------------------- INIT -------------------- */

ensureCashTipUI();
setMetaIfMissing();
attachListeners();
