import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;
let width = document.documentElement.clientWidth;

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

// Buttons -----------------------------------------------------------------------------------------
// upgrade buttons
interface Upgrades {
  button: HTMLButtonElement;
  dust: number;
  level: number;
  collect: number;
  name: string;
}

const upgradeButtons: Upgrades[] = [];

// Fairy Dust Clicker
const clicker = document.createElement("button");
clicker.textContent = "🧚🏻";
let counter = 0;
clicker.addEventListener("click", () => addCounter(1));

app.appendChild(clicker);

// upgrades
const mushroomUp = document.createElement("button");
makeUpgrade(mushroomUp, 10, 0.2, "Mushroom Offering");

const featherUp = document.createElement("button");
makeUpgrade(featherUp, 50, 2, "Feather Tickler");

const pairUp = document.createElement("button");
makeUpgrade(pairUp, 100, 5, "Pair of Wings");

// Display upgrade levels
const dispLevel = document.createElement("div");
displayLevels();
dispLevel.style.position = "absolute";
app.appendChild(dispLevel);
position();

// Display counter
const dispCounter = document.createElement("div");
dispCounter.textContent = counter.toFixed(2) + " Fairy Dust";
app.appendChild(dispCounter);

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

// position elements
function position() {
  mushroomUp.style.left = `${width / 2 - featherUp.offsetWidth / 2 - mushroomUp.offsetWidth}px`;
  featherUp.style.left = `${width / 2 - featherUp.offsetWidth / 2}px`;
  pairUp.style.left = `${width / 2 + featherUp.offsetWidth / 2}px`;

  let rect = clicker.getBoundingClientRect();
  mushroomUp.style.top = `${rect.top + clicker.offsetHeight * 2}px`;
  featherUp.style.top = `${rect.top + clicker.offsetHeight * 2}px`;
  pairUp.style.top = `${rect.top + clicker.offsetHeight * 2}px`;

  rect = featherUp.getBoundingClientRect();
  dispLevel.style.top = `${rect.top + featherUp.offsetHeight}px`;
  dispLevel.style.left = `${width / 2 - dispLevel.offsetWidth / 2}px`;
}

// if window is resized change everything positions
window.addEventListener("resize", () => {
  width = document.documentElement.clientWidth;
  //height = document.documentElement.clientHeight;
  position();
});

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

// access button from array
function findUpgrade(button: HTMLButtonElement) {
  return upgradeButtons.find((upgrade) => upgrade.button === button);
}

// clicked upgrade
function purchaseUpgrade(upgrade: Upgrades) {
  if (counter < upgrade.dust) {
    return;
  }
  addCounter(-upgrade.dust);
  upgrade.level++;
  autoAdd += upgrade.collect;
  curAuto.innerHTML = `${autoAdd.toFixed(2)} Fairy Dust/sec`;

  // if auto collect hasn't started
  if (!isIntervalRunning) {
    isIntervalRunning = true;
    requestAnimationFrame(intervalCounter);
  }

  upgrade.dust += upgrade.dust * 1.15;
  upgrade.button.innerHTML = `${upgrade.name} (${upgrade.collect}/s) <br>--${upgrade.dust.toFixed(2)} FAIRY DUST--`;

  // check if it can be upgraded again
  if (counter < upgrade.dust) disableButton(upgrade.button);
  displayLevels();
  position();
}

// make upgrade buttons
function makeUpgrade(
  button: HTMLButtonElement,
  dust: number,
  collect: number,
  name: string,
) {
  button.innerHTML = `${name} (${collect}/s) <br>--${dust} FAIRY DUST--`;
  upgradeButtons.push({
    button: button,
    dust: dust,
    level: 0,
    collect: collect,
    name: name,
  });
  const upgrade = findUpgrade(button);
  if (upgrade) {
    button.addEventListener("click", () => purchaseUpgrade(upgrade));
  } else {
    console.error("Upgrade not found for the specified button.");
  }
  app.appendChild(button);
  button.style.position = "absolute";
  disableButton(button);
}
