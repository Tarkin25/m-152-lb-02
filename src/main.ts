import RubiksApp from "./App/RubiksApp";
import "./style.css";

const main = document.querySelector("#main")!;

const app = new RubiksApp(main);
app.start();