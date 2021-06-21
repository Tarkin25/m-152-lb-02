import { Group, Scene } from "three";
import { Move } from "../../Move";
import { Updatable } from "../../Updatable";
import { generatePieces } from "./generate";
import { MoveController2 } from "./MoveController2";
import { Piece } from "./Piece";

export class RubiksCube extends Group implements Updatable {
    private pieces: Piece[];
    private moveController: MoveController2;

    constructor(scene: Scene) {
        super();

        this.pieces = generatePieces();
        this.add(...this.pieces);

        this.moveController = new MoveController2(this.pieces, this, scene);
    }

    tick(delta: number) {
        this.moveController.tick(delta);
    }

    shuffleStart() {
        //this.moveController.shuffleStart();
    }

    shuffleStop() {
        //this.moveController.shuffleStop();
    }

    pushMove(move: Move) {
        this.moveController.pushMove(move);
    }
}
