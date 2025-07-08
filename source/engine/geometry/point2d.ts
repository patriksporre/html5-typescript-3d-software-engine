/**
 * Project: html5-typescript-3d-software-engine
 * File: Point2D.ts
 * Author: Patrik Sporre
 * License: MIT
 * 
 * Description:
 *   Defines a basic 2D point class used for geometric operations such as
 *   rotation, scaling, and translation.
 * 
 *   Design Note:
 *     This class follows an immutable design: all transformation methods return
 *     a new instance instead of mutating the original. This makes chaining safe,
 *     prevents side effects, and improves clarity during development and learning.
 */

export class Point2D {
    public x: number;
    public y: number;

    /**
     * Creates a new 2D point with the given x and y coordinates.
     * 
     * @param x - X coordinate
     * @param y - Y coordinate
     */
    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Rotates the point counter-clockwise around a pivot (default is origin).
     *
     * @param angle - Rotation angle in radians
     * @param x - X-coordinate of pivot (default: 0)
     * @param y - Y-coordinate of pivot (default: 0)
     * @returns A new rotated Point2D
     */
    public rotate(angle: number, x: number = 0, y: number = 0): Point2D {
        const cos: number = Math.cos(angle);
        const sin: number = Math.sin(angle);

        const dx: number = this.x - x;
        const dy: number = this.y - y;

        return new Point2D(
            x + dx * cos - dy * sin,
            y + dx * sin + dy * cos
        );
    }

    /**
     * Returns a new point scaled uniformly by the given factor.
     * 
     * @param scale - Uniform scaling factor
     * @returns A new Point2D instance
     */
    public scale(scale: number): Point2D {
        return new Point2D(
            this.x * scale,
            this.y * scale
        );
    }

    /**
     * Returns a new point translated by (dx, dy).
     * 
     * @param dx - X offset
     * @param dy - Y offset
     * @returns A new Point2D instance
     */
    public translate(dx: number, dy: number): Point2D {
        return new Point2D(
            this.x + dx,
            this.y + dy
        );
    }

    /**
     * Creates and returns a copy of this point.
     * 
     * @returns A new Point2D instance with the same coordinates
     */
    public clone(): Point2D {
        return new Point2D(
            this.x,
            this.y
        );
    }

    /**
     * Returns a string representation of the point with 2 decimal precision.
     * 
     * @returns A formatted string, e.g. \"(12.34, -56.78)\"
     */
    public toString(): string {
        return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
    }
}