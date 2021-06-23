import { Camera, Group } from "three";
import { CHECKERS, EventDispatcher, pushMove, RESET } from "../../systems/events";
import { ClickController } from "./ClickController";
import { HoverController } from "./HoverController";
import { MoveController } from "./MoveController";
import { Piece } from "./Piece";
import { generatePieces } from "./pieces";
import { planes } from "./planes";

export class RubiksCube extends Group {
    private pieces: Piece[];

    constructor(container: HTMLElement, camera: Camera) {
        super();

        this.pieces = generatePieces();
        this.add(...this.pieces);

        new MoveController(this.pieces);
        new HoverController(camera, this, container);
        new ClickController(camera, this, container);
        
        EventDispatcher.addEventListener(RESET, () => this.reset());
        EventDispatcher.addEventListener(CHECKERS, () => this.checkers());
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
