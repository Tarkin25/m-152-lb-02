import { Object3D, Vector2 } from "three";

export class RotationControls {

    private mouseDown: boolean = false;
    private mouse = new Vector2();

    constructor(private targetObject: Object3D, canvas: HTMLCanvasElement) {
        this.targetObject = targetObject;
        canvas.addEventListener('mousedown', e => {
            this.onMouseDown(e);
        });
        canvas.addEventListener('mouseup', e => {
            this.onMouseUp(e);
        });
        canvas.addEventListener('mousemove', e => {
            this.onMouseMove(e);
        });
    }

    private onMouseDown(e: MouseEvent) {
        this.mouseDown = true;
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }

    private onMouseUp(_e: MouseEvent) {
        this.mouseDown = false;
    }

    private onMouseMove(e: MouseEvent) {
        if (this.mouseDown) {
            const deltaX = e.clientX - this.mouse.x;
            const deltaY = e.clientY - this.mouse.y;

            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

            this.targetObject.rotation.y += deltaX / 200 * ((Math.abs(this.targetObject.rotation.x) > Math.PI / 2) ? -1 : 1);
            this.targetObject.rotation.x += deltaY / 200;
        }
    }
}