import { Camera, Clock, Scene, WebGLRenderer } from "three";
import { Updatable } from "../Updatable";

const clock = new Clock();

let _camera: Camera;
let _scene: Scene;
let _renderer: WebGLRenderer;

const updatables: Updatable[] = [];

function init(camera: Camera, scene: Scene, renderer: WebGLRenderer) {
    _camera = camera;
    _scene = scene;
    _renderer = renderer;
}

function start() {
    _renderer.setAnimationLoop(() => {
        tick();

        _renderer.render(_scene, _camera);
    })
}

function stop() {
    _renderer.setAnimationLoop(null);
}

function tick() {
    const delta = clock.getDelta();

    for (const updatable of updatables) {
        updatable.tick(delta);
    }
}

export const Loop = {
    init,
    start,
    stop
}

export function useLoop(updatable: Updatable) {
    updatables.push(updatable);
}