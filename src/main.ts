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
setInterval(addCounter, 1000, 1);

// functions
function addCounter(x: number) {
  counter += x;
  dispCounter.textContent = counter + " Fairy Dust";
}
