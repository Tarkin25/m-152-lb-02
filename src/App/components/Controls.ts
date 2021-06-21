import { Camera } from "three";
import { OrbitControls } from "three-stdlib";
import { Updatable } from "../Updatable";

export class Controls extends OrbitControls implements Updatable {
    constructor(camera: Camera, canvas: HTMLCanvasElement) {
        super(camera, canvas);
        this.enableDamping = true;
        this.enablePan = false;
    }

    tick() {
        this.update();
    }
}