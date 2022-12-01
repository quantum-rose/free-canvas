import { Vector2 } from '../math';

export interface MouseEventContext {
    event: MouseEvent;
    location: Vector2;
    modelLocation: Vector2;
}
