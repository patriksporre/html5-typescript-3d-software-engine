/**
 * Project: html5-typescript-3d-software-engine
 * File: demo.ts
 * Author: Patrik Sporre
 * License: MIT
 * 
 * Description:
 *   Demo 02-2d-rotating-lines-dda – demonstrates 2D transformation using rotation, scaling, and translation.
 *   A square of four points is defined in local space around the origin (0, 0).
 *   Each frame:
 *     - The square is scaled using a time-based sine wave
 *     - Rotated using elapsed time (radians)
 *     - Translated to the screen centre
 *   The transformed points are then connected using lines (DDA) to create a rotating, pulsating wireframe square.
 */

import { Blitter } from "../../engine/blitter.js";
import { Color4 } from "../../engine/color/color4.js";
import { Point2D } from "../../engine/geometry/point2d.js";

let centerX!: number;
let centerY!: number;

let points: Point2D[] = [];

const size: number = 50;

/**
 * Initializes the square's local-space geometry and stores the canvas center.
 *
 * @param blitter - Rendering engine abstraction with canvas access
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
 * Called every frame. Applies transformations to the square's points and renders lines between them.
 *
 * @param blitter - Rendering engine abstraction for plotting
 * @param elapsedTime - Time in seconds since the start of the demo
 * @param deltaTime - Time in seconds since the previous frame
 */
export function render(blitter: Blitter, elapsedTime: number, deltaTime: number): void {
    // Clear the screen to white
    blitter.clear(Color4.white);

    // Angle in radians for continuous rotation
    const angle: number = elapsedTime;

    // Time-based scale factor oscillating between 0.5 and 1.5
    const scale: number = 1 + Math.sin(elapsedTime * 2) * 0.5;

    // Prepare transformed points
    const transformed: Point2D[] = [];

    for (let i: number = 0; i < points.length; i++) {
        transformed.push(
            points[i]
                .scale(scale)
                .rotate(angle)
                .translate(centerX, centerY)
        );
    }

    // Draw lines between the transformed points (loop around to close the square)
    for (let i: number = 0; i < transformed.length; i++) {
        const a: Point2D = transformed[i];
        const b: Point2D = transformed[(i + 1) % transformed.length];
        blitter.drawLineDDA(a, b, Color4.black);
    }
}