import {
    AmbientLight,
    BoxGeometry,
    Color,
    DirectionalLight,
    DoubleSide,
    Group,
    Mesh,
    MeshLambertMaterial,
    MeshStandardMaterial,
    Object3D,
    PerspectiveCamera,
    PlaneGeometry,
    Raycaster,
    Scene,
    Vector2,
    Vector3,
    WebGLRenderer,
} from "three";
import { OrbitControls } from "three-stdlib";
import "./style.css";
import { WHITE, BLUE, ORANGE, RED, YELLOW, GREEN } from "./colors";
import { Cube, CubeColors } from "./cube";
import { isArray, merge } from "lodash";

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

const controls = new OrbitControls(camera, canvas);

const raycaster = new Raycaster();
raycaster.camera = camera;
const mouse = new Vector2();

const onMouseMove = (e: MouseEvent) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(cubeGroup.children, false);

    intersects.forEach(intersect => {
        const object = intersect.object as Mesh;

        if (object.geometry.type !== "PlaneGeometry") {
            const material = object.material;

            if (isArray(material)) {
                material.forEach((mat) => {
                    const material = mat as MeshStandardMaterial;

                    material.emissive.set("pink");
                })
            } else {
                const mat = material as MeshStandardMaterial;

                mat.emissive.set("pink");
            }
        }
    })
};

let tLast: number = 0;

renderer.setAnimationLoop((time) => {
    const deltaTime = tLast === 0 ? time : time - tLast;
    tLast = time;

    rotatePlane("z", 1, deltaTime / 1000);
    controls.update();
    camera.updateMatrixWorld();
    renderer.render(scene, camera);
});

//canvas.addEventListener('mousemove', onMouseMove, false);

const cubes: Object3D[] = [];

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

                const cube = Cube(
                    [x + ORIGIN_OFFSET, y + ORIGIN_OFFSET, z + ORIGIN_OFFSET],
                    colors
                );
                cubes.push(cube);
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

const rotatePlane = (axis: "x" | "y" | "z", index: number, radial: number) => {
    const planeCenter = new Vector3(0,0,0);
    planeCenter[axis] = index;
    const rotationAxis = new Vector3(0, 0, 0);
    rotationAxis[axis] = 1;
    rotationAxis.normalize();

    for (let cube of cubes) {
        if (cube.position[axis] === index) {
            rotateAboutPoint(cube, planeCenter, rotationAxis, radial, false);
        }
    }
}

// obj - your object (THREE.Object3D or derived)
// point - the point of rotation (THREE.Vector3)
// axis - the axis of rotation (normalized THREE.Vector3)
// theta - radian value of rotation
// pointIsWorld - boolean indicating the point is in world coordinates (default = false)
function rotateAboutPoint(obj: Object3D, point: Vector3, axis: Vector3, theta: number, pointIsWorld: boolean){
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

    if(pointIsWorld){
        obj.parent?.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if(pointIsWorld){
        obj.parent?.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}
