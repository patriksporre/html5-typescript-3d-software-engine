/**
 * Project: html5-typescript-3d-software-engine
 * File: blitter.ts
 * Author: Patrik Sporre
 * License: MIT
 * 
 * Description:
 *   The Blitter singleton class manages all low-level rendering operations.
 *   It abstracts canvas creation, manages backbuffers, handles clipping,
 *   and provides pixel-level read/write operations via helper functions.
 * 
 *   Responsibilities:
 *     - Creating and configuring the HTML5 canvas
 *     - Setting up ImageData-based backbuffers for fast pixel access
 *     - Providing a clear interface for drawing pixels and clearing the screen
 *     - Supporting optional clipping, background color, and singleton access
 * 
 *   Uses two buffers:
 *     - backbuffer8: ImageData for browser rendering
 *     - backbuffer32: Uint32Array for fast 32-bit ARGB color writes
 */

import { Clipping } from "./blitter/clipping.js";
import { Color4 } from "./color/color4.js";

import { getPixel, setPixel } from './blitter/pixel.js';
import { drawLineDDA } from "./blitter/line.js";
import { Point2D } from "./geometry/point2d.js";

interface CanvasParameters {
    width: number,
    height: number,
    background?: Color4
}

export class Blitter {
    private static instance: Blitter;

    public width: number = 0;
    public height: number = 0;
    public background!: Color4;

    public clipping!: Clipping;

    private canvas!: HTMLCanvasElement;
    private context!: CanvasRenderingContext2D;

    private backbuffer8!: ImageData;
    private backbuffer32!: Uint32Array;

    // Use Blitter.getInstance() to access the singleton
    private constructor() {}

    /**
     * Returns the global Blitter instance.
     * Enforces singleton pattern.
     */
    public static getInstance(): Blitter {
        if (!Blitter.instance) {
            Blitter.instance = new Blitter();
        }

        return Blitter.instance;
    }

    /**
     * Initializes the canvas, backbuffer, and clipping region.
     * Called once during setup.
     *
     * @param width - Canvas width in pixels
     * @param height - Canvas height in pixels
     * @param background - Optional background color (default: white)
     */
    public create({width, height, background = Color4.white}: CanvasParameters): void {
        this.width = Math.floor(width);
        this.height = Math.floor(height);
        this.background = background;

        // Initialize the clipping region to match the canvas dimensions
        this.clipping = new Clipping(0, 0, this.width, this.height);

        // Create and configure the canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Retrieve the 2D rendering context
        this.context = this.canvas.getContext('2d')!;

        // Initialize the backbuffer for rendering
        this.backbuffer8 = this.context.getImageData(0, 0, this.width, this.height);
        this.backbuffer32 = new Uint32Array(this.backbuffer8.data.buffer);
    }

    /**
     * Appends the canvas element to the DOM.
     * Typically called once during setup.
     */
    public present(): void {
        document.body.appendChild(this.canvas);
    }

    /**
     * Copies the contents of the backbuffer to the visible canvas.
     * Called once per frame.
     */
    public blit(): void {
        this.context.putImageData(this.backbuffer8, 0, 0);
    }
    
    /**
     * Clears the screen using a specified or default background color.
     *
     * @param color - Optional color to clear with (defaults to this.background)
     */
    public clear(color: Color4 = this.background): void {
        this.fill(color.toAABBGGRR());
    }

    /**
     * Fills the entire backbuffer with a 32-bit color value.
     *
     * @param color - Color in AABBGGRR format (fast write)
     * @param backbuffer - Optional override for custom buffer
     */
    public fill(color: number, backbuffer: Uint32Array = this.backbuffer32): void {
        backbuffer.fill(color);
    }

    /**
     * Returns the current 32-bit backbuffer.
     */
    public get backbuffer(): Uint32Array {
        return this.backbuffer32;
    }

    /**
     * Sets a pixel at (x, y) to the specified color.
     *
     * @param x - X coordinate
     * @param y - Y coordinate
     * @param color - Pixel color
     * @param clip - Whether to apply clipping
     * @param backbuffer - Optional buffer override
     */
    public setPixel(x: number, y: number, color: Color4, clip: boolean = false, backbuffer: Uint32Array = this.backbuffer32): void {
        setPixel(this, Math.floor(x), Math.floor(y), color, clip, backbuffer);
    }

    /**
     * Gets the color of the pixel at (x, y), or null if clipped.
     *
     * @param x - X coordinate
     * @param y - Y coordinate
     * @param clip - Whether to apply clipping
     * @param backbuffer - Optional buffer override
     * @returns Color4 or null
     */
    public getPixel(x: number, y: number, clip: boolean = false, backbuffer: Uint32Array = this.backbuffer32): Color4 | null {
        return getPixel(this, Math.floor(x), Math.floor(y), clip, backbuffer);
    }

    /**
     * Draws a line between two points using the DDA (Digital Differential Analyzer) algorithm.
     * 
     * This method wraps the global drawLineDDA() function and passes the current Blitter instance.
     * It supports optional clipping and backbuffer override, defaulting to the Blitter's internal backbuffer.
     * 
     * @param a - Start point (Point2D)
     * @param b - End point (Point2D)
     * @param color - Line colour (defaults to Color4.black)
     * @param clip - Whether to apply clipping using this Blitter's clip region (default: false)
     * @param backbuffer - Optional target buffer (default: this.backbuffer32)
     */
    public drawLineDDA(a: Point2D, b: Point2D, color: Color4, clip: boolean = false, backbuffer: Uint32Array = this.backbuffer32) : void {
        return drawLineDDA(this, a, b, color, clip, backbuffer);
    }
}