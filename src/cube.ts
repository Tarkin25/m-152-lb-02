import {
    BoxGeometry,
    Color,
    DoubleSide,
    EdgesGeometry,
    Group,
    LineBasicMaterial,
    LineSegments,
    Mesh,
    MeshStandardMaterial,
    Object3D,
} from "three";
import { BLACK } from "./colors";

type CubeColorsInternal = {
    0: Color | undefined;
    1: Color | undefined;
    2: Color | undefined;
    3: Color | undefined;
    4: Color | undefined;
    5: Color | undefined;
};

export type CubeColors = Partial<CubeColorsInternal>;

// @ts-ignore
const defaultColors: CubeColorsInternal = { ...Array(6).fill(BLACK) };

const CubeColorsInternal = (colors: CubeColors): CubeColorsInternal => ({
    ...defaultColors,
    ...colors,
});

function cubeMaterials(colors: CubeColorsInternal) {
    return Object.values(colors).map((color) => {
        return new MeshStandardMaterial({
            color,
            side: DoubleSide,
        });
    });
}

export function Cube(
    position: [number, number, number],
    colors: CubeColors
): Object3D {
    const size = 0.99;

    const geometry = new BoxGeometry(size, size, size);
    const materials = cubeMaterials(CubeColorsInternal(colors));
    const cube = new Mesh(geometry, materials);
    cube.castShadow = true;
    cube.receiveShadow = true;
    //cube.position.set(...position);

    const edges = new EdgesGeometry(geometry);
    const lines = new LineSegments(
        edges,
        new LineBasicMaterial({ color: BLACK })
    );

    const group = new Group();
    group.receiveShadow = true;
    group.position.set(...position);
    group.add(cube, lines);

    return group;

    return cube;
}
