/**
 * Project: html5-typescript-3d-software-engine
 * File: color4.ts
 * Author: Patrik Sporre
 * License: MIT
 * 
 * Description:
 *   Represents a 32-bit colour with alpha, red, green, and blue components.
 *   Provides conversion between numeric formats (AABBGGRR and AARRGGBB),
 *   optional internal caching for performance, and clamping for safety.
 * 
 *   This class is used throughout the engine for pixel plotting, fill operations,
 *   and colour management. Colours are stored as 8-bit per channel integers (0–255).
 */

import { clamp } from "../utils/helper.js";

interface Color4Parameters {
    alpha?: number;      // Alpha component (0–255)
    red?: number;        // Red component (0–255)
    green?: number;      // Green component (0–255)
    blue?: number;       // Blue component (0–255)
    caching?: boolean;   // Whether to cache the 32-bit colour value
}

export class Color4 {
    public alpha: number;
    public red: number;
    public green: number;
    public blue: number;

    private cache: number | null = null;
    private caching: boolean;

    /**
     * Creates a new Color4 instance with optional channel values.
     * All values are clamped between 0 and 255.
     * 
     * @param params - Optional colour components and caching flag
     */
    public constructor({ alpha = 255, red = 0, green = 0, blue = 0, caching = true }: Color4Parameters = {}) {
        this.alpha = clamp(alpha, 0, 255);
        this.red = clamp(red, 0, 255);
        this.green = clamp(green, 0, 255);
        this.blue = clamp(blue, 0, 255);
        this.caching = caching;
    }

    /**
     * Sets the channel values from a 32-bit AABBGGRR integer.
     * 
     * @param color - Colour in AABBGGRR format
     * @returns The updated Color4 instance
     */
    public fromAABBGGRR(color: number): Color4 {
        this.alpha = (color >> 24) & 0xff;
        this.red   = (color >> 0)  & 0xff;
        this.green = (color >> 8)  & 0xff;
        this.blue  = (color >> 16) & 0xff;
        this.cache = color;
        return this;
    }

    /**
     * Sets the channel values from a 32-bit AARRGGBB integer.
     * 
     * @param color - Colour in AARRGGBB format
     * @returns The updated Color4 instance
     */
    public fromARRGGBB(color: number): Color4 {
        this.alpha = (color >> 24) & 0xff;
        this.red   = (color >> 16) & 0xff;
        this.green = (color >> 8)  & 0xff;
        this.blue  = (color >> 0)  & 0xff;
        this.cache = color;
        return this;
    }

    /**
     * Returns the 32-bit AABBGGRR representation of this colour.
     * Uses caching if enabled.
     */
    public toAABBGGRR(): number {
        if (this.caching && this.cache === null) {
            this.cache = this.getAABBGGRR();
        }
        return this.cache ?? this.getAABBGGRR();
    }

    /**
     * Returns the 32-bit AARRGGBB representation of this colour.
     * Uses caching if enabled.
     */
    public toAARRGGBB(): number {
        if (this.caching && this.cache === null) {
            this.cache = this.getAARRGGBB();
        }
        return this.cache ?? this.getAARRGGBB();
    }

    /**
     * Computes the AABBGGRR integer from the channel values.
     */
    private getAABBGGRR(): number {
        return (this.alpha << 24) | (this.red << 0) | (this.green << 8) | (this.blue << 16);
    }

    /**
     * Computes the AARRGGBB integer from the channel values.
     */
    private getAARRGGBB(): number {
        return (this.alpha << 24) | (this.red << 16) | (this.green << 8) | (this.blue << 0);
    }

    /**
     * Returns a human-readable string representation of the colour.
     */
    public toString(): string {
        return `argb(${this.alpha}, ${this.red}, ${this.green}, ${this.blue})`;
    }

    // Predefined colours
    static black  = new Color4({ alpha: 255, red: 0,   green: 0,   blue: 0   });
    static white  = new Color4({ alpha: 255, red: 255, green: 255, blue: 255 });
    static red    = new Color4({ alpha: 255, red: 255, green: 0,   blue: 0   });
    static green  = new Color4({ alpha: 255, red: 0,   green: 255, blue: 0   });
    static blue   = new Color4({ alpha: 255, red: 0,   green: 0,   blue: 255 });
    static purple = new Color4({ alpha: 255, red: 255, green: 0,   blue: 255 });
}