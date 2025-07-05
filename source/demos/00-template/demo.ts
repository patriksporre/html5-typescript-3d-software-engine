/**
 * Project: html5-typescript-3d-software-engine
 * File: demo.ts
 * Author: Patrik Sporre
 * License: MIT
 * 
 * Description:
 *   Demo 00-template – verifies that the engine and rendering loop are correctly set up.
 *   Clears the screen to red in the initialize() step and renders a white pixel
 *   at the centre of the canvas on each animation frame.
 * 
 *   All demos follow this interface:
 *     - initialize(blitter): called once after canvas is created
 *     - render(blitter, elapsedTime, deltaTime): called every frame
 */
import { Blitter } from "../../engine/blitter.js";
import { Color4 } from "../../engine/color/color4.js";

/**
 * Initializes the demo state.
 * Called once after the canvas has been created and the rendering context is ready.
 *
 * @param blitter - Handles canvas access, screen dimensions, and pixel operations
 */
export function initialize(blitter: Blitter) {
    // Fill the screen with a solid red color
    blitter.clear(Color4.red);
}

/**
 * Called every animation frame to update the canvas.
 * In this minimal example, it simply plots a single white pixel in the centre.
 *
 * @param blitter - Rendering abstraction for plotting pixels
 * @param elapsedTime - Total time (in ms) since the engine started
 * @param deltaTime - Time (in ms) since the last frame
 */
export function render(blitter: Blitter, elapsedTime: number, deltaTime: number) {
    // Plot a white pixel in the middle of the canvas
    blitter.setPixel(blitter.width / 2, blitter.height / 2, Color4.white);
}