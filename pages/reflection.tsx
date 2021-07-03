import React, { Fragment } from "react";
import Head from "next/head";
import Link from "../components/Link";

const ReflectionPage = () => {
    return (
        <Fragment>
            <Head>
                <title>Reflection - Rubik's Cube</title>
            </Head>

            <main className="p-4">
                <h2 className="text-4xl mt-2 mb-4">Reflection</h2>

                <p>
                    During the development of this web application, I have
                    learned a lot about the concepts of{" "}
                    <Link href="https://threejs.org/">Three.js</Link> and got a
                    refreshment of my knowledge in linear algebra.
                    <br />
                    The following sections go into more detail about what I
                    learned and which solutions I came up with.
                </p>

                <section id="threejs">
                    <h2 className="text-2xl my-2">Three.js</h2>

                    <p>
                        Already having experimented with virtual reality
                        applications using the{" "}
                        <Link href="https://unity.com">Unity game engine</Link>,
                        I was already familiar with the concepts of 3D
                        programming such as the object graph, cameras, lights
                        and materials. However, this was my first time working
                        with the Three.js library, so I had to learn how to use
                        it correctly. To get familiar with the code setup and
                        good practices, I used{" "}
                        <Link href="https://discoverthreejs.com/">
                            Discover three.js
                        </Link>
                        , a great getting started manual for Three.js.
                    </p>
                </section>

                <section id="planes">
                    <h2 className="text-2xl my-2">Planes</h2>

                    <p>
                        The Rubik's Cube consists of a total of 27 unique
                        pieces, which can be arranged using a defined set of
                        moves. A move consists of one of the 9 planes which make
                        up the cube as well as the direction in which to spin
                        the plane.
                        <br />
                        Three.js represents a mathematical plane in{" "}
                        <Link href="http://mathworld.wolfram.com/HessianNormalForm.html">
                            Hessian normal form
                        </Link>
                        .
                        <br />
                        This means that a plane is defined by a unit length
                        normal vector and a constant.
                    </p>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Plane_equation_qtl4.svg/220px-Plane_equation_qtl4.svg.png"
                        alt="Plane representation in hessian normal form"
                    />
                    <p className="text-sm">
                        Source:{" "}
                        <Link href="https://en.wikipedia.org/wiki/Hesse_normal_form">
                            https://en.wikipedia.org/wiki/Hesse_normal_form
                        </Link>
                    </p>
                    <p className="mt-2">
                        The code responsible for performing moves on the cube
                        uses a plane and an angle as input. It then selects the
                        cube's pieces which are positioned on the plane and
                        rotates them around it's normal vector by the given
                        angle.
                    </p>
                </section>

                <section id="events">
                    <h2 className="text-2xl my-2">Event-Driven programming</h2>

                    <p>
                        In order to completely decouple different components of
                        the application, an event-driven approach was used to
                        provide interactivity to the cube. This meant that
                        components responsible for different aspects of the
                        application did not know of each other. Instead, they
                        each registered event listeners on a global
                        event-dispatcher.
                    </p>
                    <p className="mt-2">
                        The implementation for clicking on a specific plane and
                        rotating it accordingly then looks like the following:
                    </p>
                    <ol className="mt-2 list-inside list-decimal">
                        <li>
                            The ClickController checks if the cursor is
                            positioned over a plane.
                        </li>
                        <li>
                            If the cursor is positioned over a plane and the
                            mouse is clicked, a <i>push-move</i> event
                            containing the according plane as well as the
                            rotation angle.
                        </li>
                        <li>
                            The MoveController listens for <i>push-move</i>{" "}
                            events, and upon receiving one, the contained move
                            is pushed to a queue of moves, and eventually gets
                            performed on the cube's pieces.
                        </li>
                    </ol>
                    <p className="mt-2">
                        With this approach, the MoveController does not need to
                        expose a public API and does not have to be passed to
                        the ClickController. Also, different sources are also
                        able to dispatch <i>push-move</i> events. For example,
                        if the "Checkers" button is clicked, a series of{" "}
                        <i>push-move</i> events is dispatched from the
                        RubiksCube class directly, since the moves don't need to
                        be determined by any other component and are instead
                        pre-defined.
                    </p>
                </section>
            </main>
        </Fragment>
    );
};

export default ReflectionPage;
