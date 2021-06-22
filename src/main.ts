import RubiksApp from "./App/RubiksApp";
import "./style.css";

async function main() {
    const container = document.querySelector<HTMLDivElement>("#main")!;

    const app = new RubiksApp(container);
    
    // @ts-ignore
    window.shuffleStart = () => app.shuffleStart();
    
    // @ts-ignore
    window.shuffleStop = () => app.shuffleStop();
    
    // @ts-ignore
    window.reset = () => app.reset();
    
    app.start();
}

main();