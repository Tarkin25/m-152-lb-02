import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three-stdlib";
import { createCamera } from "./components/camera";
import { createLights } from "./components/lights";
import { RotationControls } from "./components/RotationControls";
import { RubiksCube } from "./components/RubiksCube/RubiksCube";
import { createScene } from "./components/scene";
import { Side } from "./Move";
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

        this.cube = new RubiksCube(this.scene);
        this.loop.add(this.cube);
        this.scene.add(this.cube);
        this.camera.lookAt(this.cube.position);

        new RotationControls(this.cube, this.renderer.domElement);
        //new OrbitControls(this.camera, this.renderer.domElement);

        new Resizer(container, this.camera, this.renderer);
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

    pushMove(side: Side, inverse: boolean = false) {
        this.cube.pushMove({side, inverse});
    }
}