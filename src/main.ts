import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;
let width = document.documentElement.clientWidth;
//let height = document.documentElement.clientHeight;

const gameName = "My Fairy game";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

// Buttons ---------------------------------------
// upgrade buttons
interface Upgrades {
  button: HTMLButtonElement;
  cost: number;
  level: number;
  auto: number;
}

const upgradeButtons: Upgrades[] = [];

// Fairy Dust Clicker
const clicker = document.createElement("button");
clicker.textContent = "🧚🏻";
let counter = 0;
clicker.addEventListener("click", () => addCounter(1));

app.appendChild(clicker);

// Auto increase 1 per second upgrade button
let autoAdd = 0;
let isIntervalRunning = false;

const autoClicker = document.createElement("button");
autoClicker.innerHTML = "Mushroom Offering (0.1/s) <br>--10 FAIRY DUST--";

upgradeButtons.push({ button: autoClicker, cost: 10, level: 0, auto: 0.1 });
// click

const upgrade = findUpgrade(autoClicker);
if (upgrade) {
  autoClicker.addEventListener("click", () => purchaseUpgrade(upgrade));
} else {
  console.error("Upgrade not found for the specified button.");
}

app.appendChild(autoClicker);
// style
autoClicker.style.position = "absolute";
position();
// disable button
disableButton(autoClicker);

// div
const dispCounter = document.createElement("div");
dispCounter.textContent = counter.toFixed(2) + " Fairy Dust";
app.appendChild(dispCounter);

// 1 second interval
//requestAnimationFrame(intervalCounter);

// functions ---------------------------------------

// add to counter and display update
function addCounter(x: number) {
  counter += x;
  dispCounter.textContent = counter.toFixed(2) + " Fairy Dust";

  // if there is enough dust for upgrade enable the button
  for (const upgrade of upgradeButtons) {
    if (counter >= upgrade.cost) {
      enableButton(upgrade.button);
    }
  }
}

// add to counter 1/fps
let lastFrame = 0;
let elaspedTime = 0;

function intervalCounter(timestamp: DOMHighResTimeStamp) {
  if (lastFrame == 0) lastFrame = timestamp;

  elaspedTime = timestamp - lastFrame;
  lastFrame = timestamp;

  if (elaspedTime > 0) {
    const fps = 1000 / elaspedTime;
    addCounter(autoAdd / fps);
  }
  requestAnimationFrame(intervalCounter);
}

setInterval(() => {
  console.log("second");
}, 1000);

function position() {
  const rect = clicker.getBoundingClientRect();
  autoClicker.style.left = `${width / 2 - autoClicker.offsetWidth / 2}px`;
  autoClicker.style.top = `${rect.top + clicker.offsetHeight * 2}px`;
}

// if window is resized change everything positions
window.addEventListener("resize", () => {
  width = document.documentElement.clientWidth;
  //height = document.documentElement.clientHeight;
  position();
});

function enableButton(button: HTMLButtonElement) {
  button.style.backgroundColor = "#f9f9f9";
  button.style.color = "#1a1a1a";
  button.style.cursor = "pointer";
}

function disableButton(button: HTMLButtonElement) {
  button.style.backgroundColor = "#d3d3d3";
  button.style.color = "#a9a9a9";
  button.style.cursor = "not-allowed";
}

function findUpgrade(button: HTMLButtonElement) {
  return upgradeButtons.find((upgrade) => upgrade.button === button);
}

function purchaseUpgrade(upgrade: Upgrades) {
  if (counter < upgrade.cost) {
    return;
  }
  addCounter(-upgrade.cost);
  upgrade.level++;
  autoAdd += upgrade.auto;

  // if auto collect hasn't started
  if (!isIntervalRunning) {
    isIntervalRunning = true;
    requestAnimationFrame(intervalCounter);
  }

  upgrade.cost *= upgrade.level + 1;
  upgrade.button.innerHTML = `Mushroom Offering (${upgrade.auto}/s) <br>--${upgrade.cost} FAIRY DUST--`;

  // check if it can be upgraded again
  if (counter < upgrade.cost) disableButton(upgrade.button);
}
