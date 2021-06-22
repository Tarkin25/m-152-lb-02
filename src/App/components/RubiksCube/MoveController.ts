import { MathUtils, Object3D, Plane, PlaneHelper } from "three";
import { Updatable } from "../../Updatable";
import { Move } from "./Move";
import { Piece } from "./Piece";
import { randomMove } from "./planes";

const ROTATION_ANIMATION_DURATION = 250; // rotation animation duration in ms
const ROTATION_FACTOR = 1000 / ROTATION_ANIMATION_DURATION;

interface PlaneRotation {
    plane: Plane;
    targetAngle: number;
    currentAngle: number;
}

export class MoveController implements Updatable {
    private planeRotation: PlaneRotation | undefined;
    private moveQueue: Move[];
    private getNextMove: () => Move | undefined;
    private planeHelper: PlaneHelper;

    constructor(private pieces: Piece[], cube: Object3D) {
        this.planeRotation = undefined;
        this.moveQueue = [];
        this.getNextMove = this.getNextMoveFromQueue;
        this.planeHelper = new PlaneHelper(new Plane(), 4, 0xff0000);
        this.planeHelper.visible = false;
        cube.add(this.planeHelper);
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
                    planeRotation.plane,
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

            this.rotatePlane(planeRotation.plane, angle);
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
        this.getNextMove = randomMove;
    }

    shuffleStop() {
        this.getNextMove = this.getNextMoveFromQueue;
    }

    private getNextMoveFromQueue(): Move | undefined {
        return this.moveQueue.shift();
    }

    private setPlaneRotation(move: Move | undefined) {
        if (!move) {
            this.planeRotation = undefined;
            this.planeHelper.visible = false;
            return;
        }

        this.planeRotation = {
            plane: move.plane,
            currentAngle: 0,
            targetAngle: move.angle,
        };

        this.planeHelper.plane.copy(move.plane);
        this.planeHelper.visible = true;
    }

    private rotatePlane(plane: Plane, angle: number) {
        const rotationAxis = plane.normal.clone();

        const axis = Object.entries(plane.normal).filter(([_, value]) => value !== 0)[0][0] as ('x' | 'y' | 'z');

        this.pieces.forEach((piece) => {
            if (Math.abs(piece.position[axis] + plane.constant) <= 0.1) {
                piece.parent!.localToWorld(piece.position);
                piece.position.applyAxisAngle(rotationAxis, angle);
                piece.parent!.worldToLocal(piece.position);
                piece.rotateOnWorldAxis(rotationAxis, angle);
            }
        });
    }
}
