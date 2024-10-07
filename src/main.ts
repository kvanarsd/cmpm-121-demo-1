import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;
let width = document.documentElement.clientWidth;
let height = document.documentElement.clientHeight;

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
}

let upgradeButtons: Upgrades[] = [];

// Fairy Dust Clicker
const clicker = document.createElement("button");
clicker.textContent = "🧚🏻";
let counter = 0;
clicker.addEventListener("click", () => addCounter(1));

app.appendChild(clicker);

// Auto increase 1 per second upgrade button
const autoClicker = document.createElement("button");
let autoClickerCost = 10;
let autoAdd = 0;
let autoLevel = 0;
autoClicker.innerHTML = "Auto Collect (1/s) <br>--10 FAIRY DUST--";
let isIntervalRunning = false;

// click
autoClicker.addEventListener("click", () => {
  if(counter < autoClickerCost) {
    return;
  }
  addCounter(-autoClickerCost);
  autoLevel++;
  autoAdd = 1 * autoLevel;

  if(!isIntervalRunning) {
    isIntervalRunning = true;
    requestAnimationFrame(intervalCounter);
  }
  
  autoClickerCost = 10 * (autoLevel +  1);
  autoClicker.innerHTML = `Auto Collect (${autoAdd + 1}/s) <br>--${autoClickerCost} FAIRY DUST--`;

  // update cost
  const upgrade = findUpgrade(autoClicker);
  if (upgrade) {
    upgrade.cost = autoClickerCost;
  }

  // check if it can be upgraded again
  if(counter < autoClickerCost) disableButton(autoClicker);
})

app.appendChild(autoClicker);
// style
autoClicker.style.position = "absolute";
position();
// disable button
disableButton(autoClicker);

upgradeButtons.push({ button: autoClicker, cost: autoClickerCost })


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
  for(const upgrade of upgradeButtons) {
    if(counter >= upgrade.cost) {
      enableButton(upgrade.button);
    }
  }
}

// add to counter 1/fps
let lastFrame = 0;
let elaspedTime = 0;

function intervalCounter(timestamp: DOMHighResTimeStamp) {
  if(lastFrame == 0) lastFrame = timestamp;

  elaspedTime = timestamp - lastFrame;
  lastFrame = timestamp;

  if (elaspedTime > 0) {
    const fps = 1000 / elaspedTime;
    addCounter(autoAdd / fps);
  }
  requestAnimationFrame(intervalCounter);
}

setInterval(()=> {
  console.log("second")
},1000);

function position() {
  const rect = clicker.getBoundingClientRect();
  autoClicker.style.left = `${width/2 - autoClicker.offsetWidth/2}px`;
  autoClicker.style.top = `${rect.top + clicker.offsetHeight * 2}px`;
}

// if window is resized change everything positions
window.addEventListener('resize', () => {
  width = document.documentElement.clientWidth;
  height = document.documentElement.clientHeight;
  position();
});

function enableButton(button: HTMLButtonElement){
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
  return upgradeButtons.find(upgrade => upgrade.button === button);
}