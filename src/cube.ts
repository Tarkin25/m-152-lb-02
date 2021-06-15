import { BoxGeometry, Color, DoubleSide, EdgesGeometry, Group, LineBasicMaterial, LineSegments, Mesh, MeshStandardMaterial, Object3D } from "three";
import { BLACK } from "./colors";

export type CubeColors = {
    0: Color | undefined;
    1: Color | undefined;
    2: Color | undefined;
    3: Color | undefined;
    4: Color | undefined;
    5: Color | undefined;
};

// @ts-ignore
const defaultColors: CubeColors = {...Array(6).fill(BLACK)};

const CubeColors = (colors: Partial<CubeColors>): CubeColors => ({
    ...defaultColors,
    ...colors,
})

function cubeMaterials(colors: CubeColors) {
    return Object.values(colors).map(color => {
      return new MeshStandardMaterial({color, side: DoubleSide, transparent: true});
    });
  }
  
  export function Cube(position: [number, number, number], colors: Partial<CubeColors>): Object3D {
    const size = 0.99;

    const geometry = new BoxGeometry(size, size, size);
    const materials = cubeMaterials(CubeColors(colors));
    const cube = new Mesh(geometry, materials);
  
    const edges = new EdgesGeometry(geometry);
    const lines = new LineSegments(edges, new LineBasicMaterial({color: BLACK}));
  
    const group = new Group();
    group.position.set(...position);
    group.add(cube, lines);
  
    return group;
  }