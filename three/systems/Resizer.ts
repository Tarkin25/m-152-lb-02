import { PerspectiveCamera, WebGLRenderer } from "three";

const resize = (container: Element, camera: PerspectiveCamera, renderer: WebGLRenderer) => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
}

export class Resizer {
    constructor(
        container: Element,
        camera: PerspectiveCamera,
        renderer: WebGLRenderer,
    ) {
        resize(container, camera, renderer);

        window.addEventListener('resize', () => {
            resize(container, camera, renderer);
        })
    }
}