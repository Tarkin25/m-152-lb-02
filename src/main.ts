import { AmbientLight, BoxGeometry, Color, DirectionalLight, DoubleSide, EdgesGeometry, Group, LineBasicMaterial, LineSegments, Mesh, MeshStandardMaterial, Object3D, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three-stdlib';
import './style.css'

const main = document.querySelector("#main")!;

const canvas = document.createElement('canvas');
canvas.height = main.clientHeight;
canvas.width = main.clientWidth;
main.appendChild(canvas);

const renderer = new WebGLRenderer({
  canvas
});
renderer.setSize(main.clientWidth, main.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new Scene();
scene.background = new Color("white");
const camera = new PerspectiveCamera(90, canvas.width / canvas.height);

window.addEventListener('resize', () => {
  camera.aspect = main.clientWidth / main.clientHeight;
  renderer.setSize(main.clientWidth, main.clientHeight);
})

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
})

const cubes: Object3D[][][] = Array(9).fill(undefined).map(() => Array(9).fill(undefined).map(() => Array(9).fill(undefined)));

function addCube(color: string, x: number, y: number, z: number) {
  const cube = Cube(color, [x, y, z]);
  cubes[x][y][z] = cube;
}

addCube("red", 0, 0, 0);
addCube("orange", 1, 0, 0);
addCube("green", 2, 0, 0);

const cubeGroup = new Group();
cubeGroup.position.set(-1, -1, -1);

for (let x=0;x<9;x++) {
  for (let y=0;y<9;y++) {
    for (let z=0;z<9;z++) {
      const cube = cubes[x][y][z];

      cube && cubeGroup.add(cube);
    }
  }
}

scene.add(cubeGroup);

function Cube(color: string, position: [number, number, number]) {
  const geometry = new BoxGeometry(1,1,1);
  const material = new MeshStandardMaterial({color});
  const cube = new Mesh(geometry, material);

  const edges = new EdgesGeometry(geometry);
  const lines = new LineSegments(edges, new LineBasicMaterial({color: 0}));

  const group = new Group();
  group.position.set(...position);
  group.add(cube, lines);

  return group;
}

const geometry = new BoxGeometry(1,1,1);

function side(color: string) {
  return new MeshStandardMaterial({color, side: DoubleSide, transparent: true});
}
