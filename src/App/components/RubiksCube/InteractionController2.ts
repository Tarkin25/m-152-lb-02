import { Camera, Object3D, Raycaster, Vector2 } from "three";
import { enableControls, EventDispatcher } from "../../systems/events";
import { useLoop } from "../../systems/Loop";
import { Updatable } from "../../Updatable";
import { Piece } from "./Piece";

export class InteractionController2 implements Updatable {
    private raycaster: Raycaster;
    private mousePosition: Vector2;
    private bounds: DOMRect;
    private hoveredPiece: Piece | undefined = undefined;

    constructor(
        private camera: Camera,
        private target: Object3D,
        private container: HTMLElement
    ) {
        this.raycaster = new Raycaster();
        this.mousePosition = new Vector2(1, 1);
        this.bounds = container.getBoundingClientRect();

        this.setupListeners();

        useLoop(this);
    }

    tick(delta: number) {
        this.raycaster.setFromCamera(this.mousePosition, this.camera);

        this.hoverPiece();
    }

    private setupListeners() {
        this.container.addEventListener("mousemove", (e) => {
            this.onMouseMove(e);
        });

        this.container.addEventListener("mousedown", (e) => {
            this.onMouseDown(e);
        });

        this.container.addEventListener("mouseup", (e) => {
            this.onMouseUp(e);
        });

        window.addEventListener("resize", () => {
            this.bounds = this.container.getBoundingClientRect();
        });
    }

    private onMouseMove(e: MouseEvent) {
        this.mousePosition.x =
            ((e.clientX - this.bounds.left) / this.bounds.width) * 2 - 1;
        this.mousePosition.y =
            -((e.clientY - this.bounds.top) / this.bounds.height) * 2 + 1;
    }

    private onMouseDown(_e: MouseEvent) {
        if (this.hoveredPiece) {
            EventDispatcher.dispatchEvent(enableControls(false));
        }
    }

    private onMouseUp(_e: MouseEvent) {
        EventDispatcher.dispatchEvent(enableControls(true));
    }

    private hoverPiece() {
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

    private setHoveredPiece(piece: Piece | undefined) {
        if (piece && !this.hoveredPiece) {
            piece.setHovered(true);
            this.hoveredPiece = piece;
        } else if (piece && this.hoveredPiece) {
            if (this.hoveredPiece.id !== piece.id) {
                this.hoveredPiece.setHovered(false);
                piece.setHovered(true);
                this.hoveredPiece = piece;
            }
        } else if (!piece && this.hoveredPiece) {
            this.hoveredPiece.setHovered(false);
            this.hoveredPiece = piece;
        }
    }
}
