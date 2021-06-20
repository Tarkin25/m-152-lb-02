export interface Updatable {
    /**
     * Perform a tick (step) of an animation
     * @param delta number of seconds elapsed since the last tick
     */
    tick(delta: number): void;
}