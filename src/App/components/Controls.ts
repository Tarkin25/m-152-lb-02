import { Camera } from "three";
import { OrbitControls } from "three-stdlib";
import { ENABLE_CONTROLS, EventDispatcher } from "../systems/events";
import { useLoop } from "../systems/Loop";
import { Updatable } from "../Updatable";

export class Controls extends OrbitControls implements Updatable {
    constructor(camera: Camera, canvas: HTMLCanvasElement) {
        super(camera, canvas);
        this.enableDamping = true;
        this.enablePan = false;

        EventDispatcher.addEventListener(ENABLE_CONTROLS, e => {
            const enabled = e.enabled as boolean;

            this.enabled = enabled;
        })

        useLoop(this);
    }

    tick() {
        this.update();
    }
}