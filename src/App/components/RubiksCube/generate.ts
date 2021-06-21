import { merge } from "lodash";
import { colorMap } from "../../utils/colorMap";
import { PieceColors, Piece } from "./Piece";

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
    });
};

export const generatePieces = (): Piece[] => {
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