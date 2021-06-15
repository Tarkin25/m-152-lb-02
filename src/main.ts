import {
    AmbientLight,
    Color,
    DirectionalLight,
    Group,
    Object3D,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from "three";
import { OrbitControls } from "three-stdlib";
import "./style.css";
import { WHITE, BLUE, ORANGE, RED, YELLOW, GREEN } from "./colors";
import { Cube, CubeColors } from "./cube";
import { sleep } from "./util";
import { merge } from 'lodash';

const CUBE_AMOUNT = 5;
const MAX_INDEX = CUBE_AMOUNT - 1;
const ORIGIN_OFFSET = (CUBE_AMOUNT-1) / -2;

const main = document.querySelector("#main")!;

const canvas = document.createElement("canvas");
canvas.height = main.clientHeight;
canvas.width = main.clientWidth;
main.appendChild(canvas);

const renderer = new WebGLRenderer({
    canvas,
});
renderer.setSize(main.clientWidth, main.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new Scene();
scene.background = new Color("white");
const camera = new PerspectiveCamera(90, canvas.width / canvas.height);

window.addEventListener("resize", () => {
    camera.aspect = main.clientWidth / main.clientHeight;
    renderer.setSize(main.clientWidth, main.clientHeight);
});

const light = new DirectionalLight();
light.position.set(0, 100, 0);
scene.add(light);

scene.add(new AmbientLight());

camera.position.set(0, 5, 5);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, canvas);

renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
});

const cubes: Object3D[][][] = Array(CUBE_AMOUNT)
    .fill(undefined)
    .map(() =>
        Array(CUBE_AMOUNT)
            .fill(undefined)
            .map(() => Array(CUBE_AMOUNT).fill(undefined))
    );

const cubeGroup = new Group();
cubeGroup.position.set(ORIGIN_OFFSET, ORIGIN_OFFSET, ORIGIN_OFFSET);
scene.add(cubeGroup);

type ColorMap = {
    x: { bottom: Partial<CubeColors>; top: Partial<CubeColors> };
    y: { bottom: Partial<CubeColors>; top: Partial<CubeColors> };
    z: { bottom: Partial<CubeColors>; top: Partial<CubeColors> };
};

const colorMap: ColorMap = {
    x: {
        bottom: { 1: ORANGE },
        top: { 0: RED },
    },
    y: {
        bottom: { 3: WHITE },
        top: { 2: YELLOW },
    },
    z: {
        bottom: { 5: GREEN },
        top: { 4: BLUE },
    },
};

type Position = {
  x: number;
  y: number;
  z: number;
}

function applyColors(colors: Partial<CubeColors>, position: Position) {
  Object.entries(position).forEach(([key, value]) => {
    if (value === 0) {
      merge(colors, colorMap[key as keyof Position].bottom);
    } else if (value === MAX_INDEX) {
      merge(colors, colorMap[key as keyof Position].top);
    }
  })
}

for (let x = 0; x < CUBE_AMOUNT; x++) {
    for (let y = 0; y < CUBE_AMOUNT; y++) {
        for (let z = 0; z < CUBE_AMOUNT; z++) {
            let colors: Partial<CubeColors> = {};

            applyColors(colors, {x, y, z});

            const cube = Cube([x, y, z], colors);
            cubes[x][y][z] = cube;
            cubeGroup.add(cube);

            await sleep(25);
        }
    }
}
