import { Clock, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { Updatable } from "../Updatable";

const clock = new Clock();

export class Loop {
    private updatables: Updatable[] = [];

    constructor(
        private camera: PerspectiveCamera,
        private scene: Scene,
        private renderer: WebGLRenderer
    ) {}

    add(...updatables: Updatable[]) {
        this.updatables.push(...updatables);
    }

    start() {
        this.renderer.setAnimationLoop(() => {
            this.tick();

            this.renderer.render(this.scene, this.camera);
        })
    }

    stop() {
        this.renderer.setAnimationLoop(null);
    }

    private tick() {
        const delta = clock.getDelta();

        for (const updatable of this.updatables) {
            updatable.tick(delta);
        }
    }
}