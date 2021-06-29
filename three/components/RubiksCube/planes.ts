import { Plane, Vector3, MathUtils } from "three";
import { Move } from "./Move";

export const planes: Plane[] = [
    new Plane(new Vector3(1, 0, 0), -1),
    new Plane(new Vector3(1, 0, 0), 1),
    new Plane(new Vector3(0, 1, 0), -1),
    new Plane(new Vector3(0, 1, 0), 1),
    new Plane(new Vector3(0, 0, 1), -1),
    new Plane(new Vector3(0, 0, 1), 1),
]

const angles = [Math.PI / 2, -Math.PI / 2];

export function randomMove(): Move | undefined {
    const plane = planes[MathUtils.randInt(0, 5)];
    const angle = angles[MathUtils.randInt(0, 1)];

    return {
        plane,
        angle,
    }
}