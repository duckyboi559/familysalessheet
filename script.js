import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  update,
  remove,
  onValue,
  runTransaction
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js";

/* ========= FIREBASE CONFIG ========= */
const firebaseConfig = {
  apiKey: "AIzaSyDMhniulSEmiIWoXzwJy6zVSOZkHELhfLc", 
 authDomain: "family-sales.firebaseapp.com", 
 databaseURL: "https://family-sales-default-rtdb.firebaseio.com", projectId: "family-sales", 
 storageBucket: "family-sales.firebasestorage.app", 
 messagingSenderId: "590845027956",
 appId: "1:590845027956:web:676df074fe6150e8d39321"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const REGULAR_FLAVORS = [
  "Blackberry",
  "Blue Raspberry",
  "Cherry",
  "Coconut",
  "Dragon Fruit",
  "Green Apple",
  "Lychee",
  "Mango",
  "Passion Fruit",
  "Peach",
  "Pineapple",
  "Pomegranate",
  "Raspberry",
  "Strawberry",
  "Vanilla",
  "Watermelon"
];

const SPECIALTY_DRINKS = {
  "Bahama Mama": ["Watermelon", "Mango", "Pineapple", "Watermelon Gummies", "Neon Worms", "Rings"],
  "Cali Sunset": ["Mango", "Pineapple", "Pomegranate", "Rings", "Neon Worms", "Pineapple Gummies"],
  "Cherry Limeade": ["Cherry", "Cherries", "Rings", "Cherry Gummies", "Neon Worms"],
  "Cherry Bomb": ["Cherry", "Pomegranate", "Cherries", "Rings", "Cherry Gummies", "Neon Worms"],
  "Fun Dip": ["Blue Raspberry", "Green Apple", "Fun Dip", "Green Apple Rings", "Raspberry Rim", "Nerds", "Rainbow Belts", "Nerd Clusters"],
  "Green Apple": ["Green Apple", "Caramel Drizzle", "Apple Slices", "Green Apple Rings", "Caramel Apple Lollipop"],
  "Lychee Berry Twist": ["Lychee", "Strawberry", "Fresh Strawberries", "Boba", "Rings"],
  "Mangonada": ["Mangonada", "Mango Chunks", "Chamoy Rim", "Chilito Powder", "Mango Gummies", "Tamarindo Stick"],
  "Melon Berry": ["Watermelon", "Strawberry", "Fresh Strawberry", "Chamoy", "Chilito Powder", "Salsagheti", "Tamarindo Stick"],
  "Marry Me": ["Peach", "Strawberry", "Peach Rings", "Ring Pop"],
  "Mr. Dill": ["Chamoy Rim", "Pickle Juice", "Pickle Chunks", "Chilito Powder", "Tamarindo Stick"],
  "Peachy Princess": ["Strawberry", "Peach", "Coconut", "Peach Rings", "Neon Worms", "Peach Gummies"],
  "Pink Paradise": ["Pineapple", "Strawberry", "Rings", "Neon Worms", "Strawberry Gummies"],
  "Shark Attack": ["Blue Raspberry", "Coconut", "Grenadine", "Blue Raspberry Chamoy Rim", "Neon Worms", "Gummy Sharks", "Tamarindo Stick"],
  "Strawberry Bliss": ["Strawberry", "Fresh Strawberries", "Rings", "Neon Worms", "Strawberry Gummies"],
  "Triple Berry Blast": ["Blackberry", "Strawberry", "Raspberry", "Sour Belts", "Nerd Clusters"],
  "Watermelon Lychee Splash": ["Watermelon", "Lychee", "Popping Boba", "Watermelon Gummies", "Sour Belts"]
};

const CREAMY_DRINKS = {
  "Blue Cream Dream": ["Blue Raspberry", "Sweet Cream", "Popping Boba", "Blue Raspberry Rings", "Neon Worms"],
  "Brazilian Limeade": ["Limeade Base", "Sweetened Condensed Milk", "Gummy Rings", "Neon Worms"],
  "Cherries & Creme": ["Cherry", "Sweet Cream", "Cherries", "Cherry Gummies", "Neon Worms"],
  "Mango Dragon Splash": ["Dragon Fruit", "Mango", "Sweet Cream", "Dragon Fruit Chunks", "Rings", "Neon Worms", "Mango Gummies"],
  "Peaches N Cream": ["Peach", "Dole Peaches", "Sweet Cream", "Peach Rings", "Peach Gummies", "Neon Worms"],
  "Piña Colada": ["Pineapple", "Coconut", "Sweet Cream", "Pineapple Chunks", "Maraschino Cherries", "Pineapple Rings"],
  "Pink Dragon": ["Dragon Fruit", "Passion Fruit", "Sweet Cream", "Rings", "Neon Worms"],
  "Strawberries N Cream": ["Strawberry", "Condensed Milk", "Fresh Strawberries", "Strawberry Rings", "Strawberry Gummies", "Neon Worms"]
};

const SUGAR_FREE_DRINKS = {
  "Island Splash": ["Coconut SF", "Mango SF", "Peach SF"],
  "Peachy Princess": ["Coconut SF", "Peach SF", "Strawberry SF"],
  "Sweet Peach Bliss": ["Peach SF", "Mango SF"],
  "Sunset Splash": ["Peach SF", "Strawberry SF"],
  "Tigers Blood": ["Coconut SF", "Strawberry SF", "Peach SF"],
  "Watermelon Sugar": ["Strawberry SF", "Watermelon SF"]
};

const STACKED_BUILDS = {
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
  "Powder Sugar",
  "Almonds",
  "Mazapan",
  "Fruity Pebbles",
  "Oreos",
  "Coconut Flakes",
  "Pecans",
  "M&M's",
  "Sprinkles",
  "Chocolate Chips",
  "English Toffee Bits"
];

const PANCAKE_DRIZZLES = ["Cajeta", "Lechera", "Nutella", "Syrup", "Strawberry", "Hershey"];
const PANCAKE_FRUITS = ["Strawberries", "Bananas"];

const HOTDOG_CHOICES = ["Ketchup", "Mustard", "Mayo", "Grilled Onions", "Hot Cheetos"];
const FRIES_CHOICES = ["Sour Cream", "Salsa", "Pico de Gallo", "Duck Sauce", "Cheese"];
const FRIES_MEAT_CHOICES = ["Regular Meat", "Extra Meat +$3", "Double Meat +$5"];

let liveState = {
  meta: { nextOrderNumber: 1 },
  openOrders: {},
  paidOrders: {},
  handedOutOrders: {},
  days: {}
};

let draftItems = [];
let builder = { category: null, data: {} };
let editingDraftIndex = null;
let editingOpenOrderKey = null;
let selectedHistoryDay = null;

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function escapeForSingleQuote(str) {
  return String(str).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function todayLabel() {
  return new Date().toLocaleDateString();
}

function ownerBlank() {
  return { adrian: 0, jessica: 0, janie: 0 };
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function sumOwnerTotals(list) {
  const out = ownerBlank();
  list.forEach(item => {
    out.adrian += item.ownerTotals?.adrian || 0;
    out.jessica += item.ownerTotals?.jessica || 0;
    out.janie += item.ownerTotals?.janie || 0;
  });
  return out;
}

function totalsFromOrders(ordersObject) {
  const list = Object.values(ordersObject || {});
  let cash = 0;
  let cashApp = 0;
  let applePay = 0;
  let square = 0;
  const owners = ownerBlank();

  list.forEach(order => {
    owners.adrian += order.ownerTotals?.adrian || 0;
    owners.jessica += order.ownerTotals?.jessica || 0;
    owners.janie += order.ownerTotals?.janie || 0;

    if (order.payment?.type === "cash") {
      cash += Number(order.payment.total || 0);
    }
    if (order.payment?.type === "digital") {
      if (order.payment.method === "Cash App") cashApp += Number(order.payment.total || 0);
      if (order.payment.method === "Apple Pay") applePay += Number(order.payment.total || 0);
      if (order.payment.method === "Square") square += Number(order.payment.total || 0);
    }
    if (order.payment?.type === "split") {
      cash += Number(order.payment.cashAmount || 0);
      if (order.payment.digitalMethod === "Cash App") cashApp += Number(order.payment.digitalAmount || 0);
      if (order.payment.digitalMethod === "Apple Pay") applePay += Number(order.payment.digitalAmount || 0);
      if (order.payment.digitalMethod === "Square") square += Number(order.payment.digitalAmount || 0);
    }
  });

  return {
    cash,
    cashApp,
    applePay,
    square,
    dayTotal: cash + cashApp + applePay + square,
    owners
  };
}

function getCombinedPaidAndHanded() {
  return {
    ...liveState.paidOrders,
    ...liveState.handedOutOrders
  };
}

function getOrderForLabel(order) {
  const a = Number(order.ownerTotals?.adrian || 0);
  const j = Number(order.ownerTotals?.jessica || 0);
  const n = Number(order.ownerTotals?.janie || 0);

  const count = [a > 0, j > 0, n > 0].filter(Boolean).length;

  if (count > 1) return "Mixed Order";
  if (a > 0) return "For Adrian";
  if (j > 0) return "For Jessica";
  if (n > 0) return "For Janie";
  return "Order";
}

function choiceButtons(items, key, isMulti = false) {
  return `
    <div class="choice-grid">
      ${items.map(item => {
        const selected = isMulti
          ? (Array.isArray(builder.data[key]) && builder.data[key].includes(item))
          : builder.data[key] === item;

        const safe = escapeForSingleQuote(item);
        const cls = selected
          ? `choice-btn selected ${isMulti ? "multi-selected" : ""}`
          : "choice-btn";

        const click = isMulti
          ? `toggleBuilderArray('${key}', '${safe}')`
          : `setBuilderValue('${key}', '${safe}')`;

        return `<button type="button" class="${cls}" onclick="${click}">${item}</button>`;
      }).join("")}
    </div>
  `;
}

function renderScreen() {
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");

  document.getElementById("mainScreen").classList.toggle("hidden", view === "history");
  document.getElementById("historyScreen").classList.toggle("hidden", view !== "history");

  if (view === "history") {
    const day = params.get("day");
    selectedHistoryDay = day || null;
    renderHistoryScreen();
  } else {
    renderMainScreen();
  }
}

window.goHome = function () {
  history.pushState({}, "", window.location.pathname);
  renderScreen();
};

window.goHistory = function () {
  history.pushState({}, "", `${window.location.pathname}?view=history`);
  renderScreen();
};

window.selectHistoryDay = function (dayKey) {
  history.pushState({}, "", `${window.location.pathname}?view=history&day=${encodeURIComponent(dayKey)}`);
  renderScreen();
};

window.addEventListener("popstate", renderScreen);

window.startBuilder = function (category) {
  builder = { category, data: {} };
  editingDraftIndex = null;
  renderBuilder();
  renderReview();
};

window.clearBuilder = function () {
  builder = { category: null, data: {} };
  editingDraftIndex = null;
  renderBuilder();
  renderReview();
};

window.setBuilderValue = function (key, value) {
  builder.data[key] = value;
  renderBuilder();
  renderReview();
};

window.toggleBuilderArray = function (key, value) {
  if (!Array.isArray(builder.data[key])) builder.data[key] = [];
  const arr = builder.data[key];
  const idx = arr.indexOf(value);

  if (idx >= 0) arr.splice(idx, 1);
  else arr.push(value);

  renderBuilder();
  renderReview();
};

function renderBuilder() {
  const el = document.getElementById("builderStage");
  if (!el) return;

  if (!builder.category) {
    el.innerHTML = `<p>Pick a category to begin.</p>`;
    return;
  }

  if (builder.category === "adrian") {
    let html = `
      <h3>Adrian Menu</h3>
      <h4>1. Choose item</h4>
      ${choiceButtons([
        "Bacon Dog",
        "Quack Attack",
        "Asada Fries",
        "Cheeto Fries",
        "Small Fry Tray",
        "Big Fry Tray"
      ], "itemType")}
    `;

    const itemType = builder.data.itemType;

    if (itemType) {
      html += `
        <h4>2. Quantity</h4>
        ${choiceButtons(["1", "2", "3", "4", "5"], "quantity")}
      `;
    }

    if (builder.data.quantity && (itemType === "Bacon Dog" || itemType === "Quack Attack")) {
      html += `
        <h4>3. Condiments / Extras</h4>
        ${choiceButtons(HOTDOG_CHOICES, "condiments", true)}
      `;
    }

    if (builder.data.quantity && (itemType === "Asada Fries" || itemType === "Cheeto Fries")) {
      html += `
        <h4>3. Toppings</h4>
        ${choiceButtons(FRIES_CHOICES, "friesToppings", true)}
        <h4>4. Meat Option</h4>
        ${choiceButtons(FRIES_MEAT_CHOICES, "meatOption")}
      `;
    }

    el.innerHTML = html;
    return;
  }

  if (builder.category === "jessica") {
    let html = `
      <h3>Jessica Menu</h3>
      <h4>1. Choose item</h4>
      ${choiceButtons([
        "Stack'd",
        "Your Way",
        "Bite Stack"
      ], "pancakeType")}
    `;

    const type = builder.data.pancakeType;

    if (type === "Stack'd") {
      html += `
        <h4>2. Size</h4>
        ${choiceButtons(["20 Minis", "25 Minis", "30 Minis"], "stackedSize")}
      `;
      if (builder.data.stackedSize) {
        html += `
          <h4>3. Build</h4>
          ${choiceButtons(Object.keys(STACKED_BUILDS), "stackedBuild")}
        `;
        if (builder.data.stackedBuild) {
          html += `
            <h4>Ingredients</h4>
            <div class="review-card">
              ${STACKED_BUILDS[builder.data.stackedBuild].map(i => `<p>${i}</p>`).join("")}
            </div>
          `;
        }
      }
      html += `
        <h4>4. Quantity</h4>
        ${choiceButtons(["1", "2", "3", "4"], "quantity")}
      `;
    }

    if (type === "Your Way") {
      html += `
        <h4>2. Size</h4>
        ${choiceButtons(["20 Minis", "25 Minis", "30 Minis"], "yourWaySize")}
      `;
      if (builder.data.yourWaySize) {
        html += `
          <h4>3. Toppings</h4>
          ${choiceButtons(PANCAKE_TOPPINGS, "yourWayToppings", true)}
          <h4>4. Drizzles</h4>
          ${choiceButtons(PANCAKE_DRIZZLES, "yourWayDrizzles", true)}
          <h4>5. Fruits</h4>
          ${choiceButtons(PANCAKE_FRUITS, "yourWayFruits", true)}
          <h4>6. Quantity</h4>
          ${choiceButtons(["1", "2", "3", "4"], "quantity")}
          <p class="helper">No hard limit. Tap as many as needed.</p>
        `;
      }
    }

    if (type === "Bite Stack") {
      html += `
        <h4>2. Toppings</h4>
        ${choiceButtons(PANCAKE_TOPPINGS, "biteToppings", true)}
        <h4>3. Drizzles</h4>
        ${choiceButtons(PANCAKE_DRIZZLES, "biteDrizzles", true)}
        <h4>4. Fruits</h4>
        ${choiceButtons(PANCAKE_FRUITS, "biteFruits", true)}
        <h4>5. Quantity</h4>
        ${choiceButtons(["1", "2", "3", "4"], "quantity")}
        <p class="helper">No hard limit. Tap as many as needed.</p>
      `;
    }

    el.innerHTML = html;
    return;
  }

  if (builder.category === "janie") {
    let html = `
      <h3>Janie Drinks</h3>
      <h4>1. Choose item</h4>
      ${choiceButtons([
        "Classic Lemonade",
        "Specialty Lemonade",
        "64oz Classic",
        "64oz Specialty",
        "Creamy Lemonade",
        "Sugar Free Lemonade",
        "Red Bull Lemonade",
        "Sago Small",
        "Sago Large"
      ], "drinkType")}
    `;

    const drinkType = builder.data.drinkType;

    if (drinkType) {
      html += `
        <h4>2. Quantity</h4>
        ${choiceButtons(["1", "2", "3", "4", "5"], "quantity")}
      `;
    }

    if (builder.data.quantity && drinkType === "Classic Lemonade") {
      html += `
        <h4>3. Flavor Add-On (+$1 optional)</h4>
        ${choiceButtons(["No Flavor", "Add Flavor +$1"], "classicFlavorMode")}
      `;
      if (builder.data.classicFlavorMode === "Add Flavor +$1") {
        html += `
          <h4>4. Choose Flavor</h4>
          ${choiceButtons(REGULAR_FLAVORS, "classicFlavor")}
        `;
      }
    }

    if (builder.data.quantity && drinkType === "64oz Classic") {
      html += `
        <h4>3. Flavor Add-On (+$1 optional)</h4>
        ${choiceButtons(["No Flavor", "Add Flavor +$1"], "classic64FlavorMode")}
      `;
      if (builder.data.classic64FlavorMode === "Add Flavor +$1") {
        html += `
          <h4>4. Choose Flavor</h4>
          ${choiceButtons(REGULAR_FLAVORS, "classic64Flavor")}
        `;
      }
    }

    if (builder.data.quantity && drinkType === "Specialty Lemonade") {
      html += `
        <h4>3. Choose Specialty</h4>
        ${choiceButtons(Object.keys(SPECIALTY_DRINKS), "specialtyDrink")}
      `;
      if (builder.data.specialtyDrink) {
        html += `
          <h4>Ingredients</h4>
          <div class="review-card">
            ${SPECIALTY_DRINKS[builder.data.specialtyDrink].map(i => `<p>${i}</p>`).join("")}
          </div>
        `;
      }
    }

    if (builder.data.quantity && drinkType === "64oz Specialty") {
      html += `
        <h4>3. Choose Specialty</h4>
        ${choiceButtons(Object.keys(SPECIALTY_DRINKS), "specialty64Drink")}
      `;
      if (builder.data.specialty64Drink) {
        html += `
          <h4>Ingredients</h4>
          <div class="review-card">
            ${SPECIALTY_DRINKS[builder.data.specialty64Drink].map(i => `<p>${i}</p>`).join("")}
          </div>
        `;
      }
    }

    if (builder.data.quantity && drinkType === "Creamy Lemonade") {
      html += `
        <h4>3. Choose Creamy Drink</h4>
        ${choiceButtons(Object.keys(CREAMY_DRINKS), "creamyDrink")}
      `;
      if (builder.data.creamyDrink) {
        html += `
          <h4>Ingredients</h4>
          <div class="review-card">
            ${CREAMY_DRINKS[builder.data.creamyDrink].map(i => `<p>${i}</p>`).join("")}
          </div>
        `;
      }
    }

    if (builder.data.quantity && drinkType === "Sugar Free Lemonade") {
      html += `
        <h4>3. Choose Sugar Free Drink</h4>
        ${choiceButtons(Object.keys(SUGAR_FREE_DRINKS), "sfDrink")}
      `;
      if (builder.data.sfDrink) {
        html += `
          <h4>Ingredients</h4>
          <div class="review-card">
            ${SUGAR_FREE_DRINKS[builder.data.sfDrink].map(i => `<p>${i}</p>`).join("")}
          </div>
        `;
      }
    }

    if (builder.data.quantity && drinkType === "Red Bull Lemonade") {
      html += `
        <h4>3. Choose Flavor</h4>
        ${choiceButtons(REGULAR_FLAVORS, "redBullFlavor")}
      `;
    }

    el.innerHTML = html;
    return;
  }

  if (builder.category === "combo") {
    let html = `
      <h3>Combos</h3>
      <h4>1. Choose combo</h4>
      ${choiceButtons([
        "#1 Classic Lemonade + Bacon Dog ($10)",
        "#1 Specialty Lemonade + Bacon Dog ($12)",
        "#2 Classic Lemonade + Bite Stack Mini Pancakes ($10)",
        "#2 Specialty Lemonade + Bite Stack Mini Pancakes ($12)",
        "#3 Bacon Dog + Fries Combo ($8)"
      ], "comboType")}
    `;

    const comboType = builder.data.comboType;

    if (comboType) {
      html += `
        <h4>2. Quantity</h4>
        ${choiceButtons(["1", "2", "3", "4"], "quantity")}
      `;
    }

    if (builder.data.quantity && comboType === "#3 Bacon Dog + Fries Combo ($8)") {
      html += `
        <h4>3. Hotdog Condiments</h4>
        ${choiceButtons(HOTDOG_CHOICES, "comboDogCondiments", true)}
        <div class="review-card">
          <p><strong>Fries:</strong> Ketchup only</p>
        </div>
      `;
    }

    if (builder.data.quantity && comboType && comboType.includes("Bacon Dog") && comboType !== "#3 Bacon Dog + Fries Combo ($8)") {
      html += `
        <h4>3. Hotdog Condiments</h4>
        ${choiceButtons(HOTDOG_CHOICES, "comboDogCondiments", true)}
      `;
      if (comboType.includes("Specialty")) {
        html += `
          <h4>4. Choose Specialty Drink</h4>
          ${choiceButtons(Object.keys(SPECIALTY_DRINKS), "comboSpecialtyDrink")}
        `;
        if (builder.data.comboSpecialtyDrink) {
          html += `
            <h4>Drink Ingredients</h4>
            <div class="review-card">
              ${SPECIALTY_DRINKS[builder.data.comboSpecialtyDrink].map(i => `<p>${i}</p>`).join("")}
            </div>
          `;
        }
      }
    }

    if (builder.data.quantity && comboType && comboType.includes("Bite Stack")) {
      html += `
        <h4>3. Bite Stack Toppings</h4>
        ${choiceButtons(PANCAKE_TOPPINGS, "comboBiteToppings", true)}
        <h4>4. Bite Stack Drizzles</h4>
        ${choiceButtons(PANCAKE_DRIZZLES, "comboBiteDrizzles", true)}
        <h4>5. Bite Stack Fruits</h4>
        ${choiceButtons(PANCAKE_FRUITS, "comboBiteFruits", true)}
      `;
      if (comboType.includes("Specialty")) {
        html += `
          <h4>6. Choose Specialty Drink</h4>
          ${choiceButtons(Object.keys(SPECIALTY_DRINKS), "comboSpecialtyDrink2")}
        `;
        if (builder.data.comboSpecialtyDrink2) {
          html += `
            <h4>Drink Ingredients</h4>
            <div class="review-card">
              ${SPECIALTY_DRINKS[builder.data.comboSpecialtyDrink2].map(i => `<p>${i}</p>`).join("")}
            </div>
          `;
        }
      }
    }

    el.innerHTML = html;
  }
}

function buildPreviewItem() {
  const d = builder.data;
  const qty = Number(d.quantity || 0);
  if (!builder.category || !qty) return null;

  if (builder.category === "adrian") {
    const type = d.itemType;
    if (!type) return null;

    if (type === "Bacon Dog" || type === "Quack Attack") {
      const unit = type === "Bacon Dog" ? 5 : 6;
      return {
        kind: type === "Bacon Dog" ? "baconDog" : "quackAttack",
        name: type,
        quantity: qty,
        unitPrice: unit,
        totalPrice: unit * qty,
        ownerTotals: { adrian: unit * qty, jessica: 0, janie: 0 },
        lines: [`Quantity: ${qty}`, ...(d.condiments || [])],
        selections: { condiments: d.condiments || [] }
      };
    }

    if (type === "Asada Fries" || type === "Cheeto Fries") {
      const base = type === "Asada Fries" ? 10 : 13;
      let meatUp = 0;
      if (d.meatOption === "Extra Meat +$3") meatUp = 3;
      if (d.meatOption === "Double Meat +$5") meatUp = 5;
      const unit = base + meatUp;

      return {
        kind: type === "Asada Fries" ? "asadaFries" : "cheetoFries",
        name: type,
        quantity: qty,
        unitPrice: unit,
        totalPrice: unit * qty,
        ownerTotals: { adrian: unit * qty, jessica: 0, janie: 0 },
        lines: [`Quantity: ${qty}`, ...(d.friesToppings || []), d.meatOption || "Regular Meat"],
        selections: {
          friesToppings: d.friesToppings || [],
          meatOption: d.meatOption || "Regular Meat"
        }
      };
    }

    if (type === "Small Fry Tray" || type === "Big Fry Tray") {
      const unit = type === "Small Fry Tray" ? 3 : 6;
      return {
        kind: type === "Small Fry Tray" ? "smallFryTray" : "bigFryTray",
        name: type,
        quantity: qty,
        unitPrice: unit,
        totalPrice: unit * qty,
        ownerTotals: { adrian: unit * qty, jessica: 0, janie: 0 },
        lines: [`Quantity: ${qty}`],
        selections: {}
      };
    }
  }

  if (builder.category === "jessica") {
    const type = d.pancakeType;
    if (!type) return null;

    if (type === "Stack'd") {
      if (!d.stackedSize || !d.stackedBuild) return null;
      const priceMap = { "20 Minis": 10, "25 Minis": 12, "30 Minis": 15 };
      const unit = priceMap[d.stackedSize];
      return {
        kind: "stackedPancakes",
        name: `${d.stackedSize} ${d.stackedBuild}`,
        quantity: qty,
        unitPrice: unit,
        totalPrice: unit * qty,
        ownerTotals: { adrian: 0, jessica: unit * qty, janie: 0 },
        lines: [`Quantity: ${qty}`, `Build: ${d.stackedBuild}`, ...STACKED_BUILDS[d.stackedBuild]],
        selections: {
          pancakeType: "Stack'd",
          stackedSize: d.stackedSize,
          stackedBuild: d.stackedBuild
        }
      };
    }

    if (type === "Your Way") {
      if (!d.yourWaySize) return null;
      const priceMap = { "20 Minis": 8, "25 Minis": 10, "30 Minis": 12 };
      const unit = priceMap[d.yourWaySize];
      return {
        kind: "yourWayPancakes",
        name: `${d.yourWaySize} Your Way`,
        quantity: qty,
        unitPrice: unit,
        totalPrice: unit * qty,
        ownerTotals: { adrian: 0, jessica: unit * qty, janie: 0 },
        lines: [`Quantity: ${qty}`, ...(d.yourWayToppings || []), ...(d.yourWayDrizzles || []), ...(d.yourWayFruits || [])],
        selections: {
          pancakeType: "Your Way",
          yourWaySize: d.yourWaySize,
          yourWayToppings: d.yourWayToppings || [],
          yourWayDrizzles: d.yourWayDrizzles || [],
          yourWayFruits: d.yourWayFruits || []
        }
      };
    }

    if (type === "Bite Stack") {
      const unit = 5;
      return {
        kind: "biteStack",
        name: "Bite Stack",
        quantity: qty,
        unitPrice: unit,
        totalPrice: unit * qty,
        ownerTotals: { adrian: 0, jessica: unit * qty, janie: 0 },
        lines: [`Quantity: ${qty}`, ...(d.biteToppings || []), ...(d.biteDrizzles || []), ...(d.biteFruits || [])],
        selections: {
          pancakeType: "Bite Stack",
          biteToppings: d.biteToppings || [],
          biteDrizzles: d.biteDrizzles || [],
          biteFruits: d.biteFruits || []
        }
      };
    }
  }

  if (builder.category === "janie") {
    const type = d.drinkType;
    if (!type) return null;

    if (type === "Classic Lemonade") {
      let unit = 6;
      const flavorLines = [];
      if (d.classicFlavorMode === "Add Flavor +$1" && d.classicFlavor) {
        unit += 1;
        flavorLines.push(`Flavor: ${d.classicFlavor}`);
      }
      return {
        kind: "classicLemonade",
        name: "Classic Lemonade",
        quantity: qty,
        unitPrice: unit,
        totalPrice: unit * qty,
        ownerTotals: { adrian: 0, jessica: 0, janie: unit * qty },
        lines: [`Quantity: ${qty}`, ...flavorLines],
        selections: {
          drinkType: type,
          classicFlavorMode: d.classicFlavorMode || "No Flavor",
          classicFlavor: d.classicFlavor || null
        }
      };
    }

    if (type === "64oz Classic") {
      let unit = 10;
      const flavorLines = [];
      if (d.classic64FlavorMode === "Add Flavor +$1" && d.classic64Flavor) {
        unit += 1;
        flavorLines.push(`Flavor: ${d.classic64Flavor}`);
      }
      return {
        kind: "classic64",
        name: "64oz Classic Lemonade",
        quantity: qty,
        unitPrice: unit,
        totalPrice: unit * qty,
        ownerTotals: { adrian: 0, jessica: 0, janie: unit * qty },
        lines: [`Quantity: ${qty}`, ...flavorLines],
        selections: {
          drinkType: type,
          classic64FlavorMode: d.classic64FlavorMode || "No Flavor",
          classic64Flavor: d.classic64Flavor || null
        }
      };
    }

    if (type === "Specialty Lemonade") {
      if (!d.specialtyDrink) return null;
      const unit = 8;
      return {
        kind: "specialtyLemonade",
        name: d.specialtyDrink,
        quantity: qty,
        unitPrice: unit,
        totalPrice: unit * qty,
        ownerTotals: { adrian: 0, jessica: 0, janie: unit * qty },
        lines: [`Quantity: ${qty}`, ...SPECIALTY_DRINKS[d.specialtyDrink]],
        selections: { drinkType: type, specialtyDrink: d.specialtyDrink }
      };
    }

    if (type === "64oz Specialty") {
      if (!d.specialty64Drink) return null;
      const unit = 15;
      return {
        kind: "specialty64",
        name: `64oz ${d.specialty64Drink}`,
        quantity: qty,
        unitPrice: unit,
        totalPrice: unit * qty,
        ownerTotals: { adrian: 0, jessica: 0, janie: unit * qty },
        lines: [`Quantity: ${qty}`, ...SPECIALTY_DRINKS[d.specialty64Drink]],
        selections: { drinkType: type, specialty64Drink: d.specialty64Drink }
      };
    }

    if (type === "Creamy Lemonade") {
      if (!d.creamyDrink) return null;
      const unit = 8;
      return {
        kind: "creamyLemonade",
        name: d.creamyDrink,
        quantity: qty,
        unitPrice: unit,
        totalPrice: unit * qty,
        ownerTotals: { adrian: 0, jessica: 0, janie: unit * qty },
        lines: [`Quantity: ${qty}`, ...CREAMY_DRINKS[d.creamyDrink]],
        selections: { drinkType: type, creamyDrink: d.creamyDrink }
      };
    }

    if (type === "Sugar Free Lemonade") {
      if (!d.sfDrink) return null;
      const unit = 8;
      return {
        kind: "sfLemonade",
        name: d.sfDrink,
        quantity: qty,
        unitPrice: unit,
        totalPrice: unit * qty,
        ownerTotals: { adrian: 0, jessica: 0, janie: unit * qty },
        lines: [`Quantity: ${qty}`, ...SUGAR_FREE_DRINKS[d.sfDrink]],
        selections: { drinkType: type, sfDrink: d.sfDrink }
      };
    }

    if (type === "Red Bull Lemonade") {
      if (!d.redBullFlavor) return null;
      const unit = 9;
      return {
        kind: "redBullLemonade",
        name: `${d.redBullFlavor} Red Bull Lemonade`,
        quantity: qty,
        unitPrice: unit,
        totalPrice: unit * qty,
        ownerTotals: { adrian: 0, jessica: 0, janie: unit * qty },
        lines: [`Quantity: ${qty}`, `Flavor: ${d.redBullFlavor}`],
        selections: { drinkType: type, redBullFlavor: d.redBullFlavor }
      };
    }

    if (type === "Sago Small" || type === "Sago Large") {
      const unit = type === "Sago Small" ? 6 : 10;
      return {
        kind: type === "Sago Small" ? "sagoSmall" : "sagoLarge",
        name: type,
        quantity: qty,
        unitPrice: unit,
        totalPrice: unit * qty,
        ownerTotals: { adrian: 0, jessica: 0, janie: unit * qty },
        lines: [`Quantity: ${qty}`, "Plain Sago"],
        selections: { drinkType: type }
      };
    }
  }

  if (builder.category === "combo") {
    const combo = d.comboType;
    if (!combo) return null;

    if (combo === "#3 Bacon Dog + Fries Combo ($8)") {
      const unit = 8;
      return {
        kind: "combo3",
        name: combo,
        quantity: qty,
        unitPrice: unit,
        totalPrice: unit * qty,
        ownerTotals: { adrian: unit * qty, jessica: 0, janie: 0 },
        lines: [`Quantity: ${qty}`, "Includes: Bacon Dog", ...(d.comboDogCondiments || []), "Includes: Fries", "Fries: Ketchup only"],
        selections: {
          comboType: combo,
          comboDogCondiments: d.comboDogCondiments || []
        }
      };
    }

    if (combo.includes("Bacon Dog")) {
      const unit = combo.includes("Specialty") ? 12 : 10;
      const janiePart = combo.includes("Specialty") ? 7 : 5;
      const adrianPart = 5;
      const lines = [`Quantity: ${qty}`, ...(d.comboDogCondiments || [])];

      if (combo.includes("Specialty")) {
        if (!d.comboSpecialtyDrink) return null;
        lines.push(`Drink: ${d.comboSpecialtyDrink}`);
        lines.push(...SPECIALTY_DRINKS[d.comboSpecialtyDrink]);
      } else {
        lines.push("Drink: Classic Lemonade");
      }

      return {
        kind: "combo1",
        name: combo,
        quantity: qty,
        unitPrice: unit,
        totalPrice: unit * qty,
        ownerTotals: { adrian: adrianPart * qty, jessica: 0, janie: janiePart * qty },
        lines,
        selections: {
          comboType: combo,
          comboDogCondiments: d.comboDogCondiments || [],
          comboSpecialtyDrink: d.comboSpecialtyDrink || null
        }
      };
    }

    if (combo.includes("Bite Stack")) {
      const unit = combo.includes("Specialty") ? 12 : 10;
      const janiePart = combo.includes("Specialty") ? 7 : 5;
      const jessicaPart = 5;
      const lines = [`Quantity: ${qty}`, ...(d.comboBiteToppings || []), ...(d.comboBiteDrizzles || []), ...(d.comboBiteFruits || [])];

      if (combo.includes("Specialty")) {
        if (!d.comboSpecialtyDrink2) return null;
        lines.push(`Drink: ${d.comboSpecialtyDrink2}`);
        lines.push(...SPECIALTY_DRINKS[d.comboSpecialtyDrink2]);
      } else {
        lines.push("Drink: Classic Lemonade");
      }

      return {
        kind: "combo2",
        name: combo,
        quantity: qty,
        unitPrice: unit,
        totalPrice: unit * qty,
        ownerTotals: { adrian: 0, jessica: jessicaPart * qty, janie: janiePart * qty },
        lines,
        selections: {
          comboType: combo,
          comboBiteToppings: d.comboBiteToppings || [],
          comboBiteDrizzles: d.comboBiteDrizzles || [],
          comboBiteFruits: d.comboBiteFruits || [],
          comboSpecialtyDrink2: d.comboSpecialtyDrink2 || null
        }
      };
    }
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
    <p><strong>${preview.name}</strong></p>
    ${preview.lines.map(line => `<p>${line}</p>`).join("")}
    <p><strong>Total:</strong> ${formatMoney(preview.totalPrice)}</p>
  `;
}

window.addBuiltItemToDraft = function () {
  const preview = buildPreviewItem();
  if (!preview) {
    alert("Finish building the item first.");
    return;
  }

  const itemToStore = {
    ...preview,
    builderCategory: builder.category,
    builderData: clone(builder.data)
  };

  if (editingDraftIndex !== null) {
    draftItems[editingDraftIndex] = itemToStore;
  } else {
    draftItems.push(itemToStore);
  }

  editingDraftIndex = null;
  builder = { category: null, data: {} };
  renderBuilder();
  renderReview();
  renderDraft();
};

window.editDraftItem = function (index) {
  const item = draftItems[index];
  if (!item) return;

  builder = {
    category: item.builderCategory,
    data: clone(item.builderData)
  };
  editingDraftIndex = index;
  renderBuilder();
  renderReview();
};

window.removeDraftItem = function (index) {
  draftItems.splice(index, 1);
  renderDraft();
};

window.clearDraft = function () {
  if (!draftItems.length && !editingOpenOrderKey) return;
  if (!confirm("Clear the current draft?")) return;

  draftItems = [];
  builder = { category: null, data: {} };
  editingDraftIndex = null;
  editingOpenOrderKey = null;
  renderBuilder();
  renderReview();
  renderDraft();
};

function renderDraft() {
  const list = document.getElementById("draftOrderList");
  const totals = sumOwnerTotals(draftItems);
  const total = draftItems.reduce((sum, item) => sum + item.totalPrice, 0);

  document.getElementById("draftAdrian").textContent = formatMoney(totals.adrian);
  document.getElementById("draftJessica").textContent = formatMoney(totals.jessica);
  document.getElementById("draftJanie").textContent = formatMoney(totals.janie);
  document.getElementById("draftTotal").textContent = formatMoney(total);

  document.getElementById("editingNotice").classList.toggle("hidden", !editingOpenOrderKey);

  if (!draftItems.length) {
    list.innerHTML = `<p>No items in draft yet.</p>`;
    return;
  }

  list.innerHTML = draftItems.map((item, index) => `
    <div class="order-item">
      <div class="order-item-head">
        <div>
          <p><strong>${item.name}</strong></p>
          ${item.lines.map(line => `<p>${line}</p>`).join("")}
          <p><strong>${formatMoney(item.totalPrice)}</strong></p>
        </div>
      </div>
      <div class="order-actions">
        <button type="button" class="action-btn" onclick="editDraftItem(${index})">Edit Item</button>
        <button type="button" class="action-btn delete-btn" onclick="removeDraftItem(${index})">Remove</button>
      </div>
    </div>
  `).join("");
}

window.sendDraftToOpenOrders = async function () {
  if (!draftItems.length) {
    alert("Add at least one item first.");
    return;
  }

  const subtotal = draftItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const ownerTotals = sumOwnerTotals(draftItems);

  if (editingOpenOrderKey) {
    const current = liveState.openOrders[editingOpenOrderKey];
    if (!current) {
      alert("That open order no longer exists.");
      editingOpenOrderKey = null;
      return;
    }

    const updatedOrder = {
      ...current,
      items: clone(draftItems),
      subtotal,
      ownerTotals,
      updatedAt: Date.now()
    };

    await set(ref(db, `live/openOrders/${editingOpenOrderKey}`), updatedOrder);
    draftItems = [];
    builder = { category: null, data: {} };
    editingDraftIndex = null;
    editingOpenOrderKey = null;
    renderBuilder();
    renderReview();
    renderDraft();
    return;
  }

  const nextNumberRef = ref(db, "live/meta/nextOrderNumber");
  const txn = await runTransaction(nextNumberRef, current => (current || 1) + 1);
  const orderNumber = (txn.snapshot.val() || 2) - 1;

  const newRef = push(ref(db, "live/openOrders"));
  const order = {
    orderNumber,
    createdAt: Date.now(),
    createdLabel: nowLabel(),
    status: "open",
    subtotal,
    ownerTotals,
    items: clone(draftItems)
  };

  await set(newRef, order);

  draftItems = [];
  builder = { category: null, data: {} };
  editingDraftIndex = null;
  renderBuilder();
  renderReview();
  renderDraft();
};

window.loadOpenOrderForEdit = function (orderKey) {
  const order = liveState.openOrders[orderKey];
  if (!order) return;

  draftItems = clone(order.items || []);
  editingOpenOrderKey = orderKey;
  editingDraftIndex = null;
  builder = { category: null, data: {} };
  renderBuilder();
  renderReview();
  renderDraft();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.removeOpenOrder = async function (orderKey) {
  if (!confirm("Delete this open order?")) return;
  await remove(ref(db, `live/openOrders/${orderKey}`));

  if (editingOpenOrderKey === orderKey) {
    editingOpenOrderKey = null;
    draftItems = [];
    renderDraft();
  }
};

async function moveOpenToPaid(orderKey, payment) {
  const order = liveState.openOrders[orderKey];
  if (!order) return;

  const paidOrder = {
    ...order,
    status: "paid",
    payment,
    paidAt: Date.now(),
    paidLabel: nowLabel()
  };

  await set(ref(db, `live/paidOrders/${orderKey}`), paidOrder);
  await remove(ref(db, `live/openOrders/${orderKey}`));

  if (editingOpenOrderKey === orderKey) {
    editingOpenOrderKey = null;
    draftItems = [];
    renderDraft();
  }
}

window.payOpenOrderCash = async function (orderKey) {
  const order = liveState.openOrders[orderKey];
  if (!order) return;

  const amountGivenInput = prompt(`Order total is ${formatMoney(order.subtotal)}.\nEnter cash received:`);
  if (amountGivenInput === null) return;

  const amountGiven = Number(amountGivenInput);
  if (Number.isNaN(amountGiven)) {
    alert("Invalid number.");
    return;
  }
  if (amountGiven < order.subtotal) {
    alert(`Not enough cash. Need at least ${formatMoney(order.subtotal)}.`);
    return;
  }

  const changeDue = Number((amountGiven - order.subtotal).toFixed(2));
  alert(`Change due: ${formatMoney(changeDue)}`);

  await moveOpenToPaid(orderKey, {
    type: "cash",
    total: order.subtotal,
    cashReceived: amountGiven,
    changeDue
  });
};

window.payOpenOrderDigital = async function (orderKey) {
  const order = liveState.openOrders[orderKey];
  if (!order) return;

  const method = prompt("Enter digital method exactly:\nCash App\nApple Pay\nSquare");
  if (method === null) return;

  const cleaned = method.trim();
  if (!["Cash App", "Apple Pay", "Square"].includes(cleaned)) {
    alert("Enter Cash App, Apple Pay, or Square exactly.");
    return;
  }

  await moveOpenToPaid(orderKey, {
    type: "digital",
    method: cleaned,
    total: order.subtotal
  });
};

window.payOpenOrderSplit = async function (orderKey) {
  const order = liveState.openOrders[orderKey];
  if (!order) return;

  const cashInput = prompt(`Order total is ${formatMoney(order.subtotal)}.\nEnter CASH amount:`);
  if (cashInput === null) return;

  const cashAmount = Number(cashInput);
  if (Number.isNaN(cashAmount) || cashAmount < 0 || cashAmount > order.subtotal) {
    alert("Invalid cash amount.");
    return;
  }

  const digitalAmount = Number((order.subtotal - cashAmount).toFixed(2));
  const method = prompt(`Digital amount is ${formatMoney(digitalAmount)}.\nEnter digital method exactly:\nCash App\nApple Pay\nSquare`);
  if (method === null) return;

  const cleaned = method.trim();
  if (!["Cash App", "Apple Pay", "Square"].includes(cleaned)) {
    alert("Enter Cash App, Apple Pay, or Square exactly.");
    return;
  }

  let cashReceived = cashAmount;
  let changeDue = 0;

  if (cashAmount > 0) {
    const receivedInput = prompt(`Cash portion is ${formatMoney(cashAmount)}.\nEnter cash received:`);
    if (receivedInput === null) return;

    cashReceived = Number(receivedInput);
    if (Number.isNaN(cashReceived) || cashReceived < cashAmount) {
      alert("Cash received must cover the cash portion.");
      return;
    }

    changeDue = Number((cashReceived - cashAmount).toFixed(2));
    alert(`Cash change due: ${formatMoney(changeDue)}`);
  }

  await moveOpenToPaid(orderKey, {
    type: "split",
    total: order.subtotal,
    cashAmount,
    cashReceived,
    changeDue,
    digitalAmount,
    digitalMethod: cleaned
  });
};

window.markPaidAsHandedOut = async function (orderKey) {
  const order = liveState.paidOrders[orderKey];
  if (!order) return;

  const handed = {
    ...order,
    status: "handed_out",
    handedOutAt: Date.now(),
    handedOutLabel: nowLabel()
  };

  await set(ref(db, `live/handedOutOrders/${orderKey}`), handed);
  await remove(ref(db, `live/paidOrders/${orderKey}`));
};

window.removePaidOrder = async function (orderKey) {
  if (!confirm("Remove this paid order?")) return;
  await remove(ref(db, `live/paidOrders/${orderKey}`));
};

window.removeHandedOrder = async function (orderKey) {
  if (!confirm("Remove this handed out order?")) return;
  await remove(ref(db, `live/handedOutOrders/${orderKey}`));
};

function renderOrderCard(orderKey, order, type) {
  const statusClass =
    type === "open" ? "status-open" :
    type === "paid" ? "status-paid" :
    "status-handed";

  const statusText =
    type === "open" ? "Open" :
    type === "paid" ? "Paid" :
    "Handed Out";

  const forLabel = getOrderForLabel(order);

  let actions = "";

  if (type === "open") {
    actions = `
      <div class="order-actions">
        <button type="button" class="action-btn" onclick="loadOpenOrderForEdit('${orderKey}')">Edit Order</button>
        <button type="button" class="action-btn delete-btn" onclick="removeOpenOrder('${orderKey}')">Remove</button>
        <button type="button" class="action-btn pay-cash" onclick="payOpenOrderCash('${orderKey}')">Pay Cash</button>
        <button type="button" class="action-btn pay-digital" onclick="payOpenOrderDigital('${orderKey}')">Pay Digital</button>
        <button type="button" class="action-btn pay-split" onclick="payOpenOrderSplit('${orderKey}')">Split</button>
      </div>
    `;
  }

  if (type === "paid") {
    actions = `
      <div class="order-actions">
        <button type="button" class="action-btn mark-handed" onclick="markPaidAsHandedOut('${orderKey}')">Handed Out</button>
        <button type="button" class="action-btn delete-btn" onclick="removePaidOrder('${orderKey}')">Remove</button>
      </div>
    `;
  }

  if (type === "handed") {
    actions = `
      <div class="order-actions">
        <button type="button" class="action-btn delete-btn" onclick="removeHandedOrder('${orderKey}')">Remove</button>
      </div>
    `;
  }

  let paymentLines = "";
  if (order.payment) {
    if (order.payment.type === "cash") {
      paymentLines = `
        <p><strong>Cash:</strong> ${formatMoney(order.payment.total)}</p>
        <p><strong>Given:</strong> ${formatMoney(order.payment.cashReceived)}</p>
        <p><strong>Change:</strong> ${formatMoney(order.payment.changeDue)}</p>
      `;
    }
    if (order.payment.type === "digital") {
      paymentLines = `
        <p><strong>Digital:</strong> ${order.payment.method}</p>
        <p><strong>Total:</strong> ${formatMoney(order.payment.total)}</p>
      `;
    }
    if (order.payment.type === "split") {
      paymentLines = `
        <p><strong>Cash:</strong> ${formatMoney(order.payment.cashAmount)}</p>
        <p><strong>Given:</strong> ${formatMoney(order.payment.cashReceived)}</p>
        <p><strong>Change:</strong> ${formatMoney(order.payment.changeDue)}</p>
        <p><strong>Digital:</strong> ${order.payment.digitalMethod}</p>
        <p><strong>Digital Amt:</strong> ${formatMoney(order.payment.digitalAmount)}</p>
      `;
    }
  }

  return `
    <div class="order-card compact-card">
      <span class="status-pill ${statusClass}">${statusText}</span>
      <p class="for-label"><strong>${forLabel}</strong></p>

      <div class="order-card-head">
        <div>
          <p><strong>Order #${order.orderNumber}</strong></p>
          <p>${type === "open" ? order.createdLabel : (order.paidLabel || order.handedOutLabel || "")}</p>
        </div>
        <div><strong>${formatMoney(order.subtotal)}</strong></div>
      </div>

      ${order.items.map(item => `
        <div class="order-item compact-item">
          <div>
            <p><strong>${item.name}</strong></p>
            ${item.lines.map(line => `<p>${line}</p>`).join("")}
          </div>
        </div>
      `).join("")}

      ${paymentLines}
      ${actions}
    </div>
  `;
}

function renderLiveColumns() {
  const openList = document.getElementById("openOrdersList");
  const paidList = document.getElementById("paidOrdersList");
  const handedList = document.getElementById("handedOrdersList");

  const openEntries = Object.entries(liveState.openOrders || {}).sort((a, b) => (a[1].createdAt || 0) - (b[1].createdAt || 0));
  const paidEntries = Object.entries(liveState.paidOrders || {}).sort((a, b) => (a[1].paidAt || 0) - (b[1].paidAt || 0));
  const handedEntries = Object.entries(liveState.handedOutOrders || {})
    .filter(([, order]) => {
      const handedAt = Number(order.handedOutAt || 0);
      return Date.now() - handedAt < 60000;
    })
    .sort((a, b) => (a[1].handedOutAt || 0) - (b[1].handedOutAt || 0));

  openList.innerHTML = openEntries.length
    ? openEntries.map(([key, order]) => renderOrderCard(key, order, "open")).join("")
    : "<p>No open orders.</p>";

  paidList.innerHTML = paidEntries.length
    ? paidEntries.map(([key, order]) => renderOrderCard(key, order, "paid")).join("")
    : "<p>No paid orders.</p>";

  handedList.innerHTML = handedEntries.length
    ? handedEntries.map(([key, order]) => renderOrderCard(key, order, "handed")).join("")
    : "<p>No handed out orders.</p>";
}

function renderMainScreen() {
  renderBuilder();
  renderReview();
  renderDraft();
  renderLiveColumns();

  const combined = totalsFromOrders(getCombinedPaidAndHanded());

  document.getElementById("nextOrderNumber").textContent = liveState.meta.nextOrderNumber || 1;
  document.getElementById("openCount").textContent = Object.keys(liveState.openOrders || {}).length;
  document.getElementById("paidCount").textContent = Object.keys(liveState.paidOrders || {}).length;
  document.getElementById("handedCount").textContent = Object.keys(liveState.handedOutOrders || {}).length;

  document.getElementById("cashTotal").textContent = formatMoney(combined.cash);
  document.getElementById("cashAppTotal").textContent = formatMoney(combined.cashApp);
  document.getElementById("applePayTotal").textContent = formatMoney(combined.applePay);
  document.getElementById("squareTotal").textContent = formatMoney(combined.square);

  document.getElementById("adrianTotal").textContent = formatMoney(combined.owners.adrian);
  document.getElementById("jessicaTotal").textContent = formatMoney(combined.owners.jessica);
  document.getElementById("janieTotal").textContent = formatMoney(combined.owners.janie);
  document.getElementById("dayTotal").textContent = formatMoney(combined.dayTotal);
}

function renderHistoryScreen() {
  const daysList = document.getElementById("historyDaysList");
  const detail = document.getElementById("historyDetail");
  const detailTitle = document.getElementById("historyDetailTitle");

  const dayEntries = Object.entries(liveState.days || {}).sort((a, b) => b[0].localeCompare(a[0]));

  if (!dayEntries.length) {
    daysList.innerHTML = "<p>No saved days yet.</p>";
    detail.innerHTML = "<p>Select a day.</p>";
    detailTitle.textContent = "Day Details";
    return;
  }

  daysList.innerHTML = dayEntries.map(([dayKey, day]) => `
    <div class="history-day-card">
      <p><strong>${day.label || dayKey}</strong></p>
      <p>Total: ${formatMoney(day.totals?.dayTotal || 0)}</p>
      <p>Orders: ${[
        ...Object.values(day.openOrders || {}),
        ...Object.values(day.paidOrders || {}),
        ...Object.values(day.handedOutOrders || {})
      ].length}</p>
      <div class="order-actions">
        <button type="button" class="action-btn" onclick="selectHistoryDay('${dayKey}')">View Day</button>
      </div>
    </div>
  `).join("");

  if (!selectedHistoryDay || !liveState.days[selectedHistoryDay]) {
    detail.innerHTML = "<p>Select a day.</p>";
    detailTitle.textContent = "Day Details";
    return;
  }

  const day = liveState.days[selectedHistoryDay];
  detailTitle.textContent = `Day Details — ${day.label || selectedHistoryDay}`;

  const allOrders = [
    ...Object.entries(day.openOrders || {}).map(([k, v]) => ({ key: k, status: "Open", ...v })),
    ...Object.entries(day.paidOrders || {}).map(([k, v]) => ({ key: k, status: "Paid", ...v })),
    ...Object.entries(day.handedOutOrders || {}).map(([k, v]) => ({ key: k, status: "Handed Out", ...v }))
  ].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

  detail.innerHTML = `
    <div class="totals-box">
      <div class="line"><span>Cash</span><strong>${formatMoney(day.totals?.cash || 0)}</strong></div>
      <div class="line"><span>Cash App</span><strong>${formatMoney(day.totals?.cashApp || 0)}</strong></div>
      <div class="line"><span>Apple Pay</span><strong>${formatMoney(day.totals?.applePay || 0)}</strong></div>
      <div class="line"><span>Square</span><strong>${formatMoney(day.totals?.square || 0)}</strong></div>
      <div class="line"><span>Adrian</span><strong>${formatMoney(day.totals?.owners?.adrian || 0)}</strong></div>
      <div class="line"><span>Jessica</span><strong>${formatMoney(day.totals?.owners?.jessica || 0)}</strong></div>
      <div class="line"><span>Janie</span><strong>${formatMoney(day.totals?.owners?.janie || 0)}</strong></div>
      <div class="line total-line"><span>Total</span><strong>${formatMoney(day.totals?.dayTotal || 0)}</strong></div>
    </div>
    ${allOrders.map(order => `
      <div class="history-order-card">
        <p><strong>Order #${order.orderNumber}</strong> — ${order.status}</p>
        <p>${order.createdLabel || ""}</p>
        ${order.items.map(item => `
          <div class="order-item">
            <div>
              <p><strong>${item.name}</strong></p>
              ${item.lines.map(line => `<p>${line}</p>`).join("")}
              <p>${formatMoney(item.totalPrice)}</p>
            </div>
          </div>
        `).join("")}
        <p><strong>Subtotal:</strong> ${formatMoney(order.subtotal)}</p>
        ${order.payment ? `
          <p><strong>Payment Type:</strong> ${order.payment.type}</p>
          ${order.payment.method ? `<p><strong>Digital Method:</strong> ${order.payment.method}</p>` : ""}
          ${order.payment.digitalMethod ? `<p><strong>Digital Method:</strong> ${order.payment.digitalMethod}</p>` : ""}
          ${order.payment.cashReceived !== undefined ? `<p><strong>Cash Received:</strong> ${formatMoney(order.payment.cashReceived)}</p>` : ""}
          ${order.payment.changeDue !== undefined ? `<p><strong>Change Due:</strong> ${formatMoney(order.payment.changeDue)}</p>` : ""}
        ` : ""}
      </div>
    `).join("")}
  `;
}

window.saveDay = async function () {
  const openCount = Object.keys(liveState.openOrders || {}).length;
  if (openCount > 0) {
    const proceed = confirm(`There are still ${openCount} open orders. Save day anyway and archive them too?`);
    if (!proceed) return;
  }

  const combined = totalsFromOrders(getCombinedPaidAndHanded());
  const payload = {
    label: todayLabel(),
    createdAt: Date.now(),
    openOrders: clone(liveState.openOrders || {}),
    paidOrders: clone(liveState.paidOrders || {}),
    handedOutOrders: clone(liveState.handedOutOrders || {}),
    totals: combined
  };

  await set(ref(db, `days/${todayKey()}`), payload);
  await set(ref(db, "live/openOrders"), {});
  await set(ref(db, "live/paidOrders"), {});
  await set(ref(db, "live/handedOutOrders"), {});
  await set(ref(db, "live/meta/nextOrderNumber"), 1);

  draftItems = [];
  builder = { category: null, data: {} };
  editingDraftIndex = null;
  editingOpenOrderKey = null;
  renderBuilder();
  renderReview();
  renderDraft();
  alert("Day saved.");
};

window.resetDay = async function () {
  const proceed = confirm("Reset today without saving?");
  if (!proceed) return;

  await set(ref(db, "live/openOrders"), {});
  await set(ref(db, "live/paidOrders"), {});
  await set(ref(db, "live/handedOutOrders"), {});
  await set(ref(db, "live/meta/nextOrderNumber"), 1);

  draftItems = [];
  builder = { category: null, data: {} };
  editingDraftIndex = null;
  editingOpenOrderKey = null;
  renderBuilder();
  renderReview();
  renderDraft();
  alert("Day reset.");
};

function attachLiveListeners() {
  onValue(ref(db, "live/meta"), snap => {
    liveState.meta = snap.val() || { nextOrderNumber: 1 };
    renderScreen();
  });

  onValue(ref(db, "live/openOrders"), snap => {
    liveState.openOrders = snap.val() || {};
    renderScreen();
  });

  onValue(ref(db, "live/paidOrders"), snap => {
    liveState.paidOrders = snap.val() || {};
    renderScreen();
  });

  onValue(ref(db, "live/handedOutOrders"), snap => {
    liveState.handedOutOrders = snap.val() || {};
    renderScreen();
  });

  onValue(ref(db, "days"), snap => {
    liveState.days = snap.val() || {};
    renderScreen();
  });
}

attachLiveListeners();
renderScreen();
