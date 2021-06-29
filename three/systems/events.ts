import { EventDispatcher as ThreeEventDispatcher } from "three";
import { Move } from "../components/RubiksCube/Move";

export const EventDispatcher = new ThreeEventDispatcher();

export const SHUFFLE_START = "shuffle-start";
export const SHUFFLE_STOP = "shuffle-stop";
export const RESET = "reset";
export const PUSH_MOVE = "push-move";
export const CHECKERS = "checkers";
export const ENABLE_CONTROLS = "enable-controls";

export interface PushMoveEvent {
    type: typeof PUSH_MOVE;
    move: Move;
}

export const pushMove = (move: Move) => ({
    type: PUSH_MOVE,
    move,
})

export const shuffleStart = () => ({
    type: SHUFFLE_START
})

export const shuffleStop = () => ({
    type: SHUFFLE_STOP
})

export const reset = () => ({
    type: RESET
})

export const checkers = () => ({
    type: CHECKERS
})

export const enableControls = (enabled: boolean) => ({
    type: ENABLE_CONTROLS,
    enabled
})