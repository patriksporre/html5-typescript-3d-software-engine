/**
 * Project: html5-typescript-3d-software-engine
 * File: line.ts
 * Author: Patrik Sporre
 * License: MIT
 *
 * Description:
 *   Provides line rasterisation methods using both the DDA (Digital Differential Analyzer)
 *   and Bresenham algorithms.
 *
 *   DDA:
 *     - Uses floating-point interpolation
 *     - Steps from point A to B using sub-pixel increments
 *     - Simple and educational; ideal for soft logic and prototyping
 *
 *   Bresenham:
 *     - Uses integer-only arithmetic
 *     - More efficient and precise for exact pixel rendering
 *     - Handles all octants and line directions
 *
 *   These implementations serve as a foundation for future features such as:
 *     - Line clipping (Liang-Barsky, Cohen-Sutherland)
 *     - Triangle rasterisation
 *     - Polygon filling and shading techniques
 */
import { Blitter } from "../blitter.js";
import { Color4 } from "../color/color4.js";
import { clipLineLiangBarsky } from "../geometry/clip.js";
import { Point2D } from "../geometry/point2d.js";

/**
 * Draws a line between two points using the Bresenham line algorithm.
 * 
 * This version handles all octants and directions using integer logic.
 * Compared to DDA, it avoids floating-point operations, making it faster and pixel-exact.
 * 
 * @param blitter - The drawing surface
 * @param a - Start point (Point2D)
 * @param b - End point (Point2D)
 * @param color - Colour to draw the line (defaults to Color4.black)
 * @param clip - Whether to apply clipping using the blitter's clip region
 * @param backbuffer - Optional backbuffer to draw into (defaults to blitter's internal buffer)
 */
export function drawLineBresenham(blitter: Blitter, a: Point2D, b: Point2D, color: Color4, clip: boolean, backbuffer: Uint32Array): void {
    if (clip) {
        const clipped: { a: Point2D; b: Point2D } | null = clipLineLiangBarsky(a, b, blitter.clipping);

        // Check if line is completelly outside
        if (!clipped) return;

        a = clipped.a;
        b = clipped.b;
    }

    // Floor input coordinates to ensure pixel alignment
    let x0: number = Math.floor(a.x);
    let y0: number = Math.floor(a.y);
    let x1: number = Math.floor(b.x);
    let y1: number = Math.floor(b.y);

    // Calculate absolute distances
    const deltaX: number = Math.abs(x1 - x0);
    const deltaY: number = Math.abs(y1 - y0);

    // Determine the direction of each axis
    const stepX: number = x0 < x1 ? 1 : -1;
    const stepY: number = y0 < y1 ? 1 : -1;

    // Initialize the error term
    let error: number = deltaX - deltaY;

    // Main loop: continue plotting until end point is reached
    while (true) {
        blitter.setPixel(x0, y0, color, false, backbuffer);

        // Exit condition: end of line reached
        if (x0 === x1 && y0 === y1) break;

        // Error is doubled to compare without using floats
        const doubleError = 2 * error;

        // Horizontal step
        if (doubleError > -deltaY) {
            error -= deltaY;
            x0 += stepX;
        }

        // Vertical step
        if (doubleError < deltaX) {
            error += deltaX;
            y0 += stepY;
        }
    }
}

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
    if (clip) {
        const clipped: { a: Point2D; b: Point2D } | null = clipLineLiangBarsky(a, b, blitter.clipping);

        // Check if line is completelly outside
        if (!clipped) return;

        a = clipped.a;
        b = clipped.b;
    }

    // Calculate differences in x and y
    const deltaX: number = b.x - a.x;
    const deltaY: number = b.y - a.y;

    // Determine the number of steps based on the axis with the greatest distance
    const steps: number = Math.max(Math.abs(deltaX), Math.abs(deltaY));

    // If both points are the same, plot a single pixel
    if (steps === 0) {
        blitter.setPixel(a.x, a.y, color, clip, backbuffer);
        return;
    }

    // Compute the small delta added to x and y each step
    const stepX: number = deltaX / steps;
    const stepY: number = deltaY / steps;

    // Start at point a
    let x: number = a.x;
    let y: number = a.y;

    // Incrementally plot each step along the line
    for (let i: number = 0; i <= steps; i++) {
        blitter.setPixel(x, y, color, false, backbuffer);
        x += stepX;
        y += stepY;
    }
}