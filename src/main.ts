import RubiksApp from "./App/RubiksApp";
import { checkers, EventDispatcher, reset, shuffleStart, shuffleStop } from "./App/systems/events";
import "./style.css";

type DispatchedEvent = Parameters<typeof EventDispatcher.dispatchEvent>[0];

type EventCreator = () => DispatchedEvent;

function assignButtonClick(id: string, eventCreator: EventCreator) {
    const button = document.querySelector<HTMLButtonElement>(`#${id}`);
    
    if (button) {
        button.onclick = () => EventDispatcher.dispatchEvent(eventCreator());
    }
}

async function main() {
    const container = document.querySelector<HTMLDivElement>("#main")!;

    const app = new RubiksApp(container);
    
    assignButtonClick('reset', reset);
    assignButtonClick('shuffle-start', shuffleStart);
    assignButtonClick('shuffle-stop', shuffleStop);
    assignButtonClick('checkers', checkers);
    
    app.start();
}

main();