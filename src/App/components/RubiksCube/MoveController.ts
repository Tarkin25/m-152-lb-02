import { MathUtils, Vector3 } from "three";
import { Updatable } from "../../Updatable";
import { rotateAroundPoint } from "../../utils/transformUtils";
import { Piece } from "./Piece";

const ROTATION_ANIMATION_DURATION = 250; // rotation animation duration in ms
const ROTATION_FACTOR = 1000 / ROTATION_ANIMATION_DURATION;

export type Axis = "x" | "y" | "z";

interface PlaneRotation {
    axis: Axis;
    index: number;
    targetAngle: number;
    currentAngle: number;
}

export interface Move {
    axis: Axis;
    index: number;
    angle: number;
}

export class MoveController implements Updatable {
    private planeRotation: PlaneRotation | undefined;
    private moveQueue: Move[];
    private getNextMove: () => Move | undefined;

    constructor(private pieces: Piece[]) {
        this.planeRotation = undefined;
        this.moveQueue = [];
        this.getNextMove = this.getNextMoveFromQueue;
    }

    tick(delta: number) {
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
        const axes: Axis[] = ["x", "y", "z"];
        const angles = [1, -1].map((n) => (n * Math.PI) / 2);

        const axis = axes[MathUtils.randInt(0, 2)];
        const index = MathUtils.randInt(-1, 1);
        const angle = angles[MathUtils.randInt(0, 1)];

        return {axis, index, angle};
    }

    private setPlaneRotation(move: Move | undefined) {
        this.planeRotation = move
            ? {
                  axis: move.axis,
                  index: move.index,
                  targetAngle: move.angle,
                  currentAngle: 0,
              }
            : undefined;
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
