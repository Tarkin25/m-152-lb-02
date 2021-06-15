import {
    AmbientLight,
    Color,
    DirectionalLight,
    DoubleSide,
    Group,
    Mesh,
    MeshStandardMaterial,
    Object3D,
    PerspectiveCamera,
    PlaneGeometry,
    Scene,
    WebGLRenderer,
} from "three";
import { OrbitControls } from "three-stdlib";
import "./style.css";
import { WHITE, BLUE, ORANGE, RED, YELLOW, GREEN } from "./colors";
import { Cube, CubeColors } from "./cube";
import { merge } from "lodash";

const CUBE_AMOUNT = 3;
const MAX_INDEX = CUBE_AMOUNT - 1;
const ORIGIN_OFFSET = (CUBE_AMOUNT - 1) / -2;
const CAMERA_OFFSET = CUBE_AMOUNT * 1.5;

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
renderer.shadowMap.enabled = true;

const scene = new Scene();
scene.background = new Color("white");
const camera = new PerspectiveCamera(90, canvas.width / canvas.height);

window.addEventListener("resize", () => {
    camera.aspect = main.clientWidth / main.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(main.clientWidth, main.clientHeight, true);
});

const directionalLight = new DirectionalLight();
directionalLight.position.set(10, 10, -10);
directionalLight.castShadow = true;
scene.add(directionalLight);

const ambientLight = new AmbientLight();
scene.add(ambientLight);

camera.position.set(0, CAMERA_OFFSET, CAMERA_OFFSET);
camera.lookAt(0, 0, 0);

//const controls = new OrbitControls(camera, canvas);

renderer.setAnimationLoop(() => {
    //controls.update();
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
cubeGroup.position.set(0, 0, 0);
scene.add(cubeGroup);

type ColorMap = {
    x: { bottom: CubeColors; top: CubeColors };
    y: { bottom: CubeColors; top: CubeColors };
    z: { bottom: CubeColors; top: CubeColors };
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
};

function applyColors(colors: CubeColors, position: Position) {
    Object.entries(position).forEach(([key, value]) => {
        if (value === 0) {
            merge(colors, colorMap[key as keyof Position].bottom);
        } else if (value === MAX_INDEX) {
            merge(colors, colorMap[key as keyof Position].top);
        }
    });
}

function generateCubes() {
    for (let x = 0; x < CUBE_AMOUNT; x++) {
        for (let y = 0; y < CUBE_AMOUNT; y++) {
            for (let z = 0; z < CUBE_AMOUNT; z++) {
                let colors: CubeColors = {};

                applyColors(colors, { x, y, z });

                const cube = Cube([x+ORIGIN_OFFSET, y+ORIGIN_OFFSET, z+ORIGIN_OFFSET], colors);
                cubes[x][y][z] = cube;
                cubeGroup.add(cube);

                //await sleep(25);
            }
        }
    }
}

generateCubes();

function generateFloor() {
    const geometry = new PlaneGeometry(20, 20);
    const material = new MeshStandardMaterial({
        color: "gray",
        side: DoubleSide,
    });
    const mesh = new Mesh(geometry, material);

    mesh.position.set(0, ORIGIN_OFFSET * 5, 0);
    mesh.rotateX(Math.PI / 2);
    mesh.receiveShadow = true;

    scene.add(mesh);
}

generateFloor();

var mouseDown = false,
    mouseX = 0,
    mouseY = 0;

function onMouseMove(evt: MouseEvent) {
    if (!mouseDown) {
        return;
    }

    evt.preventDefault();

    var deltaX = evt.clientX - mouseX,
        deltaY = evt.clientY - mouseY;
    mouseX = evt.clientX;
    mouseY = evt.clientY;
    rotateScene(deltaX, deltaY);
}

function onMouseDown(evt: MouseEvent) {
    evt.preventDefault();

    mouseDown = true;
    mouseX = evt.clientX;
    mouseY = evt.clientY;
}

function onMouseUp(evt: MouseEvent) {
    evt.preventDefault();

    mouseDown = false;
}

function addMouseHandler(canvas: HTMLCanvasElement) {
    canvas.addEventListener(
        "mousemove",
        function (e) {
            onMouseMove(e);
        },
        false
    );
    canvas.addEventListener(
        "mousedown",
        function (e) {
            onMouseDown(e);
        },
        false
    );
    canvas.addEventListener(
        "mouseup",
        function (e) {
            onMouseUp(e);
        },
        false
    );
}

function rotateScene(deltaX: number, deltaY: number) {
    cubeGroup.rotation.y += deltaX / 100;
    cubeGroup.rotation.x += deltaY / 100;
}

addMouseHandler(canvas);
