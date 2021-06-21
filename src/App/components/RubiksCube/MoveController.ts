import { MathUtils, Object3D, Vector3 } from "three";
import { Move, Side } from "../../Move";
import { Updatable } from "../../Updatable";
import { rotateAroundPoint } from "../../utils/transformUtils";
import { Piece } from "./Piece";

const ROTATION_ANIMATION_DURATION = 250; // rotation animation duration in ms
const ROTATION_FACTOR = 1000 / ROTATION_ANIMATION_DURATION;

type Axis = "x" | "y" | "z";

class Plane {
    constructor(public axis: Axis, public index: number) {
        
    }
}

interface PlaneRotation extends Plane {
    targetAngle: number;
    currentAngle: number;
}

const sidePlaneMap: Record<Side, Plane> = {
    R: new Plane("x", 1),
    L: new Plane("x", -1),
    F: new Plane("z", 1),
    B: new Plane("z", -1),
    U: new Plane("y", 1),
    D: new Plane("y", -1)
}

export class MoveController implements Updatable {
    private planeRotation: PlaneRotation | undefined;
    private moveQueue: Move[];
    private getNextMove: () => Move | undefined;

    constructor(private pieces: Piece[], private cube: Object3D) {
        this.planeRotation = undefined;
        this.moveQueue = [];
        this.getNextMove = this.getNextMoveFromQueue;
    }

    tick(delta: number) {
        /* // @ts-ignore
        window.cube = {
            position: this.cube.position,
            rotation: this.cube.rotation,
        } */

        const planeRotation = this.planeRotation;

        if (planeRotation) {
            const difference =
                planeRotation.targetAngle - planeRotation.currentAngle;

            // angle will not be interpolated exactly to the target,
            // so complete the rotation manually at the end of the animation
            if (Math.abs(difference) <= 0.1) {
                this.rotatePlane(
                    planeRotation.axis,
                    planeRotation.index,
                    difference
                );
                // set the current planeRotation to undefined
                this.setPlaneRotation(undefined);
                return;
            }

            // interpolate the angle to the target, but ensure that we don't rotate too far,
            // since this will result in infinite rotation
            const rotationDirection = planeRotation.targetAngle >= 0 ? 1 : -1;
            const t = delta * ROTATION_FACTOR;
            const interpolatedAngle = MathUtils.lerp(
                0,
                Math.abs(planeRotation.targetAngle),
                t
            );
            const maxAngle = Math.abs(
                planeRotation.targetAngle - planeRotation.currentAngle
            );
            const angle =
                Math.min(interpolatedAngle, maxAngle) * rotationDirection;

            planeRotation.currentAngle += angle;

            this.rotatePlane(planeRotation.axis, planeRotation.index, angle);
        } else {
            this.setPlaneRotation(this.getNextMove());
        }
    }

    pushMove(move: Move) {
        if (this.planeRotation) {
            this.moveQueue.push(move);
        } else {
            this.setPlaneRotation(move);
        }
    }

    shuffleStart() {
        this.getNextMove = this.getRandomMove;
    }

    shuffleStop() {
        this.getNextMove = this.getNextMoveFromQueue;
    }

    private getNextMoveFromQueue(): Move | undefined {
        return this.moveQueue.shift();
    }

    private getRandomMove(): Move | undefined {
        /* const axes: Axis[] = ["x", "y", "z"];
        const angles = [1, -1].map((n) => (n * Math.PI) / 2);

        const axis = axes[MathUtils.randInt(0, 2)];
        const index = MathUtils.randInt(-1, 1);
        const angle = angles[MathUtils.randInt(0, 1)];

        return {axis, index, angle}; */

        return undefined;
    }

    private setPlaneRotation(move: Move | undefined) {
        if (!move) {
            this.planeRotation = undefined;
            return;
        }

        const { axis, index } = sidePlaneMap[move.side];

        const axisVector = new Vector3();
        axisVector[axis] = index;
        axisVector
        .applyAxisAngle(new Vector3(1, 0, 0), -this.cube.rotation.x)
        .applyAxisAngle(new Vector3(0, 1, 0), -this.cube.rotation.y)
        .applyAxisAngle(new Vector3(0, 0, 1), -this.cube.rotation.z);

        console.log(axisVector);

        

        const targetAngle = Math.PI / 2 * (move.inverse ? -1 : 1);

        this.planeRotation = {
            axis,
            index,
            currentAngle: 0,
            targetAngle,
        }
    }

    private rotatePlane(axis: Axis, index: number, angle: number) {
        const planeCenter = new Vector3(0, 0, 0);
        planeCenter[axis] = index;
        const rotationAxis = new Vector3(0, 0, 0);
        rotationAxis[axis] = 1;

        this.pieces.forEach((piece) => {
            if (Math.abs(piece.position[axis] - index) <= 0.01) {
                rotateAroundPoint(piece, planeCenter, rotationAxis, angle);
            }
        });
    }
}
