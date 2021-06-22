import { BoxBufferGeometry, Color, DoubleSide, EdgesGeometry, Group, LineBasicMaterial, LineSegments, Mesh, MeshStandardMaterial } from "three";
import { BLACK } from "../../utils/colors";

interface PieceColorsInternal {
    0: Color | undefined;
    1: Color | undefined;
    2: Color | undefined;
    3: Color | undefined;
    4: Color | undefined;
    5: Color | undefined;
}

export interface PieceColors extends Partial<PieceColorsInternal> {}

// @ts-ignore
const defaultColors: PieceColorsInternal = {...Array(6).fill(BLACK)};

const createPieceColors = (colors: PieceColors): PieceColorsInternal => ({
    ...defaultColors,
    ...colors,
})

const createMaterials = (colors: PieceColorsInternal) => 
Object.values(colors).map(color => new MeshStandardMaterial({color, side: DoubleSide}))

export class Piece extends Group {

    private cube: Mesh<BoxBufferGeometry, MeshStandardMaterial[]>;
    private lines: LineSegments<EdgesGeometry, LineBasicMaterial>;

    constructor(colors: PieceColors) {
        super();
        // @ts-ignore
        this.type = "Piece";

        const materials = createMaterials(createPieceColors(colors));
        const geometry = new BoxBufferGeometry(1, 1, 1);
        this.cube = new Mesh(geometry, materials);
        this.add(this.cube);

        const edges = new EdgesGeometry(geometry);
        this.lines = new LineSegments(edges, new LineBasicMaterial({color: BLACK, clipIntersection: true, linewidth: 5}));
        this.add(this.lines);
    }

    setHovered(hovered: boolean) {
        if (hovered) {
            this.cube.material.forEach(material => {
                material.emissive.set(0xff00ff).multiplyScalar(0.5);
                material.needsUpdate = true;
            })
        } else {
            this.cube.material.forEach(material => {
                material.emissive.set(0);
                material.needsUpdate = true;
            })
        }
    }
}
