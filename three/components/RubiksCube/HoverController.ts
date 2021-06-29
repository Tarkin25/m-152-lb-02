import { Camera, Object3D, Raycaster, Vector2 } from "three";
import { useLoop } from "../../systems/Loop";
import { Updatable } from "../../Updatable";
import { Piece } from "./Piece";

export class HoverController implements Updatable {

    private raycaster = new Raycaster();
    private mousePosition = new Vector2(1,1);

    constructor(
        private camera: Camera,
        private target: Object3D,
        private container: HTMLElement,
    ) {
        container.addEventListener('mousemove', e => {
            this.onMouseMove(e);
        })

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
    
        const piece = intersect?.object.parent as Piece | undefined;
        this.setHoveredPiece(piece);
    }

    private onMouseMove(e: MouseEvent) {
        const bounds = this.container.getBoundingClientRect();

        const deltaX = e.clientX - bounds.left;
        const deltaY = e.clientY - bounds.top;

        this.mousePosition.x = (deltaX / bounds.width) * 2 - 1;
        this.mousePosition.y = -(deltaY / bounds.height) * 2 + 1;
    }

    private setHoveredPiece(piece: Piece | undefined) {
        if (piece) {
            this.container.style.cursor = "pointer";
        } else {
            this.container.style.cursor = "initial";
        }
    }
}