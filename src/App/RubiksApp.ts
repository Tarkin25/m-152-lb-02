import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { createCamera } from "./components/camera";
import { Controls } from "./components/Controls";
import { createLights } from "./components/lights";
import { RubiksCube } from "./components/RubiksCube";
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

    constructor(container: Element) {
        this.camera = createCamera();
        this.scene = createScene();
        this.renderer = createRenderer();
        this.loop = new Loop(this.camera, this.scene, this.renderer);

        container.appendChild(this.renderer.domElement);

        const lights = createLights();
        this.scene.add(...lights);

        this.cube = new RubiksCube();
        this.loop.add(this.cube);
        this.scene.add(this.cube);

        const resizer = new Resizer(container, this.camera, this.renderer);

        const controls = new Controls(this.camera, this.renderer.domElement);
        controls.target.copy(this.cube.position);
        this.loop.add(controls);
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
}