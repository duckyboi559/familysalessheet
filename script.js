const ITEMS = {
  baconDog: { name: "Bacon Dog", price: 5, split: { adrian: 5 } },
  quackAttack: { name: "Quack Attack", price: 6, split: { adrian: 6 } },
  asadaFries: { name: "Asada Fries", price: 10, split: { adrian: 10 } },

  classicLemonade: { name: "Classic Lemonade", price: 6, split: { nana: 6 } },
  specialityLemonade: { name: "Speciality Lemonade", price: 8, split: { nana: 8 } },
  redbullLemonade: { name: "Red Bull Lemonade", price: 9, split: { nana: 9 } },
  classic64: { name: "64oz Classic", price: 10, split: { nana: 10 } },
  speciality64: { name: "64oz Speciality", price: 15, split: { nana: 15 } },
  lemonadeFlavorAdd: { name: "Flavor +$1", price: 1, split: { nana: 1 } },
  lemonadeBobaAdd: { name: "Boba +$1", price: 1, split: { nana: 1 } },
  lemonadeCreamyAdd: { name: "Creamy +$1", price: 1, split: { nana: 1 } },

  stack20: { name: "20 Stack’d", price: 10, split: { mom: 10 } },
  stack25: { name: "25 Stack’d", price: 12, split: { mom: 12 } },
  stack30: { name: "30 Stack’d", price: 15, split: { mom: 15 } },
  your20: { name: "20 Your Way", price: 8, split: { mom: 8 } },
  your25: { name: "25 Your Way", price: 10, split: { mom: 10 } },
  your30: { name: "30 Your Way", price: 12, split: { mom: 12 } },
  biteSize: { name: "Bite Stack", price: 5, split: { mom: 5 } },
  dubaiStrawberries: { name: "Dubai Strawberries", price: 12, split: { mom: 12 } },

  combo1ClassicHotdog: { name: "#1 Classic + Hotdog", price: 10, split: { adrian: 5, nana: 5 } },
  combo1SpecialityHotdog: { name: "#1 Speciality + Hotdog", price: 12, split: { adrian: 5, nana: 7 } },
  combo2ClassicBite: { name: "#2 Classic + Bite Stack", price: 10, split: { mom: 5, nana: 5 } },
  combo2SpecialityBite: { name: "#2 Speciality + Bite Stack", price: 12, split: { mom: 5, nana: 7 } }
};

const ITEM_IDS = Object.keys(ITEMS);
const STORAGE_KEY = "familyPosStateV3";
const tapSound = new Audio("sounds/tap.mp3");
tapSound.preload = "auto";

let state = loadState();

function createEmptyCounts() {
  const counts = {};
  ITEM_IDS.forEach((id) => {
    counts[id] = 0;
  });
  return counts;
}

function createEmptyOwnerTotals() {
  return {
    adrian: 0,
    nana: 0,
    mom: 0
  };
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return {
      currentOrder: createEmptyCounts(),
      todayCash: 0,
      todayDigital: 0,
      history: [],
      actionStack: [],
      ownerTotals: createEmptyOwnerTotals(),
      ownerSoldCounts: createEmptyCounts()
    };
  }

  const saved = JSON.parse(raw);

  return {
    currentOrder: { ...createEmptyCounts(), ...(saved.currentOrder || {}) },
    todayCash: Number(saved.todayCash) || 0,
    todayDigital: Number(saved.todayDigital) || 0,
    history: Array.isArray(saved.history) ? saved.history : [],
    actionStack: Array.isArray(saved.actionStack) ? saved.actionStack : [],
    ownerTotals: {
      adrian: Number(saved.ownerTotals?.adrian) || 0,
      nana: Number(saved.ownerTotals?.nana) || 0,
      mom: Number(saved.ownerTotals?.mom) || 0
    },
    ownerSoldCounts: { ...createEmptyCounts(), ...(saved.ownerSoldCounts || {}) }
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatMoney(amount) {
  return `$${amount.toFixed(2)}`;
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getTodayLabel() {
  return new Date().toLocaleDateString();
}

function getOrderSubtotal() {
  return ITEM_IDS.reduce((sum, id) => sum + state.currentOrder[id] * ITEMS[id].price, 0);
}

function getOrderItemCount() {
  return ITEM_IDS.reduce((sum, id) => sum + state.currentOrder[id], 0);
}

function getTodaySales() {
  return state.todayCash + state.todayDigital;
}

function getTodayItems() {
  return ITEM_IDS.reduce((sum, id) => sum + state.ownerSoldCounts[id], 0);
}

function playTapSound() {
  tapSound.currentTime = 0;
  tapSound.play().catch(() => {});
}

function vibrateTap() {
  if ("vibrate" in navigator) navigator.vibrate(25);
}

function showFloatMoney(tileEl, amount) {
  if (!tileEl) return;
  const bubble = document.createElement("div");
  bubble.className = "float-money";
  bubble.textContent = `+$${amount}`;
  tileEl.appendChild(bubble);
  setTimeout(() => bubble.remove(), 900);
}

function animateTile(tileEl) {
  if (!tileEl) return;
  tileEl.classList.remove("pop");
  void tileEl.offsetWidth;
  tileEl.classList.add("pop");
}

function getCurrentOrderSplit() {
  const split = createEmptyOwnerTotals();

  ITEM_IDS.forEach((id) => {
    const qty = state.currentOrder[id];
    const itemSplit = ITEMS[id].split;

    Object.keys(itemSplit).forEach((owner) => {
      split[owner] += itemSplit[owner] * qty;
    });
  });

  return split;
}

function renderOrderList() {
  const orderList = document.getElementById("orderList");
  if (!orderList) return;

  if (getOrderSubtotal() === 0) {
    orderList.innerHTML = `<div class="empty-order"><span>No items yet</span><span>Tap a box</span></div>`;
    return;
  }

  orderList.innerHTML = ITEM_IDS
    .filter((id) => state.currentOrder[id] > 0)
    .map((id) => {
      const qty = state.currentOrder[id];
      const total = qty * ITEMS[id].price;
      return `
        <div class="order-item-row">
          <span>${ITEMS[id].name} x${qty}</span>
          <strong>${formatMoney(total)}</strong>
        </div>
      `;
    })
    .join("");
}

function getLast7DaysEntries() {
  const entries = [...state.history];
  const todayKey = getTodayKey();
  const hasTodaySaved = entries.some((entry) => entry.dateKey === todayKey);

  if (!hasTodaySaved && getTodaySales() > 0) {
    entries.push(buildDaySummary());
  }

  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - 6);

  return entries.filter((entry) => new Date(entry.dateKey + "T00:00:00") >= cutoff);
}

function renderWeeklyStats() {
  const weekEntries = getLast7DaysEntries();
  const weeklySales = weekEntries.reduce((sum, entry) => sum + (entry.grandTotal || 0), 0);

  const aggregate = {};
  ITEM_IDS.forEach((id) => {
    aggregate[id] = 0;
  });

  weekEntries.forEach((entry) => {
    ITEM_IDS.forEach((id) => {
      aggregate[id] += Number(entry.itemCounts?.[id] || 0);
    });
  });

  let bestId = null;
  let bestCount = 0;

  ITEM_IDS.forEach((id) => {
    if (aggregate[id] > bestCount) {
      bestCount = aggregate[id];
      bestId = id;
    }
  });

  const weeklySalesEl = document.getElementById("weeklySales");
  const weeklyTopSellerEl = document.getElementById("weeklyTopSeller");

  if (weeklySalesEl) weeklySalesEl.textContent = formatMoney(weeklySales);
  if (weeklyTopSellerEl) weeklyTopSellerEl.textContent = bestId ? `${ITEMS[bestId].name} (${bestCount})` : "None yet";
}

function renderHistory() {
  const historyList = document.getElementById("historyList");
  if (!historyList) return;

  if (state.history.length === 0) {
    historyList.innerHTML = "<p>No saved days yet.</p>";
    return;
  }

  historyList.innerHTML = [...state.history].reverse().map((day) => `
    <div class="history-entry">
      <h3>${day.displayDate}</h3>
      <p><strong>Adrian:</strong> ${formatMoney(day.ownerTotals.adrian)}</p>
      <p><strong>Nana:</strong> ${formatMoney(day.ownerTotals.nana)}</p>
      <p><strong>Mom:</strong> ${formatMoney(day.ownerTotals.mom)}</p>
      <p><strong>Cash:</strong> ${formatMoney(day.cash)}</p>
      <p><strong>Digital:</strong> ${formatMoney(day.digital)}</p>
      <p><strong>Total Items:</strong> ${day.totalItems}</p>
      <p><strong>Total Sales:</strong> ${formatMoney(day.grandTotal)}</p>
    </div>
  `).join("");
}

function updateScreen() {
  const split = getCurrentOrderSplit();

  const ids = {
    orderItems: document.getElementById("orderItems"),
    orderSubtotal: document.getElementById("orderSubtotal"),
    todaySales: document.getElementById("todaySales"),
    cashTotal: document.getElementById("cashTotal"),
    digitalTotal: document.getElementById("digitalTotal"),
    todayItems: document.getElementById("todayItems"),
    adrianTotal: document.getElementById("adrianTotal"),
    nanaTotal: document.getElementById("nanaTotal"),
    momTotal: document.getElementById("momTotal"),
    currentAdrianSplit: document.getElementById("currentAdrianSplit"),
    currentNanaSplit: document.getElementById("currentNanaSplit"),
    currentMomSplit: document.getElementById("currentMomSplit"),
    todayDate: document.getElementById("todayDate")
  };

  if (ids.orderItems) ids.orderItems.textContent = getOrderItemCount();
  if (ids.orderSubtotal) ids.orderSubtotal.textContent = formatMoney(getOrderSubtotal());
  if (ids.todaySales) ids.todaySales.textContent = formatMoney(getTodaySales());
  if (ids.cashTotal) ids.cashTotal.textContent = formatMoney(state.todayCash);
  if (ids.digitalTotal) ids.digitalTotal.textContent = formatMoney(state.todayDigital);
  if (ids.todayItems) ids.todayItems.textContent = getTodayItems();
  if (ids.adrianTotal) ids.adrianTotal.textContent = formatMoney(state.ownerTotals.adrian);
  if (ids.nanaTotal) ids.nanaTotal.textContent = formatMoney(state.ownerTotals.nana);
  if (ids.momTotal) ids.momTotal.textContent = formatMoney(state.ownerTotals.mom);
  if (ids.currentAdrianSplit) ids.currentAdrianSplit.textContent = formatMoney(split.adrian);
  if (ids.currentNanaSplit) ids.currentNanaSplit.textContent = formatMoney(split.nana);
  if (ids.currentMomSplit) ids.currentMomSplit.textContent = formatMoney(split.mom);
  if (ids.todayDate) ids.todayDate.textContent = getTodayLabel();

  renderOrderList();
  renderWeeklyStats();
  renderHistory();
}

function addItem(itemId, tileEl) {
  state.currentOrder[itemId] += 1;
  state.actionStack.push(itemId);

  playTapSound();
  vibrateTap();
  animateTile(tileEl);
  showFloatMoney(tileEl, ITEMS[itemId].price);

  saveState();
  updateScreen();
}

function undoLastTap() {
  const last = state.actionStack.pop();
  if (!last) {
    alert("Nothing to undo.");
    return;
  }

  if (state.currentOrder[last] > 0) {
    state.currentOrder[last] -= 1;
  }

  saveState();
  updateScreen();
}

function clearCurrentOrder() {
  if (getOrderSubtotal() === 0) return;

  if (!confirm("Clear the current order?")) return;

  state.currentOrder = createEmptyCounts();
  state.actionStack = [];

  saveState();
  updateScreen();
}

function finalizeOrder(cashAmount, digitalAmount) {
  const subtotal = getOrderSubtotal();

  if (subtotal === 0) {
    alert("Tap items first.");
    return;
  }

  if (cashAmount < 0 || digitalAmount < 0) {
    alert("Payment amounts can't be negative.");
    return;
  }

  if (Math.abs((cashAmount + digitalAmount) - subtotal) > 0.009) {
    alert(`Payments must equal ${formatMoney(subtotal)}.`);
    return;
  }

  const split = getCurrentOrderSplit();

  state.ownerTotals.adrian += split.adrian;
  state.ownerTotals.nana += split.nana;
  state.ownerTotals.mom += split.mom;

  ITEM_IDS.forEach((id) => {
    state.ownerSoldCounts[id] += state.currentOrder[id];
  });

  state.todayCash += cashAmount;
  state.todayDigital += digitalAmount;

  state.currentOrder = createEmptyCounts();
  state.actionStack = [];

  saveState();
  updateScreen();
}

function checkoutOrder(method) {
  const subtotal = getOrderSubtotal();
  if (subtotal === 0) {
    alert("Tap items first.");
    return;
  }

  if (method === "cash") finalizeOrder(subtotal, 0);
  else finalizeOrder(0, subtotal);
}

function splitPaymentHalf() {
  const subtotal = getOrderSubtotal();
  if (subtotal === 0) {
    alert("Tap items first.");
    return;
  }

  const cash = Number((subtotal / 2).toFixed(2));
  const digital = Number((subtotal - cash).toFixed(2));
  finalizeOrder(cash, digital);
}

function splitPaymentCustom() {
  const subtotal = getOrderSubtotal();
  if (subtotal === 0) {
    alert("Tap items first.");
    return;
  }

  const input = prompt(`Order total is ${formatMoney(subtotal)}.\nEnter CASH amount:`);
  if (input === null) return;

  const cash = Number(input);
  if (Number.isNaN(cash)) {
    alert("Enter a valid number.");
    return;
  }

  if (cash < 0 || cash > subtotal) {
    alert(`Cash amount must be between $0 and ${subtotal.toFixed(2)}.`);
    return;
  }

  const digital = Number((subtotal - cash).toFixed(2));
  finalizeOrder(Number(cash.toFixed(2)), digital);
}

function buildDaySummary() {
  const itemCounts = {};
  ITEM_IDS.forEach((id) => {
    itemCounts[id] = state.ownerSoldCounts[id];
  });

  return {
    dateKey: getTodayKey(),
    displayDate: getTodayLabel(),
    cash: state.todayCash,
    digital: state.todayDigital,
    totalItems: getTodayItems(),
    grandTotal: getTodaySales(),
    ownerTotals: {
      adrian: state.ownerTotals.adrian,
      nana: state.ownerTotals.nana,
      mom: state.ownerTotals.mom
    },
    itemCounts
  };
}

function launchConfetti() {
  const container = document.getElementById("confettiContainer");
  if (!container) return;

  const colors = ["#ff6fa5", "#ffd166", "#7bd389", "#7aa7ff", "#ffffff"];

  for (let i = 0; i < 70; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${1100 + Math.random() * 700}ms`;
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 2000);
  }
}

function saveDay() {
  if (getOrderSubtotal() > 0) {
    if (!confirm("You still have items in the current order. Save the day anyway?")) return;
  }

  if (getTodaySales() === 0) {
    alert("No finished sales to save yet.");
    return;
  }

  const todaySummary = buildDaySummary();
  state.history = state.history.filter((entry) => entry.dateKey !== todaySummary.dateKey);
  state.history.push(todaySummary);

  state.currentOrder = createEmptyCounts();
  state.todayCash = 0;
  state.todayDigital = 0;
  state.actionStack = [];
  state.ownerTotals = createEmptyOwnerTotals();
  state.ownerSoldCounts = createEmptyCounts();

  saveState();
  updateScreen();
  launchConfetti();

  alert("Day saved and reset for tomorrow.");
}

function resetDay() {
  if (!confirm("Reset today's sales and current order without saving?")) return;

  state.currentOrder = createEmptyCounts();
  state.todayCash = 0;
  state.todayDigital = 0;
  state.actionStack = [];
  state.ownerTotals = createEmptyOwnerTotals();
  state.ownerSoldCounts = createEmptyCounts();

  saveState();
  updateScreen();
}

updateScreen();
