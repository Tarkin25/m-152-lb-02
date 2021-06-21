import { Group, MathUtils } from "three";
import { Updatable } from "../../Updatable";
import { generatePieces } from "./generate";
import { Axis, Move, MoveController } from "./MoveController";
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
        window.shuffle = () => {
            this.shuffle();
        };
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
        this.moveController.pushMove(move);
    }
}
