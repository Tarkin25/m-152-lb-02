import { Camera, LineSegments, Object3D, Plane, PlaneHelper, Raycaster, Vector2, Vector3 } from "three";
import { Piece } from "./Piece";
import { Axis } from "./RubiksCube";

interface WhackPlane {
    axis: Axis;
    index: number;
}

export class InteractionController {
    private raycaster: Raycaster;
    private mouse: Vector2;
    private plane: WhackPlane | undefined;
    private planeHelper: PlaneHelper;

    constructor(
        private pieces: Piece[],
        private container: HTMLElement,
        private camera: Camera,
        private target: Object3D,
    ) {
        this.raycaster = new Raycaster();
        this.mouse = new Vector2();
        this.plane = undefined;
        this.planeHelper = new PlaneHelper(new Plane(), 4, 0xff0000);
        this.planeHelper.visible = false;
        this.target.add(this.planeHelper);

        container.addEventListener("mousemove", (e) => {
            this.onMouseMove(e);
            this.checkInteraction();
        });

        container.addEventListener("contextmenu", () => {
            this.onClick();
        })

        container.addEventListener("click", () => {
            this.onContextMenu();
        })
    }

    onTurnLeft(_plane: WhackPlane) {}

    onTurnRight(_plane: WhackPlane) {}

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
            (intersect) => intersect.object.type === "Mesh"
        )[0];

        if (intersect) {
            if (intersect.face) {
                const object = intersect.object as LineSegments;
                const piece = object.parent! as Piece;
                //piece.setHovered(true);
                
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
        this.mouse.x = (e.clientX / this.container.clientWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / this.container.clientHeight) * 2 + 1;
    }

    private hoverPlane(axis: Axis, index: number) {
        const normal = new Vector3();
        normal[axis] = index;
        const swap = normal.x;
        normal.x = normal.z;
        normal.z = swap;

        this.planeHelper.plane.normal = normal;
        this.planeHelper.plane.constant = -1;
        this.planeHelper.visible = true;

        console.log(this.planeHelper.plane);

        this.pieces.forEach((piece) => {
            if (Math.abs(piece.position[axis] - index) <= 0.01) {
                piece.setHovered(true);
            }
        });
    }
}
