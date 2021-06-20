import { PieceColors } from "../components/Piece";
import { BLUE, GREEN, ORANGE, RED, WHITE, YELLOW } from "./colors";

interface ColorMap {
    x: { bottom: PieceColors, top: PieceColors },
    y: { bottom: PieceColors, top: PieceColors },
    z: { bottom: PieceColors, top: PieceColors },
}

export const colorMap: ColorMap = {
    x: {
        bottom: { 1: ORANGE },
        top: { 0: RED },
    },
    y: {
        bottom: { 3: WHITE },
        top: { 2: YELLOW },
    },
    z: {
        bottom: { 5: GREEN },
        top: { 4: BLUE },
    },
};