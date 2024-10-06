import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "My Fairy game";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

// button
const button = document.createElement("button");
button.textContent = "🧚🏻";

// counter
let counter = 0;

button.addEventListener("click", () => addCounter(1));

app.appendChild(button);

// div
const dispCounter = document.createElement("div");
dispCounter.textContent = counter + " Fairy Dust";
app.appendChild(dispCounter);

// 1 second interval
requestAnimationFrame(intervalCounter);


// functions ---------------------------------------

// add to counter and display update
function addCounter(x: number) {
  counter += x;
  dispCounter.textContent = counter.toFixed(2) + " Fairy Dust";
}

// add to counter 1/fps
let lastFrame = performance.now();
let elaspedTime = 0;

function intervalCounter(timestamp: DOMHighResTimeStamp) {
  elaspedTime = timestamp - lastFrame;
  lastFrame = timestamp;

  if (elaspedTime > 0) {
    const fps = 1000 / elaspedTime;
    addCounter(1 / fps)
  }
  requestAnimationFrame(intervalCounter);
}
