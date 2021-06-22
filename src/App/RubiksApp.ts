import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { createCamera } from "./components/camera";
import { Controls } from "./components/Controls";
import { createLights } from "./components/lights";
import { RubiksCube } from "./components/RubiksCube/RubiksCube";
import { createScene } from "./components/scene";
import { Loop } from "./systems/Loop";
import { createRenderer } from "./systems/renderer";
import { Resizer } from "./systems/Resizer";

export default class RubiksApp {
    private camera: PerspectiveCamera;
    private scene: Scene;
    private renderer: WebGLRenderer;
    private loop: Loop;
    private cube: RubiksCube;

    constructor(container: HTMLElement) {
        this.camera = createCamera();
        this.scene = createScene();
        this.renderer = createRenderer();
        this.loop = new Loop(this.camera, this.scene, this.renderer);

        container.appendChild(this.renderer.domElement);

        const lights = createLights();
        this.scene.add(...lights);

        const controls = new Controls(this.camera, this.renderer.domElement);
        this.loop.add(controls);

        this.cube = new RubiksCube(container, this.camera);
        this.loop.add(this.cube);
        this.scene.add(this.cube);

        new Resizer(container, this.camera, this.renderer);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    start() {
        this.loop.start();
    }

    stop() {
        this.loop.stop();
    }

    shuffleStart() {
        this.cube.shuffleStart();
    }

    shuffleStop() {
        this.cube.shuffleStop();
    }

    reset() {
        this.cube.reset();
    }
}