import Head from "next/head";
import React, { Fragment, useEffect, useRef } from "react";
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
        <Fragment>
            <Head>
                <title>Rubik's Cube</title>
            </Head>

            <main ref={main} className="flex-grow bg-blue-400 relative">
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-center">
                    <Button eventCreator={reset}>Reset</Button>
                    <Button eventCreator={shuffleStart}>Shuffle Start</Button>
                    <Button eventCreator={shuffleStop}>Shuffle Stop</Button>
                    <Button eventCreator={checkers}>Checkers</Button>
                </div>
            </main>
        </Fragment>
    );
};

export default HomePage;
