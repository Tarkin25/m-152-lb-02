import { Camera, Group } from "three";
import { Updatable } from "../../Updatable";
import { generatePieces } from "./pieces";
import { InteractionController } from "./InteractionController";
import { Move } from "./Move";
import { MoveController } from "./MoveController";
import { Piece } from "./Piece";
import { planes } from "./planes";

export type Axis = "x" | "y" | "z";

export class RubiksCube extends Group implements Updatable {
    private pieces: Piece[];
    private moveController: MoveController;
    private interactionController: InteractionController;

    constructor(container: HTMLElement, camera: Camera) {
        super();

        this.pieces = generatePieces();
        this.add(...this.pieces);

        this.moveController = new MoveController(this.pieces, this);

        this.interactionController = new InteractionController(this.pieces, container, camera, this);
        this.interactionController.onTurnLeft = plane => {
            //this.moveController.pushMove({...plane, angle: -Math.PI / 2});
        }
        this.interactionController.onTurnRight = plane => {
            //this.moveController.pushMove({...plane, angle: Math.PI / 2});
        }
    }

    tick(delta: number) {
        this.moveController.tick(delta);
    }

    checkers() {
        planes.forEach(plane => {
            this.pushMove({plane, angle: Math.PI});
        })
    }

    shuffleStart() {
        this.moveController.shuffleStart();
    }

    shuffleStop() {
        this.moveController.shuffleStop();
    }

    reset() {
        this.remove(...this.pieces);
        this.pieces.length = 0;
        this.pieces.push(...generatePieces());
        this.add(...this.pieces);
    }

    private pushMove(move: Move) {
        this.moveController.pushMove(move);
    }
}
