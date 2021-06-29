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
    private cube: RubiksCube;

    constructor(container: HTMLElement) {
        this.camera = createCamera();
        this.scene = createScene();
        this.renderer = createRenderer();

        container.appendChild(this.renderer.domElement);

        const lights = createLights();
        this.scene.add(...lights);

        new Controls(this.camera, this.renderer.domElement);

        this.cube = new RubiksCube(container, this.camera);
        this.scene.add(this.cube);

        new Resizer(container, this.camera, this.renderer);

        Loop.init(this.camera, this.scene, this.renderer);
    }

    start() {
        Loop.start();
    }

    stop() {
        Loop.stop();
    }
}