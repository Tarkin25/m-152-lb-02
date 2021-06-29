import React, { useEffect, useRef } from "react";
import Button from "../components/Button";
import RubiksApp from "../three/RubiksApp";
import {
  checkers,
  reset,
  shuffleStart,
  shuffleStop,
} from "../three/systems/events";

const HomePage = () => {
  const main = useRef<HTMLDivElement>();

  useEffect(() => {
      const app = new RubiksApp(main.current);
      app.start();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-900 p-4 text-gray-200">
        <h2 className="text-4xl">LB 02</h2>
      </header>

      <main ref={main} className="flex-grow bg-blue-400 relative">
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-center">
          <Button eventCreator={reset}>Reset</Button>
          <Button eventCreator={shuffleStart}>Shuffle Start</Button>
          <Button eventCreator={shuffleStop}>Shuffle Stop</Button>
          <Button eventCreator={checkers}>Checkers</Button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
