import { Camera, Object3D, Plane, Raycaster, Vector2, Vector3 } from "three";
import { EventDispatcher, pushMove } from "../../systems/events";
import { useLoop } from "../../systems/Loop";
import { Updatable } from "../../Updatable";
import { Piece } from "./Piece";

type Axis = "x" | "y" | "z";

function getAxis(v: Vector3 | Vector2): Axis {
    return Object.entries(v).filter(
        ([, value]) => Math.abs(value) !== 0
    )[0][0] as Axis;
}

export class ClickController implements Updatable {
    private raycaster = new Raycaster();
    private mousePosition = new Vector2(1, 1);
    private hoveredPlane: Plane | undefined = undefined;

    constructor(
        private camera: Camera,
        private target: Object3D,
        private container: HTMLElement
    ) {
        container.addEventListener("mousemove", (e) => this.onMouseMove(e));
        container.addEventListener("mousedown", (e) => this.onMouseDown(e));

        useLoop(this);
    }

    tick() {
        this.raycaster.setFromCamera(this.mousePosition, this.camera);

        const intersects = this.raycaster
            .intersectObject(this.target, true)
            .filter(
                (intersect) =>
                    intersect.object.type === "Mesh" &&
                    intersect.object.parent?.type === "Piece"
            );

        // get the nearest mesh
        const intersect = intersects[0];

        if (intersect && intersect.face) {
            const piece = intersect.object.parent as Piece;
            const normal = intersect.face.normal
                .clone()
                .applyQuaternion(piece.quaternion)
                .round();
            const axis = getAxis(normal);
            const constant = -piece.position[axis];

            const planeNormal = new Vector3();
            planeNormal[axis] = normal[axis];

            const plane = new Plane(planeNormal, constant);

            this.setHoveredPlane(plane);
        } else {
            this.setHoveredPlane(undefined);
        }
    }

    private onMouseDown(e: MouseEvent) {
        if (this.hoveredPlane) {
            let direction: number | undefined = undefined;

            if (e.button === 0) {
                direction = 1;
            } else if (e.button === 2) {
                direction = -1;
            }

            if (direction) {
                const plane = this.hoveredPlane;
                const angle = Math.PI / 2 * direction;

                EventDispatcher.dispatchEvent(pushMove({plane, angle }));
            }
        }
    }

    private onMouseMove(e: MouseEvent) {
        const bounds = this.container.getBoundingClientRect();
        const deltaX = e.clientX - bounds.left;
        const deltaY = e.clientY - bounds.top;

        this.mousePosition.x = (deltaX / bounds.width) * 2 - 1;
        this.mousePosition.y = -(deltaY / bounds.height) * 2 + 1;
    }

    private setHoveredPlane(plane: Plane | undefined) {
        this.hoveredPlane = plane;
    }
}
