import RubiksApp from "./App/RubiksApp";
import { checkers, EventDispatcher, reset, shuffleStart, shuffleStop } from "./App/systems/events";
import "./style.css";

async function main() {
    const container = document.querySelector<HTMLDivElement>("#main")!;

    const app = new RubiksApp(container);
    
    // @ts-ignore
    window.shuffleStart = () => EventDispatcher.dispatchEvent(shuffleStart());
    
    // @ts-ignore
    window.shuffleStop = () => EventDispatcher.dispatchEvent(shuffleStop());
    
    // @ts-ignore
    window.reset = () => EventDispatcher.dispatchEvent(reset());

    // @ts-ignore
    window.checkers = () => EventDispatcher.dispatchEvent(checkers());
    
    app.start();
}

main();