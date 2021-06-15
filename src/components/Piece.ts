import { BoxGeometry, EdgesGeometry, LineBasicMaterial, LineSegments, Mesh, MeshStandardMaterial, Scene } from "three";

export default class Piece {
    private cube: Mesh;
    private lines: LineSegments;

    constructor(scene: Scene) {
        const geometry = new BoxGeometry(1,1,1);
        const edges = new EdgesGeometry(geometry);
        const material = new MeshStandardMaterial({color: "orange"});
        this.cube = new Mesh(geometry, material);
        scene.add(this.cube);
        
        this.lines = new LineSegments(edges, new LineBasicMaterial({color: 0}));
        scene.add(this.lines);
    }

    get position() {
        return this.cube.position;
    }

    get rotation() {
        return this.cube.rotation;
    }
}