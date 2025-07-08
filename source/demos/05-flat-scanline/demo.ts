/**
 * Project: html5-typescript-3d-software-engine
 * File: demo.ts
 * Author: Patrik Sporre
 * License: MIT
 *
 * Description:
 *   Demo 05-flat-scanline – demonstrates the flat-fill triangle rasteriser in action.
 *   Four triangles are placed in a 2×2 grid, each filled with a solid colour using
 *   horizontal scanline rendering. Outlines are drawn to verify edge alignment.
 *
 *   Features:
 *     - Scanline-based triangle filling using flat colour (fillFlatScanline)
 *     - DDA-based line drawing for triangle outlines
 *     - Real-time rotation of each triangle around its own centroid
 *
 *   Notes:
 *     - The demo verifies scanline correctness, fill coverage, and rotation robustness
 *     - Visual artefacts (e.g. gaps between fill and outline) may occur due to rasterisation edge rounding
 *     - These gaps are a known challenge in software rendering and will be handled later with shared interpolation logic
 */
import { Blitter } from "../../engine/blitter.js";
import { Color4 } from "../../engine/color/color4.js";
import { Point2D } from "../../engine/geometry/point2d.js";
import { Triangle2D } from "../../engine/geometry/triangle2d.js";

let triangles: { 
    triangle: Triangle2D,
    fill: Color4,
    line: Color4
} [] = [];

/**
 * Initializes four triangles arranged in a 2×2 grid around the canvas center.
 * Each triangle is defined in local space and stored with fill and line colour.
 *
 * @param blitter - Provides canvas dimensions for centering the grid
 */
export function initialize(blitter: Blitter) {
    const centerX: number = blitter.width / 2;
    const centerY: number = blitter.height / 2;
    const spacing: number = 170;

    triangles = [
        {
            triangle: new Triangle2D(
                new Point2D(centerX - spacing, centerY - spacing),
                new Point2D(centerX, centerY - spacing),
                new Point2D(centerX - spacing / 2, centerY - spacing / 2)
            ),
            fill: Color4.green,
            line: Color4.black
        },
        {
            triangle: new Triangle2D(
                new Point2D(centerX + spacing, centerY - spacing),
                new Point2D(centerX + spacing / 2, centerY - spacing / 2),
                new Point2D(centerX + spacing * 1.5, centerY - spacing / 2)
            ),
            fill: Color4.red,
            line: Color4.black
        },
        {
            triangle: new Triangle2D(
                new Point2D(centerX - spacing, centerY + spacing),
                new Point2D(centerX - spacing / 2, centerY + spacing / 2),
                new Point2D(centerX - spacing * 1.5, centerY + spacing / 2)
            ),
            fill: Color4.blue,
            line: Color4.black
        },
        {
            triangle: new Triangle2D(
                new Point2D(centerX + spacing, centerY + spacing),
                new Point2D(centerX + spacing * 1.5, centerY + spacing / 2),
                new Point2D(centerX + spacing / 2, centerY + spacing / 2)
            ),
            fill: Color4.black,
            line: Color4.red
        }
    ];
}

/**
 * Called once per frame to render the scene.
 * Each triangle is rotated around its centroid, filled with colour,
 * and outlined using DDA line drawing.
 *
 * @param blitter - Engine abstraction for pixel drawing
 * @param elapsedTime - Total time since demo started (in seconds)
 * @param deltaTime - Time since last frame (in seconds)
 */
export function render(blitter: Blitter, elapsedTime: number, deltaTime: number) {
    blitter.clear(Color4.white);

    const angle: number = elapsedTime; // radians

    for (let i: number = 0; i < triangles.length; i++) {
        const center: Point2D = triangles[i].triangle.centroid();

        const triangle: Triangle2D = triangles[i].triangle.rotate(angle, center);
        const fill: Color4 = triangles[i].fill;
        const line: Color4 = triangles[i].line;

        blitter.fillFlatScanline(triangle, fill);

        blitter.drawLineDDA(triangle.a, triangle.b, line, true);
        blitter.drawLineDDA(triangle.b, triangle.c, line, true);
        blitter.drawLineDDA(triangle.c, triangle.a, line, true);
    }
}