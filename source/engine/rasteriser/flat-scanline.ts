/**
 * Project: html5-typescript-3d-software-engine
 * File: flat-scanline.ts
 * Author: Patrik Sporre
 * License: MIT
 * 
 * Description:
 *   Provides a flat-fill triangle rasteriser using scanline rendering.
 *   This is the most basic triangle filling algorithm used in software rendering,
 *   forming the foundation for more advanced techniques (e.g. Gouraud, Phong, textured shading).
 * 
 *   The approach:
 *     - Sorts triangle vertices by Y to identify flat-top, flat-bottom, or general triangles
 *     - General triangles are split into two: one flat-top and one flat-bottom
 *     - Each triangle is filled horizontally (scanline by scanline) between interpolated left/right edges
 * 
 *   Notes:
 *     - Coordinates are snapped to integer pixels using Math.ceil for top-left fill convention
 */
import { Blitter } from "../blitter.js";
import { Color4 } from "../color/color4.js";
import { Point2D } from "../geometry/point2d.js";
import { Triangle2D } from "../geometry/triangle2d.js";

/**
 * Rasterises a filled triangle using horizontal scanlines and a flat colour.
 * Dispatches to either flat-top, flat-bottom, or both if needed.
 * 
 * @param blitter - The active Blitter instance 
 * @param triangle - Triangle to rasterise
 * @param color - Fill colour
 * @param backbuffer - The 32-bit backbuffer to write to
 */
export function fillFlatScanline(blitter: Blitter, triangle: Triangle2D, color: Color4, backbuffer: Uint32Array): void {
    // Sort the vertices for scanline rasterisation
    const [v0, v1, v2] = triangle.rasterOrder();

    const width: number = blitter.width;

    if (v1.y === v2.y) {
        // Case 1: Flat-bottom triangle (v1 and v2 share the same Y)
        fillFlatBottom(width, v0, v1, v2, color, backbuffer);
    } else if (v0.y === v1.y) {
        // Case 2: Flat-top triangle (v0 and v1 share the same Y)
        filLFlatTop(width, v0, v1, v2, color, backbuffer);
    } else {
        // Case 3: General triangle – split into one flat-bottom and one flat-top
        const t: number = (v1.y - v0.y) / (v2.y - v0.y);

        const v3: Point2D = new Point2D(
            v0.x + t * (v2.x - v0.x),   // linear interpolation of X
            v1.y                        // shared Y with the middle vertex
        );

        // Sort v1 and v3 left-to-right
        const [left, right] = v1.x < v3.x ? [v1, v3] : [v3, v1];

        fillFlatBottom(width, v0, left, right, color, backbuffer);
        filLFlatTop(width, left, right, v2, color, backbuffer);
    }
}

/**
 * Fills a flat-top triangle.
 * Assumes v0 and v1 are top vertices with equal y-coordinates, and v2 is the bottom vertex.
 */
function filLFlatTop(width: number, v0: Point2D, v1: Point2D, v2: Point2D, color: Color4, backbuffer: Uint32Array): void {
    // Vertical span of each edge (for slope calculation)
    const dyLeft: number = v2.y - v0.y;
    const dyRight: number = v2.y - v1.y;

    // Avoid divide-by-zero
    if (dyLeft === 0 || dyRight === 0) return;

    // Compute slope of each edge (dx / dy)
    let slopeLeft: number = (v2.x - v0.x) / dyLeft;
    let slopeRight: number = (v2.x - v1.x) / dyRight;

    let xLeft: number = v0.x;
    let xRight: number = v1.x;

    const yStart = Math.ceil(v0.y);
    const yEnd = Math.ceil(v2.y);

    let position: number = yStart * width;
    let c: number = color.toAABBGGRR();

    for (let y: number = yStart; y < yEnd; y++) {
        const xStart: number = Math.max(0, Math.ceil(xLeft));
        const xEnd: number = Math.min(width, Math.ceil(xRight));

        for (let x: number = xStart; x < xEnd; x++) {
            backbuffer[position + x] = c;
        }
        position += width;

        xLeft += slopeLeft;
        xRight += slopeRight;
    }
}

/**
 * Fills a flat-bottom triangle.
 * Assumes v0 is the top vertex, and v1 and v2 are bottom vertices with equal y-coordinates.
 */
function fillFlatBottom(width: number, v0: Point2D, v1: Point2D, v2: Point2D, color: Color4, backbuffer: Uint32Array): void {
    // Vertical span of each edge (for slope calculation)
    const dyLeft: number = v1.y - v0.y;
    const dyRight: number = v2.y - v0.y;

    // Avoid divide-by-zero
    if (dyLeft === 0 || dyRight === 0) return;

    // Compute slope of each edge (dx / dy)
    let slopeLeft: number = (v1.x - v0.x) / dyLeft;
    let slopeRight: number = (v2.x - v0.x) / dyRight;

    let xLeft: number = v0.x;
    let xRight: number = v0.x;

    const yStart: number = Math.ceil(v0.y);
    const yEnd: number = Math.ceil(v1.y);

    let position: number = yStart * width;
    let c: number = color.toAABBGGRR();

    for (let y: number = yStart; y < yEnd; y++) {
        const xStart: number = Math.max(0, Math.ceil(xLeft));
        const xEnd: number = Math.min(width, Math.ceil(xRight));

        for (let x: number = xStart; x < xEnd; x++) {
            backbuffer[position + x] = c;
        }
        position += width;

        xLeft += slopeLeft;
        xRight += slopeRight;
    }
}