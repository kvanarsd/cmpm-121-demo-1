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

button.addEventListener("click", () => {
  counter++;
  dispCounter.textContent = counter + " Fairy Dust";
});

app.appendChild(button);

// div
const dispCounter = document.createElement("div");
dispCounter.textContent = counter + " Fairy Dust";
app.appendChild(dispCounter);
