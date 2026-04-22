// 🔥 FIREBASE CONFIG (PUT YOURS HERE)
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  databaseURL: "YOUR_DB_URL",
  projectId: "YOUR_ID",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// DATA
let jessicaTotal = 0;
let janieTotal = 0;
let cashTotal = 0;
let digitalTotal = 0;
let currentPayment = "cash";

// MENUS (simplified for tapping)
const jessicaMenu = [
  { name: "20 Minis Built", price: 10 },
  { name: "25 Minis Built", price: 12 },
  { name: "30 Minis Built", price: 15 },
  { name: "20 Minis Your Way", price: 8 },
  { name: "25 Minis Your Way", price: 10 },
  { name: "30 Minis Your Way", price: 12 },
  { name: "Dubai Strawberries", price: 12 }
];

const janieMenu = [
  { name: "Classic Lemonade", price: 6 },
  { name: "Flavor Lemonade", price: 7 },
  { name: "Specialty Lemonade", price: 8 },
  { name: "64oz Classic", price: 10 },
  { name: "64oz Specialty", price: 12 },
  { name: "Red Bull Drink", price: 9 }
];

// RENDER
function renderMenu(menu, containerId, owner) {
  const container = document.getElementById(containerId);
  menu.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";

    const btn = document.createElement("button");
    btn.innerText = `${item.name} ($${item.price})`;
    btn.onclick = () => addItem(item.price, owner);

    div.appendChild(btn);
    container.appendChild(div);
  });
}

renderMenu(jessicaMenu, "jessicaItems", "jessica");
renderMenu(janieMenu, "janieItems", "janie");

// ADD ITEM
function addItem(price, owner) {
  if (owner === "jessica") {
    jessicaTotal += price;
  } else {
    janieTotal += price;
  }

  if (currentPayment === "cash") {
    cashTotal += price;
  } else if (currentPayment === "digital") {
    digitalTotal += price;
  } else {
    cashTotal += price / 2;
    digitalTotal += price / 2;
  }

  updateUI();
}

// PAYMENT TYPE
function setPayment(type) {
  currentPayment = type;
}

// UPDATE UI
function updateUI() {
  document.getElementById("jessicaTotal").innerText = jessicaTotal;
  document.getElementById("janieTotal").innerText = janieTotal;
  document.getElementById("cashTotal").innerText = cashTotal;
  document.getElementById("digitalTotal").innerText = digitalTotal;

  const combined = jessicaTotal + janieTotal;
  document.getElementById("combinedTotal").innerText = combined;

  const tips = Number(document.getElementById("tipsInput").value) || 0;
  document.getElementById("tipsTotal").innerText = tips;
}

// SAVE DAY
function saveDay() {
  const date = document.getElementById("datePicker").value;
  if (!date) return alert("Pick a date");

  const tips = Number(document.getElementById("tipsInput").value) || 0;

  db.ref("days/" + date).set({
    jessicaTotal,
    janieTotal,
    cashTotal,
    digitalTotal,
    tips
  });

  alert("Saved!");
  loadHistory();
}

// LOAD HISTORY
function loadHistory() {
  const history = document.getElementById("history");
  history.innerHTML = "";

  db.ref("days").once("value", snapshot => {
    snapshot.forEach(child => {
      const data = child.val();

      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <strong>${child.key}</strong><br>
        Jessica: $${data.jessicaTotal}<br>
        Janie: $${data.janieTotal}<br>
        Cash: $${data.cashTotal}<br>
        Digital: $${data.digitalTotal}<br>
        Tips: $${data.tips}
      `;

      history.appendChild(div);
    });
  });
}

loadHistory();
