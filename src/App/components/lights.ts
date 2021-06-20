import { AmbientLight } from "three";

export function createLights() {

    const ambientLight = new AmbientLight('white', 5);

    return [ambientLight];
}