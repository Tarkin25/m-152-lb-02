import { Group } from "three";
import { Updatable } from "../../Updatable";
import { generatePieces } from "./generate";
import { Move, MoveController } from "./MoveController";
import { Piece } from "./Piece";

export class RubiksCube extends Group implements Updatable {
    private pieces: Piece[];
    private moveController: MoveController;

    constructor() {
        super();

        this.pieces = generatePieces();
        this.add(...this.pieces);

        this.moveController = new MoveController(this.pieces);

        // @ts-ignore
        window.shuffleStart = () => {
            this.moveController.shuffleStart();
        }

        // @ts-ignore
        window.shuffleStop = () => {
            this.moveController.shuffleStop();
        }
    }

    tick(delta: number) {
        this.moveController.tick(delta);
    }

    checkers() {
        this.pushMove({ axis: "z", index: 1, angle: Math.PI });
        this.pushMove({ axis: "z", index: -1, angle: Math.PI });
        this.pushMove({ axis: "y", index: 1, angle: Math.PI });
        this.pushMove({ axis: "y", index: -1, angle: Math.PI });
        this.pushMove({ axis: "x", index: 1, angle: Math.PI });
        this.pushMove({ axis: "x", index: -1, angle: Math.PI });
    }

    private pushMove(move: Move) {
        this.moveController.pushMove(move);
    }
}
