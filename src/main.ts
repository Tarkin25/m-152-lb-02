import RubiksApp from "./App/RubiksApp";
import "./style.css";

const main = document.querySelector<HTMLDivElement>("#main")!;

const app = new RubiksApp(main);

// @ts-ignore
window.shuffleStart = () => app.shuffleStart();

// @ts-ignore
window.shuffleStop = () => app.shuffleStop();

// @ts-ignore
window.reset = () => app.reset();

app.start();