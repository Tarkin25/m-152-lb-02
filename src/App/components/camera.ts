import { PerspectiveCamera } from "three";

export function createCamera() {
    const camera = new PerspectiveCamera(
        90,
        1, // dummy value
        0.1,
        100,
    );

    camera.position.set(0, 3, 5);

    return camera;
}