import { merge } from "lodash";
import { Group, MathUtils, Vector3 } from "three";
import { Updatable } from "../Updatable";
import { colorMap } from "../utils/colorMap";
import { rotateAroundPoint } from "../utils/transformUtils";
import { Piece, PieceColors } from "./Piece";

const CUBE_AMOUNT = 3;
const MIN_INDEX = 0;
const MAX_INDEX = CUBE_AMOUNT - 1;
const PIECE_OFFSET = (CUBE_AMOUNT - 1) / 2; // how much to offset each piece from the cube's center
const ROTATION_ANIMATION_DURATION = 250; // rotation animation duration in ms

interface Position {
    x: number;
    y: number;
    z: number;
}

const applyColors = (colors: PieceColors, position: Position) => {
    Object.entries(position).forEach(([key, value]) => {
        if (value === MIN_INDEX) {
            merge(colors, colorMap[key as keyof Position].bottom);
        } else if (value === MAX_INDEX) {
            merge(colors, colorMap[key as keyof Position].top);
        }
    });
};

const generatePieces = (): Piece[] => {
    const pieces: Piece[] = [];

    for (let x = 0; x < CUBE_AMOUNT; x++) {
        for (let y = 0; y < CUBE_AMOUNT; y++) {
            for (let z = 0; z < CUBE_AMOUNT; z++) {
                let colors: PieceColors = {};

                applyColors(colors, { x, y, z });

                const piece = new Piece(colors);
                piece.position.set(
                    x - PIECE_OFFSET,
                    y - PIECE_OFFSET,
                    z - PIECE_OFFSET
                );
                pieces.push(piece);
            }
        }
    }

    return pieces;
};

type Axis = "x" | "y" | "z";

interface PlaneRotation {
    axis: Axis;
    index: number;
    targetAngle: number;
    currentAngle: number;
}

interface Move {
    axis: Axis;
    index: number;
    angle: number;
}

export class RubiksCube extends Group implements Updatable {
    private pieces: Piece[];
    private planeRotation: PlaneRotation | undefined;
    private moveQueue: Move[];

    constructor() {
        super();

        this.pieces = generatePieces();
        this.add(...this.pieces);

        this.planeRotation = undefined;
        this.moveQueue = [];

        // @ts-ignore
        window.shuffle = () => {
            this.shuffle();
        };
    }

    tick(delta: number) {
        if (this.planeRotation) {
            const difference =
                this.planeRotation.targetAngle -
                this.planeRotation.currentAngle;

            if (Math.abs(difference) <= 0.1) {
                this.rotatePlane(
                    this.planeRotation.axis,
                    this.planeRotation.index,
                    difference
                );
                this.popMove();
                return;
            }

            const nextAngle =
                Math.min(
                    MathUtils.lerp(
                        0,
                        Math.abs(this.planeRotation.targetAngle),
                        (delta * 1000) / ROTATION_ANIMATION_DURATION
                    ),
                    Math.abs(this.planeRotation.targetAngle) -
                        Math.abs(this.planeRotation.currentAngle)
                ) * (this.planeRotation.targetAngle >= 0 ? 1 : -1);

            this.planeRotation.currentAngle += nextAngle;

            this.rotatePlane(
                this.planeRotation.axis,
                this.planeRotation.index,
                nextAngle
            );
        }
    }

    checkers() {
        this.pushMove({ axis: "z", index: 1, angle: Math.PI });
        this.pushMove({ axis: "z", index: -1, angle: Math.PI });
        this.pushMove({ axis: "y", index: 1, angle: Math.PI });
        this.pushMove({ axis: "y", index: -1, angle: Math.PI });
        this.pushMove({ axis: "x", index: 1, angle: Math.PI });
        this.pushMove({ axis: "x", index: -1, angle: Math.PI });
    }

    shuffle() {
        const axes: Axis[] = ["x", "y", "z"];
        const angles = [1, -1].map((n) => (n * Math.PI) / 2);

        for (let i = 0; i < 50; i++) {
            const axis = axes[MathUtils.randInt(0, 2)];
            const index = MathUtils.randInt(-1, 1);
            const angle = angles[MathUtils.randInt(0, 1)];

            this.pushMove({ axis, index, angle });
        }
    }

    private pushMove(move: Move) {
        if (this.planeRotation) {
            this.moveQueue.push(move);
        } else {
            this.setPlaneRotation(move);
        }
    }

    private popMove() {
        const move = this.moveQueue.shift();

        this.setPlaneRotation(move);
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
