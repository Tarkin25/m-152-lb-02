import { Camera, LineSegments, Object3D, Raycaster, Vector2, WebGLRenderer } from "three";
import { Piece } from "./Piece";
import { Axis } from "./RubiksCube";

interface Plane {
    axis: Axis;
    index: number;
}

export class InteractionController {
    private raycaster: Raycaster;
    private mouse: Vector2;
    private plane: Plane | undefined;

    constructor(
        private pieces: Piece[],
        private camera: Camera,
        private target: Object3D,
        private renderer: WebGLRenderer,
    ) {
        this.raycaster = new Raycaster();
        this.mouse = new Vector2();
        this.plane = undefined;

        const canvas = renderer.domElement;

        canvas.addEventListener("mousemove", (e) => {
            this.onMouseMove(e);
            this.checkInteraction();
        });

        canvas.addEventListener("contextmenu", () => {
            this.onClick();
        })

        canvas.addEventListener("click", () => {
            this.onContextMenu();
        })
    }

    onTurnLeft(_plane: Plane) {}

    onTurnRight(_plane: Plane) {}

    private onClick() {
        if (this.plane) {
            this.onTurnLeft(this.plane);
        }
    }

    private onContextMenu() {
        if(this.plane) {
            this.onTurnRight(this.plane);
        }
    }

    private checkInteraction() {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        this.pieces.forEach((piece) => piece.setHovered(false));

        const intersects = this.raycaster.intersectObject(this.target, true);
        const intersect = intersects.filter(
            (intersect) => intersect.object.type !== "LineSegments"
        )[0];

        if (intersect) {
            if (intersect.face) {
                const object = intersect.object as LineSegments;
                const piece = object.parent! as Piece;

                const normal = intersect.face.normal.clone().applyQuaternion(piece.quaternion).round();

                const axis = Object.entries(normal).filter(([_key, value]) => Math.abs(value) !== 0)[0][0] as Axis;
                const index = piece.position[axis];

                this.plane = {axis, index};
                this.hoverPlane(axis, index);
            }

        } else {
            this.plane = undefined;
        }
    }

    private onMouseMove(e: MouseEvent) {
        const canvasBounds = (this.renderer.getContext().canvas as HTMLCanvasElement).getBoundingClientRect();
        this.mouse.x = ((e.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1;
        this.mouse.y = -((e.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 + 1;
    }

    private hoverPlane(axis: Axis, index: number) {
        this.pieces.forEach((piece) => {
            if (Math.abs(piece.position[axis] - index) <= 0.01) {
                piece.setHovered(true);
            }
        });
    }
}
