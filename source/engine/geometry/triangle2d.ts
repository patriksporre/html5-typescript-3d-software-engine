/**
 * Project: html5-typescript-3d-software-engine
 * File: triangle2d.ts
 * Author: Patrik Sporre
 * License: MIT
 *
 * Description:
 *   Defines a basic Triangle2D class that stores three 2D points representing a filled triangle.
 *   This is the foundational data structure for all rasterisation techniques used in the engine.
 *   Color interpolation, texture coordinates, and lighting will build on top of this structure.
 */
import { Point2D } from "./point2d.js";

export class Triangle2D {
    public a: Point2D;
    public b: Point2D;
    public c: Point2D;

    /**
     * Creates a new triangle using three 2D points.
     *
     * @param a - First vertex
     * @param b - Second vertex
     * @param c - Third vertex
     */
    public constructor(a: Point2D, b: Point2D, c: Point2D) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    /**
     * Rotates the triangle around a given center point.
     *
     * @param angle - Rotation angle in radians
     * @param center - The point to rotate around (e.g. centroid or canvas centre)
     * @returns A new Triangle2D with rotated vertices
     */
    public rotate(angle: number, center: Point2D): Triangle2D {
        return new Triangle2D(
            this.a.rotate(angle, center.x, center.y),
            this.b.rotate(angle, center.x, center.y),
            this.c.rotate(angle, center.x, center.y)
        );
    }

    /**
     * Returns the triangle's centroid (average of its three points)
     */
    public centroid(): Point2D {
        return new Point2D(
            (this.a.x + this.b.x + this.c.x) / 3,
            (this.a.y + this.b.y + this.c.y) / 3
        );
    }

    /**
     * Returns the triangle's vertices sorted for scanline rasterisation.
     * Vertices are ordered by ascending Y-coordinate: [top, mid, bottom].
     * 
     * For flat-top and flat-bottom triangles, ensures left-to-right ordering
     * by comparing X coordinates if Y values are equal.
     *
     * This canonical ordering is used by all scanline-based fillers and eliminates
     * the need for extra checks during slope calculation and iteration.
     *
     * @returns A tuple [v0, v1, v2] sorted by Y and prepared for rasterisation.
     */
    public rasterOrder(): [Point2D, Point2D, Point2D] {
        let v0 = this.a;
        let v1 = this.b;
        let v2 = this.c;

        // Sort by Y coordinate
        if (v1.y < v0.y) { [v0, v1] = [v1, v0]; }
        if (v2.y < v1.y) { [v1, v2] = [v2, v1]; }
        if (v1.y < v0.y) { [v0, v1] = [v1, v0]; }

        // Fix winding order for flat-top
        if (v0.y === v1.y && v1.x < v0.x) {
            [v0, v1] = [v1, v0];
        }

        // Fix winding order for flat-bottom
        if (v1.y === v2.y && v2.x < v1.x) {
            [v1, v2] = [v2, v1];
        }

        return [v0, v1, v2];
    }

    /**
     * Returns a string representation of the triangle
     */
    public toString(): string {
        return `Triangle2D(${this.a.toString()}, ${this.b.toString()}, ${this.c.toString()})`;
    }
}