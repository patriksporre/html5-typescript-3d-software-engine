/**
 * Project: html5-typescript-3d-software-engine
 * File: helper.ts
 * Author: Patrik Sporre
 * License: MIT
 * 
 * Description:
 *   Provides low-level math utility functions for use across the engine.
 *   Includes clamping, interpolation, and random range generation.
 *   These functions are designed to be fast and general-purpose.
 */

/**
 * Clamps a number to a specified range [min, max].
 *
 * @param value - The number to clamp
 * @param min - Minimum allowed value (inclusive)
 * @param max - Maximum allowed value (inclusive)
 * @returns The clamped value
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

/**
 * Performs linear interpolation between two values.
 * Equivalent to: (1 - t) * start + t * end
 *
 * @param start - Start value
 * @param end - End value
 * @param t - Interpolation factor (typically in [0, 1])
 * @returns Interpolated value between start and end
 */
export function lerp(start: number, end: number, t: number): number {
    return start * (1 - t) + end * t;
}

/**
 * Generates a random float within the range [min, max).
 *
 * @param min - Lower bound (inclusive)
 * @param max - Upper bound (exclusive)
 * @returns Random number in the range
 */
export function randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}