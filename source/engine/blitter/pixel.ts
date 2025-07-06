/**
 * Project: html5-typescript-3d-software-engine
 * File: pixel.ts
 * Author: Patrik Sporre
 * License: MIT
 * 
 * Description:
 *   Provides low-level pixel manipulation functions for direct access to the backbuffer.
 *   These are utility methods used by the Blitter class to read and write pixels efficiently.
 * 
 *   Coordinates are validated against the clipping region if clip is set to true.
 *   Colors are written and read using packed 32-bit AABBGGRR format for performance.
 */
import { Blitter } from "../blitter.js";
import { Color4 } from "../color/color4.js";

/**
 * Writes a pixel at (x, y) to the given backbuffer using a 32-bit packed color.
 * 
 * @param blitter - The active Blitter instance (used for width and clipping)
 * @param x - X coordinate of the pixel
 * @param y - Y coordinate of the pixel
 * @param color - The color to write (converted to AABBGGRR format)
 * @param clip - Whether to apply clipping (default: false)
 * @param backbuffer - The 32-bit backbuffer to write to
 */
export function setPixel(blitter: Blitter, x: number, y: number, color: Color4, clip: boolean, backbuffer: Uint32Array): void {
    if (clip) {
        if (
            x < blitter.clipping.minX || x >= blitter.clipping.maxX ||
            y < blitter.clipping.minY || y >= blitter.clipping.maxY) {
            return;
        }
    }

    backbuffer[y * blitter.width + x] = color.toAABBGGRR();
}

/**
 * Reads the color of the pixel at (x, y) from the given backbuffer.
 * 
 * @param blitter - The active Blitter instance (used for width and clipping)
 * @param x - X coordinate of the pixel
 * @param y - Y coordinate of the pixel
 * @param clip - Whether to apply clipping (default: false)
 * @param backbuffer - The 32-bit backbuffer to read from
 * @returns Color4 representing the pixel's color, or null if clipped
 */
export function getPixel(blitter: Blitter, x: number, y: number, clip: boolean, backbuffer: Uint32Array): Color4 | null {
    if (clip) {
        if (
            x < blitter.clipping.minX || x >= blitter.clipping.maxX ||
            y < blitter.clipping.minY || y >= blitter.clipping.maxY) {
            return null;
        }
    }

    return new Color4().fromAABBGGRR(backbuffer[y * blitter.width + x]);
}