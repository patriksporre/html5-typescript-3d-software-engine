/**
 * Project: html5-typescript-3d-software-engine
 * File: demo.ts
 * Author: Patrik Sporre
 * License: MIT
 * 
 * Description:
 *   Demo 01-2d-rotating-points – demonstrates 2D rotation and scaling using a set of four points.
 *   The points form a square around the origin in local space.
 *   Each frame, the points are:
 *     - Scaled using a time-based sine wave
 *     - Rotated around the origin using elapsed time
 *     - Translated to the centre of the screen
 * 
 *   The result is an orbiting, pulsating square – a foundational concept in 2D (and later 3D) transformations.
 * 
 *   All demos follow this interface:
 *     - initialize(blitter): called once after canvas is created
 *     - render(blitter, elapsedTime, deltaTime): called every frame
 */

import { Blitter } from "../../engine/blitter.js";
import { Color4 } from "../../engine/color/color4.js";
import { Point2D } from "../../engine/geometry/point2d.js";

let centerX!: number;
let centerY!: number;

let points: Point2D[] = [];

const size: number = 50;

/**
 * Initializes the demo state.
 * Defines four points that form a square around the origin (0, 0).
 * Also calculates the screen centre for later translation.
 *
 * @param blitter - Handles canvas access, screen dimensions, and pixel operations
 */
export function initialize(blitter: Blitter): void {
    points = [
        new Point2D(-size, -size),
        new Point2D(size, -size),
        new Point2D(size, size),
        new Point2D(-size, size)
    ];

    centerX = blitter.width / 2;
    centerY = blitter.height / 2;
}

/**
 * Called once per frame by the engine.
 * Clears the screen, transforms each point (scale, rotate, translate),
 * and plots a pixel at the resulting screen coordinates.
 *
 * @param blitter - Rendering abstraction for plotting pixels
 * @param elapsedTime - Total time in seconds since the demo started
 * @param deltaTime - Time in seconds since the last frame
 */
export function render(blitter: Blitter, elapsedTime: number, deltaTime: number): void {
    // Clear canvas to white each frame
    blitter.clear(Color4.white);

    // Rotation angle in radians
    const angle: number = elapsedTime;

    // Oscillating scale factor between 0.5 and 1.5
    const scale: number = 1 + Math.sin(elapsedTime * 2) * 0.5;

    // Transform and plot each point
    for (let i: number = 0; i < points.length; i++) {
        const transformed: Point2D = points[i]
            .scale(scale)
            .rotate(angle)
            .translate(centerX, centerY);

        blitter.setPixel(transformed.x, transformed.y, Color4.black);
    }
}