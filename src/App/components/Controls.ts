import { Camera } from "three";
import { OrbitControls } from "three-stdlib";
import { EventDispatcher, HOVER } from "../systems/events";
import { useLoop } from "../systems/Loop";
import { Updatable } from "../Updatable";

export class Controls extends OrbitControls implements Updatable {
    constructor(camera: Camera, canvas: HTMLCanvasElement) {
        super(camera, canvas);
        this.enableDamping = true;
        this.enablePan = false;

        EventDispatcher.addEventListener(HOVER, e => {
            const hover = e.hover as boolean;

            this.enabled = !hover;
        })

        useLoop(this);
    }

    tick() {
        this.update();
    }
}