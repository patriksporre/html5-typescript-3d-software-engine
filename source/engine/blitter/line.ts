/**
 * Project: html5-typescript-3d-software-engine
 * File: line.ts
 * Author: Patrik Sporre
 * License: MIT
 * 
 * Description:
 *   Provides DDA (Digital Differential Analyzer) line rasterisation.
 *   This implementation draws a line between two points with sub-pixel precision
 *   using floating-point interpolation.
 * 
 *   The DDA algorithm is simple, efficient, and useful for educational purposes.
 *   It operates by stepping along the axis of greatest length (either X or Y),
 *   computing small incremental steps in both directions.
 * 
 *   This method provides a baseline for later improvements such as:
 *     - Integer-based Bresenham algorithm
 *     - Line clipping (Liang-Barsky, Cohen-Sutherland)
 *     - Shading, interpolation, and triangle rasterisation
 */

import { Blitter } from "../blitter.js";
import { Color4 } from "../color/color4.js";
import { Point2D } from "../geometry/point2d.js";

/**
 * Draws a line between two points using the DDA (Digital Differential Analyzer) algorithm.
 * 
 * This algorithm works by determining the axis with the greatest distance (dx or dy),
 * calculating how many steps are needed to traverse from point A to point B, and then
 * incrementing the position along both axes by a small delta per step.
 * 
 * Example:
 *   If dx = 100 and dy = 50, then 100 steps are used.
 *   Each step moves x by 1.0 and y by 0.5.
 * 
 * @param blitter - The drawing surface
 * @param a - Start point (Point2D)
 * @param b - End point (Point2D)
 * @param color - Colour to draw the line
 * @param clip - Whether to apply clipping using the blitter's clip region
 * @param backbuffer - Optional backbuffer to draw into (defaults to blitter's internal buffer)
 */
export function drawLineDDA(blitter: Blitter, a: Point2D, b: Point2D, color: Color4, clip: boolean, backbuffer: Uint32Array): void {
    // Calculate differences in x and y
    const dx: number = b.x - a.x;
    const dy: number = b.y - a.y;

    // Determine the number of steps based on the axis with the greatest distance
    const steps: number = Math.max(Math.abs(dx), Math.abs(dy));

    // If both points are the same, plot a single pixel
    if (steps === 0) {
        blitter.setPixel(a.x, a.y, color, clip, backbuffer);
        return;
    }

    // Compute the small delta added to x and y each step
    const stepX: number = dx / steps;
    const stepY: number = dy / steps;

    // Start at point a
    let x: number = a.x;
    let y: number = a.y;

    // Incrementally plot each step along the line
    for (let i: number = 0; i <= steps; i++) {
        blitter.setPixel(x, y, color, clip, backbuffer);
        x += stepX;
        y += stepY;
    }
}