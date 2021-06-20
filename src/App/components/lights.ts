import { AmbientLight, DirectionalLight } from "three";

export function createLights() {
    const directionalLight = new DirectionalLight('white', 5);
    directionalLight.position.set(10, 10, 10);

    const ambientLight = new AmbientLight('white', 2);

    return [directionalLight, ambientLight];
}