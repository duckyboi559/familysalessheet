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



  { name: "Classic Lemonade", image: "images/lemonade-box.png", price: "$6" },



  { name: "Specialty Lemonade", image: "images/lemonade-box.png", price: "$8" },



  { name: "Creamy Lemonade", image: "images/lemonade-box.png", price: "$8" },



  { name: "Sugar Free Lemonade", image: "images/lemonade-box.png", price: "$8" },



  { name: "64 oz Classic", image: "images/lemonade-box.png", price: "$10" },



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



let currentMode = null;



let state = {



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



function formatMoney(value) {



  return `$${Number(value || 0).toFixed(2)}`;



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



function totalsFromOrders(orderObj) {



  let cash = 0, cashApp = 0, applePay = 0, square = 0;



  Object.values(orderObj || {}).forEach(order => {



    const pay = order.payment || {};



    if (pay.type === "cash") cash += Number(pay.total || 0);



    if (pay.type === "digital") {



      if (pay.method === "Cash App") cashApp += Number(pay.total || 0);



      if (pay.method === "Apple Pay") applePay += Number(pay.total || 0);



      if (pay.method === "Square") square += Number(pay.total || 0);



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



  document.getElementById("menuTitle").textContent =



    mode === "order" ? "Order Menu" : currentModeTitle();



  document.getElementById("stationFeedTitle").textContent =



    mode === "order" ? "Order Feed" : `${currentModeTitle()} Feed`;



  document.getElementById("saveDateInput").value = todayDefaultInput();



  clearBuilder();



  clearDraft(false);



  renderScreen();



};



window.goModePicker = function() {



  document.getElementById("modeScreen").classList.remove("hidden");



  document.getElementById("appScreen").classList.add("hidden");



};



window.toggleReviewDay = function() {



  reviewDayVisible = !reviewDayVisible;



  document.getElementById("reviewDayPanel").classList.toggle("hidden", !reviewDayVisible);



  renderReviewDay();



};



function selectedMenuBoxes() {



  if (currentMode === "pancakes") return PANCAKE_BOXES;



  if (currentMode === "lemonade") return LEMONADE_BOXES;



  if (currentMode === "hotdogs") return HOTDOG_BOXES;



  return [...PANCAKE_BOXES, ...LEMONADE_BOXES, ...HOTDOG_BOXES];



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



      <p>Strawberries</p><p>Pistachio Cream</p><p>Chocolate Drizzle</p><p>Kataifi</p><p>Crushed Pistachio</p>



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



      if (builder.data.redbullSpecialty) html += `<div class="review-card">${SPECIALTY_DRINKS[builder.data.redbullSpecialty].map(i => `<p>${i}</p>`).join("")}</div>`;



    }



    if (builder.data.redbullType === "Creamy") {



      html += `<h4>Creamy Drink</h4>${choiceButtons(Object.keys(CREAMY_DRINKS), "redbullCreamy", false, 2)}`;



      if (builder.data.redbullCreamy) html += `<div class="review-card">${CREAMY_DRINKS[builder.data.redbullCreamy].map(i => `<p>${i}</p>`).join("")}</div>`;



    }



    if (builder.data.redbullType === "Sugar Free") {



      html += `<h4>Sugar Free Drink</h4>${choiceButtons(Object.keys(SF_DRINKS), "redbullSF", false, 2)}`;



      if (builder.data.redbullSF) html += `<div class="review-card">${SF_DRINKS[builder.data.redbullSF].map(i => `<p>${i}</p>`).join("")}</div>`;



    }



    if (



      builder.data.redbullFlavor ||



      builder.data.redbullSpecialty ||



      builder.data.redbullCreamy ||



      builder.data.redbullSF



    ) {



      html += `<h4>Quantity</h4>${choiceButtons(["1","2","3","4"], "quantity")}`;



    }



  } else if (type === "$5 Hotdog") {



    html += `<h4>Quantity</h4>${choiceButtons(["1","2","3","4","5"], "quantity")}`;



    if (builder.data.quantity) {



      html += `<h4>Toppings</h4>${choiceButtons(HOTDOG_TOPPINGS, "hotdogToppings", true)}`;



    }



  } else if (type === "$8 Combo") {



    html += `<h4>Quantity</h4>${choiceButtons(["1","2","3","4"], "quantity")}`;



    if (builder.data.quantity) {



      html += `<h4>Hotdog Toppings</h4>${choiceButtons(HOTDOG_TOPPINGS, "comboHotdogToppings", true)}`;



      html += `<div class="review-card"><p>Includes small fries</p></div>`;



    }



  } else if (type === "$10 Asada Fries") {



    html += `<h4>Quantity</h4>${choiceButtons(["1","2","3","4"], "quantity")}`;



    if (builder.data.quantity) {



      html += `<h4>Toppings</h4>${choiceButtons(FRIES_TOPPINGS, "asadaFriesToppings", true)}`;



    }



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



      category: "pancakes",



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



      category: "pancakes",



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



      category: "pancakes",



      displayName: "Dubai Strawberries",



      quantity: qty,



      unitPrice: 12,



      totalPrice: 12 * qty,



      details: ["Strawberries", "Pistachio Cream", "Chocolate Drizzle", "Kataifi", "Crushed Pistachio"],



      builderData: clone(d)



    };



  }



  if (type === "Classic Lemonade" && d.classicFlavor) {



    return {



      station: "lemonade",



      category: "lemonade",



      displayName: `${d.classicFlavor} Classic Lemonade`,



      quantity: qty,



      unitPrice: 6,



      totalPrice: 6 * qty,



      details: [`Flavor: ${d.classicFlavor}`],



      builderData: clone(d)



    };



  }



  if (type === "Specialty Lemonade" && d.specialtyDrink) {



    return {



      station: "lemonade",



      category: "lemonade",



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



      category: "lemonade",



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



      category: "lemonade",



      displayName: d.sfDrink,



      quantity: qty,



      unitPrice: 8,



      totalPrice: 8 * qty,



      details: SF_DRINKS[d.sfDrink],



      builderData: clone(d)



    };



  }



  if (type === "64 oz Classic" && d.classic64Flavor) {



    return {



      station: "lemonade",



      category: "lemonade",



      displayName: `64 oz ${d.classic64Flavor} Classic`,



      quantity: qty,



      unitPrice: 10,



      totalPrice: 10 * qty,



      details: [`Flavor: ${d.classic64Flavor}`],



      builderData: clone(d)



    };



  }



  if (type === "64 oz Specialty" && d.specialty64Drink) {



    return {



      station: "lemonade",



      category: "lemonade",



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



    }



    if (d.redbullType === "Specialty" && d.redbullSpecialty) {



      name = `${d.redbullSpecialty} Red Bull`;



      details = SPECIALTY_DRINKS[d.redbullSpecialty];



    }



    if (d.redbullType === "Creamy" && d.redbullCreamy) {



      name = `${d.redbullCreamy} Red Bull`;



      details = CREAMY_DRINKS[d.redbullCreamy];



    }



    if (d.redbullType === "Sugar Free" && d.redbullSF) {



      name = `${d.redbullSF} Red Bull`;



      details = SF_DRINKS[d.redbullSF];



    }



    if (!name) return null;



    return {



      station: "lemonade",



      category: "lemonade",



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



      category: "hotdogs",



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



      category: "hotdogs",



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



      category: "hotdogs",



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



      category: "hotdogs",



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



window.addBuiltItemToDraft = function() {



  const preview = buildPreviewItem();



  if (!preview) {



    alert("Finish building the item first.");



    return;



  }



  if (editingDraftIndex !== null) draftItems[editingDraftIndex] = preview;



  else draftItems.push(preview);



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



  const snap = await get(ref(db, `${FAMILY_PATH}/meta/nextOrderNumber`));



  const nextNumber = Number(snap.val() || 1);



  const orderRef = push(ref(db, `${FAMILY_PATH}/current/openOrders`));



  await set(orderRef, {



    orderNumber: nextNumber,



    createdAt: Date.now(),



    createdLabel: nowLabel(),



    status: "open",



    subtotal: draftItems.reduce((s, i) => s + i.totalPrice, 0),



    items: clone(draftItems)



  });



  await set(ref(db, `${FAMILY_PATH}/meta/nextOrderNumber`), nextNumber + 1);



  draftItems = [];



  builder = { data: {} };



  editingDraftIndex = null;



  renderBuilder();



  renderReview();



  renderDraft();



};



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



      ${order.payment ? `<p><strong>Payment:</strong> ${order.payment.type} ${order.payment.method || order.payment.digitalMethod || ""}</p>` : ""}



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



function stationItemsForOrder(order) {



  if (currentMode === "order") return order.items || [];



  const stationName = currentMode;



  return (order.items || []).filter(i => i.station === stationName);



}



function renderStationFeed() {



  const list = document.getElementById("stationFeedList");



  let items = [];



  if (currentMode === "order") {



    items = Object.entries(state.openOrders).flatMap(([orderKey, order]) =>



      (order.items || []).map(item => ({ orderKey, orderNumber: order.orderNumber, item }))



    );



  } else {



    items = Object.entries(state.openOrders).flatMap(([orderKey, order]) =>



      stationItemsForOrder(order).map(item => ({ orderKey, orderNumber: order.orderNumber, item }))



    );



  }



  if (!items.length) {



    list.innerHTML = `<p>No items for this station.</p>`;



    return;



  }



  list.innerHTML = items.map((entry, idx) => `



    <div class="review-card" style="margin-bottom:8px;">



      <p><strong>Order #${entry.orderNumber}</strong></p>



      <p><strong>${entry.item.displayName}</strong></p>



      <p>Qty: ${entry.item.quantity}</p>



      ${entry.item.details.map(d => `<p>${d}</p>`).join("")}



      ${currentMode !== "order" ? `<button type="button" class="primary-btn" onclick="stationDone('${entry.orderKey}', ${idx})">Done</button>` : ""}



    </div>



  `).join("");



}



window.stationDone = async function(orderKey, visibleIndex) {



  const order = state.openOrders[orderKey];



  if (!order) return;



  const filtered = currentMode === "order" ? (order.items || []) : stationItemsForOrder(order);



  const item = filtered[visibleIndex];



  if (!item) return;



  const allItems = order.items || [];



  const realIndex = allItems.findIndex(i =>



    i.displayName === item.displayName &&



    i.quantity === item.quantity &&



    JSON.stringify(i.details) === JSON.stringify(item.details)



  );



  if (realIndex === -1) return;



  const doneItem = clone(allItems[realIndex]);



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



    const paidRef = ref(db, `${FAMILY_PATH}/current/paidOrders/${orderKey}`);



    await set(paidRef, {



      ...order,



      items: [],



      status: "paid",



      paidAt: Date.now(),



      paidLabel: nowLabel(),



      payment: order.payment || { type: "station_done", total: order.subtotal }



    });



    await remove(ref(db, `${FAMILY_PATH}/current/openOrders/${orderKey}`));



  } else {



    await set(ref(db, `${FAMILY_PATH}/current/openOrders/${orderKey}`), {



      ...order,



      items: remainingItems



    });



  }



};



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



window.startCashPayment = function(orderKey) {



  const order = state.openOrders[orderKey];



  if (!order) return;



  pendingCashOrderKey = orderKey;



  document.getElementById("cashOrderTotal").textContent = formatMoney(order.subtotal);



  document.getElementById("cashGivenInput").value = "";



  document.getElementById("cashChangeOutput").textContent = formatMoney(0);



};



document.addEventListener("input", (e) => {



  if (e.target.id === "cashGivenInput") {



    const order = pendingCashOrderKey ? state.openOrders[pendingCashOrderKey] : null;



    if (!order) return;



    const given = Number(e.target.value || 0);



    const change = Math.max(given - Number(order.subtotal || 0), 0);



    document.getElementById("cashChangeOutput").textContent = formatMoney(change);



  }



});



window.confirmCashPayment = async function() {



  if (!pendingCashOrderKey) {



    alert("Choose a cash order first.");



    return;



  }



  const order = state.openOrders[pendingCashOrderKey];



  if (!order) return;



  const given = Number(document.getElementById("cashGivenInput").value || 0);



  if (given < Number(order.subtotal || 0)) {



    alert("Amount given must cover the order total.");



    return;



  }



  const change = Number((given - Number(order.subtotal || 0)).toFixed(2));



  await set(ref(db, `${FAMILY_PATH}/current/paidOrders/${pendingCashOrderKey}`), {



    ...order,



    status: "paid",



    paidAt: Date.now(),



    paidLabel: nowLabel(),



    payment: { type: "cash", total: order.subtotal, given, change }



  });



  await remove(ref(db, `${FAMILY_PATH}/current/openOrders/${pendingCashOrderKey}`));



  pendingCashOrderKey = null;



  document.getElementById("cashOrderTotal").textContent = formatMoney(0);



  document.getElementById("cashGivenInput").value = "";



  document.getElementById("cashChangeOutput").textContent = formatMoney(0);



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



  await set(ref(db, `${FAMILY_PATH}/current/paidOrders/${orderKey}`), {



    ...order,



    status: "paid",



    paidAt: Date.now(),



    paidLabel: nowLabel(),



    payment: { type: "digital", method: m, total: order.subtotal }



  });



  await remove(ref(db, `${FAMILY_PATH}/current/openOrders/${orderKey}`));



};



window.paySplit = async function(orderKey) {



  const order = state.openOrders[orderKey];



  if (!order) return;



  const cashAmount = Number(prompt(`Order total is ${formatMoney(order.subtotal)}.\nEnter CASH amount only:`));



  if (Number.isNaN(cashAmount) || cashAmount < 0 || cashAmount > Number(order.subtotal || 0)) {



    alert("Invalid cash amount.");



    return;



  }



  const digitalAmount = Number((Number(order.subtotal || 0) - cashAmount).toFixed(2));



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



    payment: { type: "split", total: order.subtotal, cashAmount, digitalAmount, digitalMethod: m }



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



};



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



  saveBtn.disabled = true;



  saveBtn.textContent = "Saving...";



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



    pendingCashOrderKey = null;



    document.getElementById("cashOrderTotal").textContent = formatMoney(0);



    document.getElementById("cashGivenInput").value = "";



    document.getElementById("cashChangeOutput").textContent = formatMoney(0);



    draftItems = [];



    builder = { data: {} };



    renderBuilder();



    renderReview();



    renderDraft();



    alert(`Day saved for ${labelFromDate(saveDate)}.`);



  } finally {



    saveBtn.disabled = false;



    saveBtn.textContent = "Save Day";



  }



};



window.resetDay = async function() {



  if (!confirm("Reset today without saving?")) return;



  await set(ref(db, `${FAMILY_PATH}/current/openOrders`), {});



  await set(ref(db, `${FAMILY_PATH}/current/paidOrders`), {});



  await set(ref(db, `${FAMILY_PATH}/current/handedOrders`), {});



  await set(ref(db, `${FAMILY_PATH}/current/reviewDay`), {});



  await set(ref(db, `${FAMILY_PATH}/meta/nextOrderNumber`), 1);



  pendingCashOrderKey = null;



  draftItems = [];



  builder = { data: {} };



  renderBuilder();



  renderReview();



  renderDraft();



};



function renderHistoryReview() {



  // not used in this first version



}



function renderCountsAndTotals() {



  const completed = allCompletedOrders();



  const totals = totalsFromOrders(completed);



  document.getElementById("dayTotal").textContent = formatMoney(totals.total);



  document.getElementById("cashTotal").textContent = formatMoney(totals.cash);



  document.getElementById("cashAppTotal").textContent = formatMoney(totals.cashApp);



  document.getElementById("applePayTotal").textContent = formatMoney(totals.applePay);



  document.getElementById("squareTotal").textContent = formatMoney(totals.square);



  document.getElementById("openCount").textContent = Object.keys(state.openOrders).length;



  document.getElementById("paidCount").textContent = Object.keys(state.paidOrders).length;



  document.getElementById("handedCount").textContent = Object.keys(state.handedOrders).length;



  document.getElementById("reviewCount").textContent = Object.keys(state.reviewDay).length;



  const allCounts = countItemsFromOrders(completed);



  document.getElementById("weekTopSeller").textContent = topLabel(getWeeklyCounts());



  document.getElementById("topSeller").textContent = topLabel(allCounts);



  document.getElementById("weekTotal").textContent = formatMoney(getWeeklyTotal());



}



function getWeeklyCounts() {



  const start = getWeekStart();



  const counts = {};



  Object.values(state.days || {}).forEach(day => {



    const d = day.savedDate ? new Date(day.savedDate + "T12:00:00") : new Date(day.createdAt || 0);



    if (d >= start) {



      Object.entries(day.itemCounts || {}).forEach(([k, v]) => {



        counts[k] = (counts[k] || 0) + v;



      });



    }



  });



  return counts;



}



function getWeeklyTotal() {



  const start = getWeekStart();



  let total = 0;



  Object.values(state.days || {}).forEach(day => {



    const d = day.savedDate ? new Date(day.savedDate + "T12:00:00") : new Date(day.createdAt || 0);



    if (d >= start) total += Number(day.totals?.total || 0);



  });



  return total;



}



function renderScreen() {



  if (!currentMode) return;



  renderBoxMenu();



  renderBuilder();



  renderReview();



  renderDraft();



  renderOpenPaidHanded();



  renderStationFeed();



  renderReviewDay();



  renderCountsAndTotals();



}



function attachListeners() {



  onValue(ref(db, `${FAMILY_PATH}/current/openOrders`), snap => {



    state.openOrders = snap.val() || {};



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



setMetaIfMissing();



attachListeners();

