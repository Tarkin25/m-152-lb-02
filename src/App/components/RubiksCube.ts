import { merge } from "lodash";
import { Group, Vector3 } from "three";
import { Updatable } from "../Updatable";
import { colorMap } from "../utils/colorMap";
import { rotateAroundPoint } from "../utils/transformUtils";
import { Piece, PieceColors } from "./Piece";

const CUBE_AMOUNT = 3;
const MIN_INDEX = 0;
const MAX_INDEX = CUBE_AMOUNT - 1;
const PIECE_OFFSET = (CUBE_AMOUNT - 1) / 2; // how much to offset each piece from the cube's center

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
    })
}

const generatePieces = (): Piece[] => {
    const pieces: Piece[] = [];

    for (let x=0; x<CUBE_AMOUNT;x++) {
        for (let y=0;y<CUBE_AMOUNT;y++) {
            for (let z=0;z<CUBE_AMOUNT;z++) {
                let colors: PieceColors = {};

                applyColors(colors, {x, y, z});

                const piece = new Piece(colors);
                piece.position.set(x-PIECE_OFFSET, y-PIECE_OFFSET, z-PIECE_OFFSET);
                pieces.push(piece);
            }
        }
    }

    return pieces;
}

export class RubiksCube extends Group implements Updatable {
    private pieces: Piece[];

    constructor() {
        super();

        this.pieces = generatePieces();
        this.add(...this.pieces);
    }

    tick(delta: number) {
        this.rotatePlane("z", 1, delta);
    }

    private rotatePlane(axis: "x" | "y" | "z", index: number, angle: number) {
        const planeCenter = new Vector3(0, 0, 0);
        planeCenter[axis] = index;
        const rotationAxis = new Vector3(0, 0, 0);
        rotationAxis[axis] = 1;

        this.pieces.forEach(piece => {
            if (piece.position[axis] === index) {
                rotateAroundPoint(piece, planeCenter, rotationAxis, angle);
            }
        })
    }
}