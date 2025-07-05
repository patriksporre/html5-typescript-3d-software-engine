/**
 * Project: html5-typescript-3d-software-engine
 * File: demo.ts
 * Author: Patrik Sporre
 * License: MIT
 * 
 * Description:
 *   Defines the Demo interface that all demos must implement.
 *   Each demo must export two lifecycle functions:
 *     - initialize(): called once after canvas setup
 *     - render(): called once per frame with timing information
 * 
 *   The engine calls these methods automatically from engine.ts.
 *   The Blitter instance provides access to the canvas, dimensions,
 *   and pixel-level rendering methods.
 */
import { Blitter } from "./blitter.js";

/**
 * Interface for all demo modules.
 * Ensures that the engine can call standardized lifecycle hooks.
 */
export interface Demo {
    /**
     * Called once after the canvas and context are initialized.
     * Use this to set background colour, load assets, or reset state.
     * 
     * @param blitter - Optional Blitter instance for low-level canvas access
     */
    initialize(blitter?: Blitter): void;

    /**
     * Called every frame by the engine's render loop.
     * 
     * @param blitter - Blitter instance used for pixel plotting
     * @param elapsedTime - Time in seconds since the demo started
     * @param deltaTime - Time in seconds since the previous frame
     */
    render(blitter: Blitter, elapsedTime:number, deltaTime: number): void;
}