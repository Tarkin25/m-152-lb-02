import { BoxBufferGeometry, MathUtils, Mesh, MeshStandardMaterial } from "three";
import { Updatable } from "../Updatable";

const radiansPerSecond = MathUtils.degToRad(30);

export class Cube extends Mesh implements Updatable {

    constructor() {
        const geometry = new BoxBufferGeometry(2,2,2);
        const material = new MeshStandardMaterial({color: 'purple'});

        super(geometry, material);

        this.rotation.set(-0.5, -0.1, 0.8);
    }

    tick(delta: number) {
        const increment = radiansPerSecond * delta;

        this.rotation.z += increment;
        this.rotation.x += increment;
        this.rotation.y += increment;
    }

}