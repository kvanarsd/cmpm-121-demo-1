import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "My katrina game";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

// button
const button = document.createElement('button');
button.textContent = "🧚🏻";

app.appendChild(button);