import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "My Fairy game";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

// display collect interval
let autoAdd = 0;
let isIntervalRunning = false;

const curAuto = document.createElement("div");
curAuto.innerHTML = `${autoAdd.toFixed(2)} Fairy Dust/sec`;
curAuto.style.fontWeight = "bold";
app.append(curAuto);

// Fairy Dust Clicker
const clicker = document.createElement("button");
clicker.textContent = "🧚🏻";
let counter = 0;
clicker.addEventListener("click", () => addCounter(1));

app.appendChild(clicker);

// Display counter
const dispCounter = document.createElement("div");
dispCounter.textContent = counter.toFixed(2) + " Fairy Dust";
app.appendChild(dispCounter);

// upgrade Buttons -----------------------------------------------------------------------------------------
interface Upgrades {
  button: HTMLButtonElement;
  dust: number;
  level: number;
  collect: number;
  name: string;
}

const upgradeButtons: Upgrades[] = [];
let purchaseCost = 5;
let upgradeRate = 0.5;
const increaseCost = 1.5;

// upgrade constructor
function makeUpgrade(name: string) {
  const button = document.createElement("button");
  button.innerHTML = `${name} (${upgradeRate}/s) <br>--${purchaseCost} FAIRY DUST--`;
  const upgrade = {
    button: button,
    dust: purchaseCost,
    level: 0,
    collect: upgradeRate,
    name: name,
  };
  upgradeButtons.push(upgrade);
  button.addEventListener("click", () => purchaseUpgrade(upgrade));

  purchaseCost **= 2;
  upgradeRate *= 3;
  app.appendChild(button);
  disableButton(button);
}

// make all upgrade buttons
makeUpgrade("Mushroom Offering");
makeUpgrade("Feather Tickler");
makeUpgrade("Extra Pair of Wings");
makeUpgrade("Pollen for a Fairy Sneeze");
makeUpgrade("Call a Fairy Friend");

// Display upgrade levels
const dispLevel = document.createElement("div");
displayLevels();
app.appendChild(dispLevel);

// functions -----------------------------------------------------------------------------------------

// upgrade levels
function displayLevels() {
  dispLevel.textContent = "-";
  for (const upgrade of upgradeButtons) {
    dispLevel.textContent += `- ${upgrade.level} ${upgrade.name} -`;
  }
  dispLevel.textContent += "-";
}
// add to counter and display update
function addCounter(x: number) {
  counter += x;
  dispCounter.textContent = counter.toFixed(2) + " Fairy Dust";

  // if there is enough dust for upgrade enable the button
  for (const upgrade of upgradeButtons) {
    if (counter >= upgrade.dust) {
      enableButton(upgrade.button);
    } else {
      disableButton(upgrade.button);
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

// change button colors
function enableButton(button: HTMLButtonElement) {
  button.style.backgroundColor = "#f9f9f9";
  button.style.color = "#1a1a1a";
  button.style.cursor = "pointer";
}

// change button colors
function disableButton(button: HTMLButtonElement) {
  button.style.backgroundColor = "#d3d3d3";
  button.style.color = "#a9a9a9";
  button.style.cursor = "not-allowed";
}

// level up upgrade after purchase
function levelUpUpgrade(upgrade: Upgrades) {
  upgrade.level++;
  upgrade.dust += upgrade.dust * increaseCost;
  upgrade.button.innerHTML = `${upgrade.name} (${upgrade.collect}/s) <br>--${upgrade.dust.toFixed(2)} FAIRY DUST--`;

  // check if it can be upgraded again
  if (counter < upgrade.dust) disableButton(upgrade.button);
  displayLevels();
}

// clicked upgrade
function purchaseUpgrade(upgrade: Upgrades) {
  if (counter < upgrade.dust) {
    return;
  }

  addCounter(-upgrade.dust);
  autoAdd += upgrade.collect;
  curAuto.innerHTML = `${autoAdd.toFixed(2)} Fairy Dust/sec`;
  levelUpUpgrade(upgrade);

  // if auto collect hasn't started
  if (!isIntervalRunning) {
    isIntervalRunning = true;
    requestAnimationFrame(intervalCounter);
  }
}
