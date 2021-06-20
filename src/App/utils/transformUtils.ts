import { Object3D, Vector3 } from "three";

/**
 * Rotates an object round a given point
 * @param object the object to be rotated
 * @param rotationPoint the point to rotate around
 * @param axis the axis to rotate around
 * @param angle the angle to rotate in radials
 */
export function rotateAroundPoint(object: Object3D, rotationPoint: Vector3, axis: Vector3, angle: number) {
    object.parent?.localToWorld(object.position); // compensate for world coordinates

    object.position.sub(rotationPoint); // remove the offset
    object.position.applyAxisAngle(axis, angle); // rotate the position
    object.position.add(rotationPoint); // re-add the offset
    
    object.parent?.worldToLocal(object.position); // undo world coordinates compenstation
    object.rotateOnWorldAxis(axis, angle); // rotate the object
}