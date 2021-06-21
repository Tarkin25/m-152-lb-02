import { MathUtils, Object3D, Plane, PlaneHelper, Scene, Vector3 } from "three";
import { Move, Side } from "../../Move";
import { Updatable } from "../../Updatable";
import { Piece } from "./Piece";

const ROTATION_FACTOR = 1000 / 250;

const planeMap: Record<Side, Plane> = {
    R: new Plane(new Vector3(1, 0, 0), -1),
    L: new Plane(new Vector3(1, 0, 0), 1),
    F: new Plane(new Vector3(0, 0, 1), -1),
    B: new Plane(new Vector3(0, 0, 1), 1),
    U: new Plane(new Vector3(0, 1, 0), -1),
    D: new Plane(new Vector3(0, 1, 0), 1),
}

interface PlaneRotation {
    plane: Plane;
    targetAngle: number;
    currentAngle: number;
}

export class MoveController2 implements Updatable {

    private moveQueue: Move[] = [];
    private planeRotation: PlaneRotation | undefined = undefined;
    private getNextMove: () => Move | undefined;
    private planeHelper: PlaneHelper;

    constructor(private pieces: Piece[], private cube: Object3D, private scene: Scene) {
        this.getNextMove = this.getNextMoveFromQueue;
        this.planeHelper = new PlaneHelper(new Plane(), 4, 0xff0000);
        this.planeHelper.visible = false;
        scene.add(this.planeHelper);
    }

    tick(delta: number) {
        const rotation = this.planeRotation;

        if (rotation) {
            const difference = rotation.targetAngle - rotation.currentAngle;

            if (Math.abs(difference) <= 0.1) {
                // TODO: rotate the rest
                this.rotatePlane(rotation.plane, difference);

                this.setPlaneRotation(undefined);
                return;
            }

            const rotationDirection = rotation.targetAngle >= 0 ? 1 : -1;
            const t = delta * ROTATION_FACTOR;
            const interpolatedAngle = MathUtils.lerp(0, Math.abs(rotation.targetAngle), t);
            const maxAngle = Math.abs(difference);
            const angle = Math.min(interpolatedAngle, maxAngle) * rotationDirection;

            rotation.currentAngle += angle;

            // TODO: rotate plane
            this.rotatePlane(rotation.plane, angle);
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

    private setPlaneRotation(move: Move | undefined) {
        if (!move) {
            this.planeRotation = undefined;
            //this.planeHelper.visible = false;
            return;
        }

        let plane = planeMap[move.side];

        console.log(plane);

        const normal = plane.normal.clone();

        plane = new Plane(normal, plane.constant);
        
        console.log(plane);

        const targetAngle = Math.PI / 2 * (move.inverse ? -1 : 1);

        this.planeRotation = {
            plane,
            targetAngle,
            currentAngle: 0,
        }

        this.planeHelper.plane = plane;
        this.planeHelper.visible = true;
    }

    private getNextMoveFromQueue(): Move | undefined {
        return this.moveQueue.shift();
    }

    private rotatePlane(plane: Plane, angle: number) {
        const pieces = this.getNearestPieces(plane);

        this.pieces.forEach(piece => {
            piece.setHovered(false);
        })

        pieces.forEach(piece => {
            piece.setHovered(true);
        })
    }

    private getNearestPieces(plane: Plane) {
        const pieces = this.pieces.map(piece => {
            const worldPosition = new Vector3();
            piece.localToWorld(worldPosition);
            
            return {
                piece,
                worldPosition,
            }
        })
        pieces.sort((a, b) => plane.distanceToPoint(b.worldPosition) - plane.distanceToPoint(a.worldPosition));

        return pieces.slice(0, 9).map(piece => piece.piece);
    }
}