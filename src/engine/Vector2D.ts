// src/engine/Vector2D.ts


/**
 * Simple 2D Vector class to handle physical calculations.
 */
export class Vector2D {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Adds another vector to this one.
     */
    add(v: Vector2D): void {
        this.x += v.x;
        this.y += v.y;
    }

    /**
     * Multiplies the vector by a scalar.
     */
    scale(scalar: number): Vector2D {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }

    /**
     * Returns a copy of the vector.
     */
    clone(): Vector2D {
        return new Vector2D(this.x, this.y);
    }
}