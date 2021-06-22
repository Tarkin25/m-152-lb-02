import { Camera, Group } from "three";
import { Updatable } from "../../Updatable";
import { generatePieces } from "./generate";
import { InteractionController } from "./InteractionController";
import { Move, MoveController } from "./MoveController";
import { Piece } from "./Piece";

export type Axis = "x" | "y" | "z";

export class RubiksCube extends Group implements Updatable {
    private pieces: Piece[];
    private moveController: MoveController;
    private interactionController: InteractionController;

    constructor(container: HTMLElement, camera: Camera) {
        super();

        this.pieces = generatePieces();
        this.add(...this.pieces);

        this.moveController = new MoveController(this.pieces);

        this.interactionController = new InteractionController(this.pieces, container, camera, this);
        this.interactionController.onTurnLeft = plane => {
            this.moveController.pushMove({...plane, angle: -Math.PI / 2});
        }
        this.interactionController.onTurnRight = plane => {
            this.moveController.pushMove({...plane, angle: Math.PI / 2});
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

    shuffleStart() {
        this.moveController.shuffleStart();
    }

    shuffleStop() {
        this.moveController.shuffleStop();
    }

    reset() {
        this.remove(...this.pieces);
        this.pieces = generatePieces();
        this.moveController.setPieces(this.pieces);
        this.interactionController.setPieces(this.pieces);
        this.add(...this.pieces);
    }

    private pushMove(move: Move) {
        this.moveController.pushMove(move);
    }
}
