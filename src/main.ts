import RubiksApp from "./App/RubiksApp";
import "./style.css";

const main = document.querySelector<HTMLDivElement>("#main")!;

const app = new RubiksApp(main);
app.start();

// @ts-ignore
window.shuffleStart = () => app.shuffleStart();

// @ts-ignore
window.shuffleStop = () => app.shuffleStop();

// @ts-ignore
window.pushMove = (side, inverse) => app.pushMove(side, inverse);