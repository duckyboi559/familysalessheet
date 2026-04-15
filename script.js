
 // Import the functions you need from the SDKs you need 
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js"; 
import {
  getDatabase,
  ref,
  push,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use 
// https://firebase.google.com/docs/web/setup#available-libraries 
// Your web app's Firebase configuration 
const firebaseConfig = { 
apiKey: "AIzaSyDMhniulSEmiIWoXzwJy6zVSOZkHELhfLc", 
authDomain: "family-sales.firebaseapp.com", 
databaseURL: "https://family-sales-default-rtdb.firebaseio.com", 
projectId: "family-sales", 
storageBucket: "family-sales.firebasestorage.app", 
 messagingSenderId: "590845027956", 
appId: "1:590845027956:web:676df074fe6150e8d39321" 

 }; 
// Initialize Firebase 

 

  const app = initializeApp(firebaseConfig); 
const db = getDatabase(app);
 


const REGULAR_FLAVORS = [
  "Blackberry", "Blue Raspberry", "Cherry", "Coconut", "Dragon Fruit",
  "Green Apple", "Lychee", "Mango", "Passion Fruit", "Peach",
  "Pineapple", "Pomegranate", "Raspberry", "Strawberry", "Vanilla", "Watermelon"
];

const SPECIALTY_DRINKS = [
  "Cali Sunset",
  "Cherry Limeade",
  "Cherry Bomb",
  "Fun Dip",
  "Green Apple",
  "Lychee Berry Twist",
  "Mango Tajin",
  "Melon Berry",
  "Marry Me",
  "Mr. Dill",
  "Pink Paradise",
  "Peachy Pop Explosion",
  "Peachy Princess",
  "Shark Attack",
  "Shimmer Berry Bliss",
  "Strawberry Bliss",
  "Triple Berry Blast",
  "Watermelon Lychee Splash"
];

const SF_DRINKS = [
  "Coconut SF",
  "Mango SF",
  "Peach SF",
  "Strawberry SF",
  "Watermelon SF"
];

const CREAMY_DRINKS = [
  "Blue Cream Dream",
  "Brazilian Limeade",
  "Cherries & Cream",
  "Mango Dragon Splash",
  "Peaches & Cream",
  "Piña Colada",
  "Pink Dragon",
  "Strawberries & Cream"
];

const STACKED_BUILDS = [
  "Classic #1",
  "Classic #2",
  "Churro Overload",
  "Oreo Banana Dulce",
  "Dubai Chocolate",
  "Oreo Overload",
  "Tres Leches",
  "S'mores"
];

const TOPPINGS = [
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

const DRIZZLES = [
  "Cajeta",
  "Lechera",
  "Nutella",
  "Syrup",
  "Strawberry",
  "Hershey"
];

const FRUITS = [
  "Strawberries",
  "Bananas"
];

const STORAGE_KEY = "family_builder_pos_v4_final";

let state = loadState();

let builder = {
  category: null,
  data: {}
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        orderItems: [],
        ownerTotals: { adrian: 0, nana: 0, mom: 0 },
        cashTotal: 0,
        digitalTotal: 0,
        paidOrders: [],
        savedDays: [],
        nextOrderNumber: 1
      };
    }

    const parsed = JSON.parse(raw);
    return {
      orderItems: parsed.orderItems || [],
      ownerTotals: parsed.ownerTotals || { adrian: 0, nana: 0, mom: 0 },
      cashTotal: parsed.cashTotal || 0,
      digitalTotal: parsed.digitalTotal || 0,
      paidOrders: parsed.paidOrders || [],
      savedDays: parsed.savedDays || [],
      nextOrderNumber: parsed.nextOrderNumber || 1
    };
  } catch {
    return {
      orderItems: [],
      ownerTotals: { adrian: 0, nana: 0, mom: 0 },
      cashTotal: 0,
      digitalTotal: 0,
      paidOrders: [],
      savedDays: [],
      nextOrderNumber: 1
    };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatMoney(n) {
  return `$${Number(n).toFixed(2)}`;
}

function playTap() {
  try {
    const audio = new Audio("sounds/tap.mp3");
    audio.play().catch(() => {});
  } catch {}
}

function escapeForSingleQuote(str) {
  return String(str)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'");
}

function startBuilder(category) {
  builder = { category, data: {} };
  renderBuilder();
  renderReview();
  playTap();
}

function clearBuilder() {
  builder = { category: null, data: {} };
  renderBuilder();
  renderReview();
}

function setBuilderValue(key, value) {
  builder.data[key] = value;
  renderBuilder();
  renderReview();
  playTap();
}

function toggleBuilderArrayValue(key, value, maxCount = null) {
  if (!builder.data[key]) builder.data[key] = [];
  const arr = builder.data[key];
  const idx = arr.indexOf(value);

  if (idx >= 0) {
    arr.splice(idx, 1);
  } else {
    if (maxCount && arr.length >= maxCount) return;
    arr.push(value);
  }

  renderBuilder();
  renderReview();
  playTap();
}

function isSelected(key, value) {
  return builder.data[key] === value;
}

function isSelectedInArray(key, value) {
  return Array.isArray(builder.data[key]) && builder.data[key].includes(value);
}

function renderChoiceButtons(items, key, isArray = false, maxCount = null) {
  return `
    <div class="choice-grid">
      ${items.map(item => {
        const safeItem = escapeForSingleQuote(item);
        const selectedClass = isArray
          ? (isSelectedInArray(key, item) ? "selected" : "")
          : (isSelected(key, item) ? "selected" : "");

        const clickCode = isArray
          ? `toggleBuilderArrayValue('${key}', '${safeItem}', ${maxCount === null ? "null" : maxCount})`
          : `setBuilderValue('${key}', '${safeItem}')`;

        return `
          <button
            type="button"
            class="choice-btn ${selectedClass}"
            onclick="${clickCode}"
          >
            ${item}
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderBuilder() {
  const stage = document.getElementById("builderStage");
  if (!stage) return;

  if (!builder.category) {
    stage.innerHTML = "<p>Pick a category to begin.</p>";
    return;
  }

  if (builder.category === "hotdog") {
    stage.innerHTML = `
      <h3>Hotdogs</h3>
      <p class="helper">Pick one item.</p>
      ${renderChoiceButtons(["Bacon Dog", "Quack Attack", "Asada Fries"], "hotdogType")}
    `;
    return;
  }

  if (builder.category === "combo") {
    stage.innerHTML = `
      <h3>Combos</h3>
      ${renderChoiceButtons([
        "#1 Classic + Hotdog",
        "#1 Speciality + Hotdog",
        "#2 Classic + Bite Stack",
        "#2 Speciality + Bite Stack"
      ], "comboType")}
    `;
    return;
  }

  if (builder.category === "lemonade") {
    let html = `
      <h3>Lemonade</h3>
      <h4>1. Choose type</h4>
      ${renderChoiceButtons([
        "Classic",
        "Flavor",
        "Specialty",
        "Sugar Free",
        "Creamy",
        "Red Bull",
        "64oz Classic",
        "64oz Specialty"
      ], "lemonadeType")}
    `;

    const type = builder.data.lemonadeType;

    if (type === "Flavor") {
      html += `
        <h4>2. Choose flavor</h4>
        ${renderChoiceButtons(REGULAR_FLAVORS, "flavorName")}
      `;
    }

    if (type === "Specialty") {
      html += `
        <h4>2. Choose specialty</h4>
        ${renderChoiceButtons(SPECIALTY_DRINKS, "specialtyName")}
      `;
    }

    if (type === "64oz Specialty") {
      html += `
        <h4>2. Choose 64oz specialty</h4>
        ${renderChoiceButtons(SPECIALTY_DRINKS, "specialty64Name")}
      `;
    }

    if (type === "Sugar Free") {
      html += `
        <h4>2. Choose sugar free flavor</h4>
        ${renderChoiceButtons(SF_DRINKS, "sfName")}
      `;
    }

    if (type === "Creamy") {
      html += `
        <h4>2. Choose creamy drink</h4>
        ${renderChoiceButtons(CREAMY_DRINKS, "creamyName")}
      `;
    }

    if (type === "Red Bull") {
      html += `
        <h4>2. Choose flavor</h4>
        ${renderChoiceButtons(REGULAR_FLAVORS, "redBullFlavor")}
      `;
    }

    if (type) {
      html += `
        <h4>3. Add-ons</h4>
        ${renderChoiceButtons(["Boba +$1", "Creamy +$1"], "lemonadeAddons", true)}
      `;
    }

    stage.innerHTML = html;
    return;
  }

  if (builder.category === "pancake") {
    let html = `
      <h3>Mini Pancakes</h3>
      <h4>1. Choose type</h4>
      ${renderChoiceButtons(["Stack'd", "Your Way", "Bite Stack", "Dubai Strawberries"], "pancakeMode")}
    `;

    const mode = builder.data.pancakeMode;

    if (mode === "Stack'd") {
      html += `
        <h4>2. Choose size</h4>
        ${renderChoiceButtons(["20", "25", "30"], "stackedSize")}
      `;

      if (builder.data.stackedSize) {
        html += `
          <h4>3. Choose build</h4>
          ${renderChoiceButtons(STACKED_BUILDS, "stackedBuild")}
        `;
      }
    }

    if (mode === "Your Way") {
      html += `
        <h4>2. Choose size</h4>
        ${renderChoiceButtons(["20", "25", "30"], "yourWaySize")}
      `;

      if (builder.data.yourWaySize) {
        html += `
          <h4>3. Pick up to 2 toppings</h4>
          ${renderChoiceButtons(TOPPINGS, "yourWayToppings", true, 2)}
          <h4>4. Pick 1 drizzle</h4>
          ${renderChoiceButtons(DRIZZLES, "yourWayDrizzle")}
          <h4>5. Pick 1 fruit</h4>
          ${renderChoiceButtons(FRUITS, "yourWayFruit")}
        `;
      }
    }

    if (mode === "Bite Stack") {
      html += `
        <h4>2. Pick 1 topping</h4>
        ${renderChoiceButtons(TOPPINGS, "biteTopping")}
        <h4>3. Pick 1 drizzle</h4>
        ${renderChoiceButtons(DRIZZLES, "biteDrizzle")}
        <h4>4. Pick 1 fruit</h4>
        ${renderChoiceButtons(FRUITS, "biteFruit")}
      `;
    }

    stage.innerHTML = html;
  }
}

function buildReviewObject() {
  if (!builder.category) return null;

  if (builder.category === "hotdog") {
    const type = builder.data.hotdogType;
    if (!type) return null;

    if (type === "Bacon Dog") return { name: "Bacon Dog", price: 5, split: { adrian: 5 }, details: ["Hotdog"] };
    if (type === "Quack Attack") return { name: "Quack Attack", price: 6, split: { adrian: 6 }, details: ["Hotdog"] };
    if (type === "Asada Fries") return { name: "Asada Fries", price: 10, split: { adrian: 10 }, details: ["Hotdog"] };
  }

  if (builder.category === "combo") {
    const combo = builder.data.comboType;
    if (!combo) return null;

    if (combo === "#1 Classic + Hotdog") return { name: combo, price: 10, split: { adrian: 5, nana: 5 }, details: [combo] };
    if (combo === "#1 Speciality + Hotdog") return { name: combo, price: 12, split: { adrian: 5, nana: 7 }, details: [combo] };
    if (combo === "#2 Classic + Bite Stack") return { name: combo, price: 10, split: { mom: 5, nana: 5 }, details: [combo] };
    if (combo === "#2 Speciality + Bite Stack") return { name: combo, price: 12, split: { mom: 5, nana: 7 }, details: [combo] };
  }

  if (builder.category === "lemonade") {
    const type = builder.data.lemonadeType;
    if (!type) return null;

    let name = "";
    let price = 0;
    let details = [];
    let split = { nana: 0 };

    if (type === "Classic") {
      name = "Classic Lemonade";
      price = 6;
      details = ["Classic"];
      split.nana = 6;
    } else if (type === "Flavor") {
      if (!builder.data.flavorName) return null;
      name = `${builder.data.flavorName} Lemonade`;
      price = 7;
      details = ["Flavor", builder.data.flavorName];
      split.nana = 7;
    } else if (type === "Specialty") {
      if (!builder.data.specialtyName) return null;
      name = builder.data.specialtyName;
      price = 8;
      details = ["Specialty", builder.data.specialtyName];
      split.nana = 8;
    } else if (type === "64oz Specialty") {
      if (!builder.data.specialty64Name) return null;
      name = `64oz ${builder.data.specialty64Name}`;
      price = 15;
      details = ["64oz Specialty", builder.data.specialty64Name];
      split.nana = 15;
    } else if (type === "Sugar Free") {
      if (!builder.data.sfName) return null;
      name = builder.data.sfName;
      price = 7;
      details = ["Sugar Free", builder.data.sfName];
      split.nana = 7;
    } else if (type === "Creamy") {
      if (!builder.data.creamyName) return null;
      name = builder.data.creamyName;
      price = 7;
      details = ["Creamy", builder.data.creamyName];
      split.nana = 7;
    } else if (type === "Red Bull") {
      if (!builder.data.redBullFlavor) return null;
      name = `${builder.data.redBullFlavor} Red Bull`;
      price = 9;
      details = ["Red Bull", builder.data.redBullFlavor];
      split.nana = 9;
    } else if (type === "64oz Classic") {
      name = "64oz Classic Lemonade";
      price = 10;
      details = ["64oz Classic"];
      split.nana = 10;
    }

    const addons = builder.data.lemonadeAddons || [];
    addons.forEach(addon => {
      if (addon === "Boba +$1") {
        price += 1;
        split.nana += 1;
      }
      if (addon === "Creamy +$1") {
        price += 1;
        split.nana += 1;
      }
    });

    if (addons.length) details.push(...addons);
    return { name, price, split, details };
  }

  if (builder.category === "pancake") {
    const mode = builder.data.pancakeMode;
    if (!mode) return null;

    if (mode === "Dubai Strawberries") {
      return {
        name: "Dubai Strawberries",
        price: 12,
        split: { mom: 12 },
        details: ["Dubai Strawberries"]
      };
    }

    if (mode === "Stack'd") {
      const size = builder.data.stackedSize;
      const build = builder.data.stackedBuild;
      if (!size || !build) return null;

      const priceMap = { "20": 10, "25": 12, "30": 15 };
      return {
        name: `${size} Stack'd - ${build}`,
        price: priceMap[size],
        split: { mom: priceMap[size] },
        details: ["Stack'd", `${size} minis`, build]
      };
    }

    if (mode === "Your Way") {
      const size = builder.data.yourWaySize;
      const toppings = builder.data.yourWayToppings || [];
      const drizzle = builder.data.yourWayDrizzle;
      const fruit = builder.data.yourWayFruit;
      if (!size || toppings.length === 0 || !drizzle || !fruit) return null;

      const priceMap = { "20": 8, "25": 10, "30": 12 };
      return {
        name: `${size} Your Way`,
        price: priceMap[size],
        split: { mom: priceMap[size] },
        details: ["Your Way", `${size} minis`, ...toppings, drizzle, fruit]
      };
    }

    if (mode === "Bite Stack") {
      const topping = builder.data.biteTopping;
      const drizzle = builder.data.biteDrizzle;
      const fruit = builder.data.biteFruit;
      if (!topping || !drizzle || !fruit) return null;

      return {
        name: "Bite Stack",
        price: 5,
        split: { mom: 5 },
        details: ["10 minis", topping, drizzle, fruit]
      };
    }
  }

  return null;
}

function renderReview() {
  const card = document.getElementById("reviewCard");
  if (!card) return;

  const review = buildReviewObject();
  if (!review) {
    card.innerHTML = "<p>No item being built yet.</p>";
    return;
  }

  card.innerHTML = `
    <p><strong>${review.name}</strong></p>
    ${review.details.map(d => `<p>${d}</p>`).join("")}
    <p><strong>Price:</strong> ${formatMoney(review.price)}</p>
  `;
}

function addBuiltItemToOrder() {
  const review = buildReviewObject();
  if (!review) {
    alert("Finish building the item first.");
    return;
  }

  state.orderItems.push(review);
  saveState();
  clearBuilder();
  updateUI();
  playTap();
}

function getOrderSplit() {
  const split = { adrian: 0, nana: 0, mom: 0 };
  state.orderItems.forEach(item => {
    split.adrian += item.split.adrian || 0;
    split.nana += item.split.nana || 0;
    split.mom += item.split.mom || 0;
  });
  return split;
}

function removeOrderItem(index) {
  state.orderItems.splice(index, 1);
  saveState();
  updateUI();
}

function editOrderItem(index) {
  const item = state.orderItems[index];
  if (!item) return;

  const newPriceInput = prompt(`Edit price for "${item.name}"`, item.price);
  if (newPriceInput === null) return;

  const newPrice = Number(newPriceInput);
  if (Number.isNaN(newPrice) || newPrice <= 0) {
    alert("Invalid price.");
    return;
  }

  const oldSplitTotal =
    (item.split.adrian || 0) +
    (item.split.nana || 0) +
    (item.split.mom || 0);

  if (oldSplitTotal > 0) {
    const ratio = newPrice / oldSplitTotal;
    item.split = {
      adrian: Number(((item.split.adrian || 0) * ratio).toFixed(2)),
      nana: Number(((item.split.nana || 0) * ratio).toFixed(2)),
      mom: Number(((item.split.mom || 0) * ratio).toFixed(2))
    };
  }

  item.price = Number(newPrice.toFixed(2));
  saveState();
  updateUI();
}

function clearOrder() {
  if (!state.orderItems.length) return;
  if (!confirm("Clear the whole order?")) return;
  state.orderItems = [];
  saveState();
  updateUI();
}

function renderOrderList() {
  const list = document.getElementById("orderList");
  if (!list) return;

  if (!state.orderItems.length) {
    list.innerHTML = "<p>No items in order yet.</p>";
    return;
  }

  list.innerHTML = state.orderItems.map((item, index) => `
    <div class="order-item">
      <div>
        <p><strong>${item.name}</strong></p>
        ${item.details.map(d => `<p>${d}</p>`).join("")}
        <p>${formatMoney(item.price)}</p>
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <button type="button" class="remove-btn" onclick="editOrderItem(${index})">Edit</button>
        <button type="button" class="remove-btn" onclick="removeOrderItem(${index})">Remove</button>
      </div>
    </div>
  `).join("");
}

function renderPaidOrders() {
  const todayOrders = document.getElementById("todayOrders");
  const lastOrderCard = document.getElementById("lastOrderCard");
  const ordersTodayCount = document.getElementById("ordersTodayCount");
  const orderNumber = document.getElementById("orderNumber");

  if (ordersTodayCount) ordersTodayCount.textContent = state.paidOrders.length;
  if (orderNumber) orderNumber.textContent = state.nextOrderNumber;

  if (!state.paidOrders.length) {
    if (todayOrders) todayOrders.innerHTML = "<p>No paid orders yet.</p>";
    if (lastOrderCard) lastOrderCard.innerHTML = "<p>No paid orders yet.</p>";
    return;
  }

  const newestFirst = [...state.paidOrders].reverse();

  if (todayOrders) {
    todayOrders.innerHTML = newestFirst.map(order => `
      <div class="paid-order">
        <h4>Order #${order.number} • ${order.time}</h4>
        ${order.items.map(item => `<p>${item.name} (${formatMoney(item.price)})</p>`).join("")}
        <p><strong>Payment:</strong> ${order.payment}</p>
        <p><strong>Total:</strong> ${formatMoney(order.total)}</p>
      </div>
    `).join("");
  }

  const last = state.paidOrders[state.paidOrders.length - 1];
  if (lastOrderCard) {
    lastOrderCard.innerHTML = `
      <h4>Order #${last.number} • ${last.time}</h4>
      ${last.items.map(item => `<p>${item.name} (${formatMoney(item.price)})</p>`).join("")}
      <p><strong>Payment:</strong> ${last.payment}</p>
      <p><strong>Total:</strong> ${formatMoney(last.total)}</p>
      <p><strong>Adrian:</strong> ${formatMoney(last.split.adrian)}</p>
      <p><strong>Nana:</strong> ${formatMoney(last.split.nana)}</p>
      <p><strong>Mom:</strong> ${formatMoney(last.split.mom)}</p>
    `;
  }
}

function repeatLastOrder() {
  if (!state.paidOrders || !state.paidOrders.length) {
    alert("No previous orders to repeat.");
    return;
  }

  const lastOrder = state.paidOrders[state.paidOrders.length - 1];

  state.orderItems = lastOrder.items.map(item => ({
    ...item,
    split: { ...item.split },
    details: Array.isArray(item.details) ? [...item.details] : []
  }));

  saveState();
  updateUI();
  playTap();
}

function updateUI() {
  renderOrderList();
  renderPaidOrders();
  renderSavedDays();

  const split = getOrderSplit();
  const total = state.orderItems.reduce((sum, item) => sum + item.price, 0);

  document.getElementById("adrianSplit").textContent = formatMoney(split.adrian);
  document.getElementById("nanaSplit").textContent = formatMoney(split.nana);
  document.getElementById("momSplit").textContent = formatMoney(split.mom);
  document.getElementById("orderTotal").textContent = formatMoney(total);

  document.getElementById("adrianTotal").textContent = formatMoney(state.ownerTotals.adrian);
  document.getElementById("nanaTotal").textContent = formatMoney(state.ownerTotals.nana);
  document.getElementById("momTotal").textContent = formatMoney(state.ownerTotals.mom);
  document.getElementById("cashTotal").textContent = formatMoney(state.cashTotal);
  document.getElementById("digitalTotal").textContent = formatMoney(state.digitalTotal);
  document.getElementById("dayTotal").textContent = formatMoney(state.cashTotal + state.digitalTotal);
}

function savePaidOrder(paymentLabel, cash, digital, split, total) {
  state.paidOrders.push({
    number: state.nextOrderNumber,
    time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    payment: paymentLabel,
    cash,
    digital,
    total,
    split: { ...split },
    items: state.orderItems.map(item => ({ ...item }))
  });
  state.nextOrderNumber += 1;
}

function finalizeCheckout(cash, digital, paymentLabel) {
  const total = state.orderItems.reduce((sum, item) => sum + item.price, 0);
  if (total === 0) {
    alert("No items in order.");
    return;
  }

  if (Math.abs((cash + digital) - total) > 0.009) {
    alert("Payments do not match order total.");
    return;
  }

  const split = getOrderSplit();

  state.ownerTotals.adrian += split.adrian;
  state.ownerTotals.nana += split.nana;
  state.ownerTotals.mom += split.mom;
  state.cashTotal += cash;
  state.digitalTotal += digital;

  savePaidOrder(paymentLabel, cash, digital, split, total);

  state.orderItems = [];
  saveState();
  updateUI();
  playTap();
}

function checkoutOrder(method) {
  const total = state.orderItems.reduce((sum, item) => sum + item.price, 0);
  if (total === 0) {
    alert("No items in order.");
    return;
  }

  if (method === "cash") {
    finalizeCheckout(total, 0, "Cash");
  } else {
    finalizeCheckout(0, total, "Digital");
  }
}

function checkoutSplitHalf() {
  const total = state.orderItems.reduce((sum, item) => sum + item.price, 0);
  if (total === 0) {
    alert("No items in order.");
    return;
  }

  const cash = Number((total / 2).toFixed(2));
  const digital = Number((total - cash).toFixed(2));
  finalizeCheckout(cash, digital, "Split 50/50");
}

function checkoutSplitCustom() {
  const total = state.orderItems.reduce((sum, item) => sum + item.price, 0);
  if (total === 0) {
    alert("No items in order.");
    return;
  }

  const input = prompt(`Order total is ${formatMoney(total)}. Enter CASH amount:`);
  if (input === null) return;

  const cash = Number(input);
  if (Number.isNaN(cash) || cash < 0 || cash > total) {
    alert("Invalid cash amount.");
    return;
  }

  const digital = Number((total - cash).toFixed(2));
  finalizeCheckout(Number(cash.toFixed(2)), digital, "Split Custom");
}

function saveDay() {
  const totalToday = state.cashTotal + state.digitalTotal;

  if (totalToday === 0 && state.paidOrders.length === 0) {
    alert("Nothing to save yet.");
    return;
  }

  state.savedDays.push({
    date: new Date().toLocaleDateString(),
    adrian: state.ownerTotals.adrian,
    nana: state.ownerTotals.nana,
    mom: state.ownerTotals.mom,
    cash: state.cashTotal,
    digital: state.digitalTotal,
    total: totalToday,
    ordersCount: state.paidOrders.length
  });

  state.orderItems = [];
  state.ownerTotals = { adrian: 0, nana: 0, mom: 0 };
  state.cashTotal = 0;
  state.digitalTotal = 0;
  state.paidOrders = [];
  state.nextOrderNumber = 1;

  saveState();
  updateUI();

  alert("Day saved.");
}

function resetDay() {
  const hasAnything =
    state.orderItems.length > 0 ||
    state.paidOrders.length > 0 ||
    state.cashTotal > 0 ||
    state.digitalTotal > 0;

  if (!hasAnything) {
    alert("Nothing to reset.");
    return;
  }

  const confirmReset = confirm("Reset today without saving?");
  if (!confirmReset) return;

  state.orderItems = [];
  state.ownerTotals = { adrian: 0, nana: 0, mom: 0 };
  state.cashTotal = 0;
  state.digitalTotal = 0;
  state.paidOrders = [];
  state.nextOrderNumber = 1;

  saveState();
  updateUI();

  alert("Day reset.");
}

function renderSavedDays() {
  const box = document.getElementById("previousDays");
  if (!box) return;

  if (!state.savedDays || !state.savedDays.length) {
    box.innerHTML = "<p>No saved days yet.</p>";
    return;
  }

  box.innerHTML = [...state.savedDays].reverse().map(day => `
    <div class="paid-order">
      <h4>${day.date}</h4>
      <p><strong>Adrian:</strong> ${formatMoney(day.adrian)}</p>
      <p><strong>Nana:</strong> ${formatMoney(day.nana)}</p>
      <p><strong>Mom:</strong> ${formatMoney(day.mom)}</p>
      <p><strong>Cash:</strong> ${formatMoney(day.cash)}</p>
      <p><strong>Digital:</strong> ${formatMoney(day.digital)}</p>
      <p><strong>Total:</strong> ${formatMoney(day.total)}</p>
      <p><strong>Orders:</strong> ${day.ordersCount}</p>
    </div>
  `).join("");
}

renderBuilder();
renderReview();
updateUI();
const liveTestRef = ref(db, "liveTest/message");

window.writeLiveTest = function () {
  set(liveTestRef, {
    text: "Hello from Firebase",
    updatedAt: Date.now()
  });
};
function watchLiveTest() {
  onValue(liveTestRef, (snapshot) => {
    const data = snapshot.val();
    console.log("LIVE TEST:", data);
  });
}

watchLiveTest();
