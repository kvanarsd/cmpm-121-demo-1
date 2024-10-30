import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;
app.style.backgroundColor = "#ebe4f0";

const gameName = "Collect Fairy Dust!";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

// display collect interval
let autoAdd = 0;
let isIntervalRunning = false;

const curAuto = document.createElement("div");
curAuto.innerHTML = `${autoAdd.toFixed(2)} Fairy Dust/sec`;
//curAuto.style.fontWeight = "bold";
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

// change style referencing lorclau's code https://github.com/lorclau/cmpm-121-demo-1/blob/main/src/main.ts
clicker.style.cssText = `
position: absolute;
  top: 20%; 
  left: 50%;
  background: #fff;
  transform: translate(-50%, -50%) scale(2);
  width: 100px; 
  height: 100px;
  border-radius: 50px; 
  font-size: 40px; 
  display: flex;        
  justify-content: center;   
`

app.appendChild(clicker);

// Display counter
const dispCounter = document.createElement("div");
dispCounter.textContent = counter.toFixed(2) + " Fairy Dust";
dispCounter.style.fontWeight = "bold";
dispCounter.style.fontSize = "25px";
dispCounter.style.color = "#bb5ccc";
app.appendChild(dispCounter);

// upgrades
const mushroomUp = document.createElement("button");
makeUpgrade(mushroomUp, 10, 0.2, "Mushroom Offering");

const featherUp = document.createElement("button");
makeUpgrade(featherUp, 50, 2, "Feather Tickler");

const pairUp = document.createElement("button");
makeUpgrade(pairUp, 100, 5, "Extra Pair of Wings");

const pollenUp = document.createElement("button");
makeUpgrade(pollenUp, 200, 10, "Pollen to make the Fairies Sneeze");

const friendUp = document.createElement("button");
makeUpgrade(friendUp, 500, 20, "Call a Fairy Friend");

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
  button.style.backgroundColor = "#fae3f7";
  button.style.color = "#1a1a1a";
  button.style.cursor = "pointer";
}

// change button colors
function disableButton(button: HTMLButtonElement) {
  button.style.backgroundColor = "#927b9e";
  button.style.color = "#5e5066";
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

  disableButton(button);
}
