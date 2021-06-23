import { Camera, Object3D, Plane, Raycaster, Vector2, Vector3 } from "three";
import { enableControls, EventDispatcher, pushMove } from "../../systems/events";
import { Piece } from "./Piece";

function isDragSignificant(drag: Vector2) {
    return Math.abs(drag.x) >= 0.2 || Math.abs(drag.y) >= 0.2;
}

type Axis2 = "x" | "y";

type Axis3 = "x" | "y" | "z";

function getAxis(v: Vector3 | Vector2): Axis3 {
    return Object.entries(v).filter(([, value]) => Math.abs(value) !== 0)[0][0] as Axis3;
}

type Transitions = {
    [Face in Axis3]: {
        [Drag in Axis3]: Axis3;
    };
};

const transitions = {
    x: {
        x: 'y',
        y: 'z',
        z: 'y'
    },
    y: {
        x: 'z',
        y: 'x',
        z: 'x'
    },
    z: {
        x: 'y',
        y: 'x'
    }
} as Transitions;

export class DragController {
    private raycaster = new Raycaster();
    private dragStart = new Vector2(1, 1);
    private faceNormal: Vector3 | undefined = undefined;
    private draggedPiece: Piece | undefined = undefined;

    constructor(
        private camera: Camera,
        private target: Object3D,
        private container: HTMLElement
    ) {
        container.addEventListener("mousedown", (e) => this.mouseDown(e));
        container.addEventListener("mouseup", (e) => this.mouseUp(e));
    }

    private mouseDown(e: MouseEvent) {
        this.applyMouseEvent(e, this.dragStart);

        this.raycaster.setFromCamera(this.dragStart, this.camera);

        const intersects = this.raycaster
            .intersectObject(this.target, true)
            .filter(
                (intersect) =>
                    intersect.object.type === "Mesh" &&
                    intersect.object.parent?.type === "Piece"
            );

        // get the nearest mesh
        const intersect = intersects[0];

        const piece = intersect?.object.parent as Piece | undefined;
        this.draggedPiece = piece;

        if (piece) {
            EventDispatcher.dispatchEvent(enableControls(false));
        }

        this.faceNormal = intersect?.face?.normal;
    }

    private mouseUp(e: MouseEvent) {
        if (this.faceNormal && this.draggedPiece) {
            const dragVector = new Vector2();
            this.applyMouseEvent(e, dragVector);
            if (Math.abs(dragVector.x) < Math.abs(dragVector.y)) {
                dragVector.x = 0;
            } else {
                dragVector.y = 0;
            }

            if (isDragSignificant(dragVector)) {
                const faceAxis = getAxis(this.faceNormal);
                const dragAxis = getAxis(dragVector);

                const rotationAxis = transitions[faceAxis][dragAxis];
                
                const rotationVector = new Vector3();
                rotationVector[rotationAxis] = Math.sign(dragVector[dragAxis as Axis2]);

                const plane = new Plane(rotationVector, - this.draggedPiece.position[rotationAxis]);
                const angle = Math.PI / 2;

                EventDispatcher.dispatchEvent(pushMove({plane, angle}))
            }
        }

        EventDispatcher.dispatchEvent(enableControls(true));
        this.faceNormal = undefined;
    }

    private applyMouseEvent(e: MouseEvent, target: Vector2) {
        const bounds = this.container.getBoundingClientRect();

        const deltaX = e.clientX - bounds.left;
        const deltaY = e.clientY - bounds.top;

        target.x = (deltaX / bounds.width) * 2 - 1;
        target.y = -(deltaY / bounds.height) * 2 + 1;
    }
}
