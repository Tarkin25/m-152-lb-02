export const Sides = ['R', 'L', 'U', 'D', 'F', 'B'] as const;

export type Side = typeof Sides[number];

export interface Move {
    side: Side;
    inverse: boolean;
}