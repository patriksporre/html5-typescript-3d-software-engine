/**
 * Project: html5-typescript-3d-software-engine
 * File: clip.ts
 * Author: Patrik Sporre
 * License: MIT
 *
 * Description:
 *   Provides geometric clipping utilities for 2D rendering.
 *
 *   This file implements the Liang–Barsky line clipping algorithm,
 *   which efficiently clips a line segment to a rectangular clipping region.
 *   It is based on a parametric line representation and avoids per-pixel logic.
 *
 *   The algorithm works by determining the entry and exit values (tMin, tMax)
 *   for a parametric line equation:
 *
 *     P(t) = A + t * (B - A), where t in [0, 1]
 *
 *   The visible portion of the line is where all four edge constraints are satisfied.
 *   If no such region exists, the function returns null.
 */
import { Clipping } from "../blitter/clipping.js";
import { Point2D } from "./point2d.js";

/**
 * Clips a line segment against a rectangular clipping region using the Liang–Barsky algorithm.
 *
 * The line is expressed parametrically as:
 *   P(t) = a + t * (b - a), where t ∈ [0, 1]
 *
 * Each clipping edge defines a constraint on this parameter range.
 * The algorithm updates tMin (entry point) and tMax (exit point)
 * to identify the portion of the line that lies inside the clip rectangle.
 *
 * If the resulting range is valid (tMin ≤ tMax), the clipped line is returned.
 * Otherwise, the line lies completely outside and is rejected.
 *
 * @param a - Start point of the line segment
 * @param b - End point of the line segment
 * @param clipping - The rectangular clipping region
 * @returns A clipped segment {a, b} or null if the segment lies entirely outside
 */
export function clipLineLiangBarsky (a: Point2D, b: Point2D, clipping: Clipping): {a: Point2D, b: Point2D} | null {
    const deltaX: number = b.x - a.x;
    const deltaY: number = b.y - a.y;

    let tMin: number = 0;
    let tMax: number = 1;

    // Clip to last valid pixel (inclusive) – canvas pixels are 0-indexed
    // so maxX and maxY are exclusive bounds (e.g. width/height), and max - 1 is last visible pixel
    if (
        testEdge(-deltaX, a.x - clipping.minX) &&       // Left
        testEdge(deltaX, (clipping.maxX - 1) - a.x) &&  // Right
        testEdge(-deltaY, a.y - clipping.minY) &&       // Top
        testEdge(deltaY, (clipping.maxY - 1) - a.y)     // Bottom
    ) {
        return {
            a: new Point2D(a.x + tMin * deltaX, a.y + tMin * deltaY),
            b: new Point2D(a.x + tMax * deltaX, a.y + tMax * deltaY)
        }
    }

    // Entirerly outside the clipping region
    return null; 

    /**
     * Tests a single edge of the clip rectangle and adjusts the current [tMin, tMax] interval.
     *
     * @param delta - The direction component of the line (deltaX or deltaY)
     * @param distance - Distance from point a to the clipping edge
     * @returns True if the segment is still partially inside the region; false if fully outside
     */
    function testEdge(delta: number, distance: number): boolean {
        // Check if line is parallel to this edge — reject if outside
        if (delta === 0) return distance >= 0;

        const t: number = distance / delta;

        if (delta < 0) {
            // Potential entry point
            if (t > tMax) return false;
            if (t > tMin) tMin = t;
        } else {
            // Potential exit point
            if (t < tMin) return false;
            if (t < tMax) tMax = t;
        }

        return true;
    }
}