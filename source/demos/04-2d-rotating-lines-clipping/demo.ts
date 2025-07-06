/**
 * Project: html5-typescript-3d-software-engine
 * File: demo.ts
 * Author: Patrik Sporre
 * License: MIT
 *
 * Description:
 *   Demo 04-2d-rotating-lines-clipping – compares line rasterisation techniques
 *   and demonstrates geometric line clipping using the Liang–Barsky algorithm.
 *
 *   Four points define a square in local space. Each frame:
 *     - The square is scaled and rotated around the origin
 *     - Transformed points are translated to screen center
 *     - Lines are drawn between consecutive points
 *
 *   Keyboard controls:
 *     D → Use DDA line drawing algorithm
 *     B → Use Bresenham line drawing algorithm
 *     C → Toggle clipping on/off
 *
 *   Demonstrates:
 *     - 2D transformations (scale, rotate, translate)
 *     - Line rasterisation algorithms (DDA vs Bresenham)
 *     - Clipping of line segments using Liang–Barsky
 */
import { Blitter } from "../../engine/blitter.js";
import { Color4 } from "../../engine/color/color4.js";
import { Point2D } from "../../engine/geometry/point2d.js";

let centerX!: number;
let centerY!: number;

let points: Point2D[] = [];

const size: number = 50;

let useClipping: boolean = false;
let useDDA: boolean = true;

/**
 * Initializes the square geometry and screen center, and registers key bindings.
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

    document.addEventListener("keydown", function (event: KeyboardEvent) {
        if (event.code === "KeyB") {
            useDDA = false;
            console.log("Rasteriser: Bresenham");
        }
        if (event.code === "KeyD") {
            useDDA = true;
            console.log("Rasteriser: DDA");
        }
        if (event.code === "KeyC") {
            useClipping = !useClipping;
            console.log("Clipping: " + (useClipping ? "On" : "Off"));
        }
    });
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

    // Oscillating scale factor to push lines offscreen (demonstrates clipping)
    const scale: number = 4 + Math.sin(elapsedTime * 2) * 2;

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

        if (useDDA) {
            blitter.drawLineDDA(a, b, Color4.black, useClipping);
        } else {
            blitter.drawLineBresenham(a, b, Color4.black, useClipping);
        }
    }
}