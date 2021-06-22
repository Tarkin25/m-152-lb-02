import { Camera, Group } from "three";
import { CHECKERS, EventDispatcher, pushMove, RESET } from "../../systems/events";
import { Updatable } from "../../Updatable";
import { InteractionController2 } from "./InteractionController2";
import { MoveController } from "./MoveController";
import { Piece } from "./Piece";
import { generatePieces } from "./pieces";
import { planes } from "./planes";

export type Axis = "x" | "y" | "z";

export class RubiksCube extends Group implements Updatable {
    private pieces: Piece[];
    private moveController: MoveController;
    private interactionController: InteractionController2;

    constructor(container: HTMLElement, camera: Camera) {
        super();

        this.pieces = generatePieces();
        this.add(...this.pieces);

        this.moveController = new MoveController(this.pieces, this);

        this.interactionController = new InteractionController2(this.pieces, camera, this, container);
        
        EventDispatcher.addEventListener(RESET, () => this.reset());
        EventDispatcher.addEventListener(CHECKERS, () => this.checkers());
    }

    tick(delta: number) {
        this.interactionController.tick(delta);
        this.moveController.tick(delta);
    }

    checkers() {
        planes.forEach(plane => {
            EventDispatcher.dispatchEvent(pushMove({plane, angle: Math.PI}))
        })
    }

    reset() {
        this.remove(...this.pieces);
        this.pieces.length = 0;
        this.pieces.push(...generatePieces());
        this.add(...this.pieces);
    }
}
