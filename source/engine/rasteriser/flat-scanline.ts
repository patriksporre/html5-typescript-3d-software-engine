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
 *     - Sorts triangle vertices using rasterOrder()
 *     - Identifies flat-top, flat-bottom, or general triangle
 *     - General triangles are split at the middle Y into two sub-triangles
 *     - Each triangle is filled using horizontal scanlines between interpolated left/right edges
 * 
 *   Optimisations:
 *     - Writes directly to backbuffer with one multiplication per scanline
 *     - Uses top-left fill convention (via Math.ceil) for raster consistency
 *     - Slopes are computed once, only additions used per scanline
 */
import { Blitter } from "../blitter.js";
import { Color4 } from "../color/color4.js";
import { Point2D } from "../geometry/point2d.js";
import { Triangle2D } from "../geometry/triangle2d.js";

/**
 * Rasterises a filled triangle using horizontal scanlines and a flat colour.
 * Handles flat-top, flat-bottom, or splits a general triangle into both.
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
    const height: number = blitter.height;

    const colorUnpacked: number = color.toAABBGGRR();

    if (v1.y === v2.y) {
        // Case 1: Flat-bottom triangle (v1 and v2 share the same Y)
        fillFlatBottom(width, height, v0, v1, v2, colorUnpacked, backbuffer);
    } else if (v0.y === v1.y) {
        // Case 2: Flat-top triangle (v0 and v1 share the same Y)
        fillFlatTop(width, height, v0, v1, v2, colorUnpacked, backbuffer);
    } else {
        // Case 3: General triangle – split into one flat-bottom and one flat-top
        const t: number = (v1.y - v0.y) / (v2.y - v0.y);

        const v3: Point2D = new Point2D(
            v0.x + t * (v2.x - v0.x),   // linear interpolation of X
            v1.y                        // shared Y with the middle vertex
        );

        // Determine left and right at the split
        const [left, right] = v1.x < v3.x ? [v1, v3] : [v3, v1];

        fillFlatBottom(width, height, v0, left, right, colorUnpacked, backbuffer);
        fillFlatTop(width, height, left, right, v2, colorUnpacked, backbuffer);
    }
}

/**
 * Fills a flat-top triangle (two top vertices share Y, one bottom vertex).
 * 
 * @param width - Canvas width
 * @param height - Canvas height
 * @param v0 - Left-top vertex
 * @param v1 - Right-top vertex
 * @param v2 - Bottom vertex
 * @param color - AABBGGRR
 * @param backbuffer - Backbuffer to write pixels into
 */
function fillFlatTop(width: number, height: number, v0: Point2D, v1: Point2D, v2: Point2D, color: number, backbuffer: Uint32Array): void {
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

    rasterScanlines(width, height, yStart, yEnd, v0.x, v1.x, slopeLeft, slopeRight, color, backbuffer); 
}

/**
 * Fills a flat-bottom triangle (one top vertex, two bottom vertices share Y).
 * 
 * @param width - Canvas width
 * @param height - Canvas height
 * @param v0 - Top vertex
 * @param v1 - Left-bottom vertex
 * @param v2 - Right-bottom vertex
 * @param color - AABBGGRR
 * @param backbuffer - Backbuffer to write pixels into
 */
function fillFlatBottom(width: number, height: number, v0: Point2D, v1: Point2D, v2: Point2D, color: number, backbuffer: Uint32Array): void {
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

    rasterScanlines(width, height, yStart, yEnd, v0.x, v0.x, slopeLeft, slopeRight, color, backbuffer); 
}

/**
 * Writes horizontal spans between xLeft and xRight for each scanline.
 * 
 * @param width - Width of the screen / canvas
 * @param yStart - Starting Y coordinate (inclusive)
 * @param yEnd - Ending Y coordinate (exclusive)
 * @param xLeft - Initial X on the left edge
 * @param xRight - Initial X on the right edge
 * @param slopeLeft - Increment per Y step on the left edge
 * @param slopeRight - Increment per Y step on the right edge
 * @param color - AABBGGRR
 * @param backbuffer - The 32-bit linear pixel buffer
 */
function rasterScanlines(width: number, height: number, yStart: number, yEnd: number, xLeft: number, xRight: number, slopeLeft: number, slopeRight: number, color: number, backbuffer: Uint32Array): void {
    const clampedYStart: number = Math.max(0, yStart);
    const clampedYEnd: number = Math.min(height, yEnd);
    
    let position: number = clampedYStart * width;

    for (let y: number = clampedYStart; y < clampedYEnd; y++) {
        const xStart: number = Math.max(0, Math.ceil(xLeft));
        const xEnd: number = Math.min(width, Math.ceil(xRight));

        for (let x: number = xStart; x < xEnd; x++) {
            backbuffer[position + x] = color;
        }

        position += width;
        xLeft += slopeLeft;
        xRight += slopeRight;
    }
 }