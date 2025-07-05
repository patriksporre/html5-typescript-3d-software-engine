/**
 * Project: html5-typescript-3d-software-engine
 * File: engine.ts
 * Author: Patrik Sporre
 * License: MIT
 * 
 * Description:
 *   This is the main engine entry point. It exposes a single async loader() function
 *   that sets up the canvas, loads a demo module, and starts the rendering loop.
 * 
 *   Responsibilities:
 *     - Create and configure the Blitter singleton (canvas, background, resolution)
 *     - Dynamically import the requested demo module
 *     - Call the demo's initialize() and render() functions
 *     - Handle timing (elapsed and delta time) per frame
 *     - Listen for keyboard input (spacebar toggles pause/resume)
 */
import { Blitter } from "./blitter.js";
import { Color4 } from "./color/color4.js";
import { Demo } from "./demo.interface.js";

// Singleton instance of the Blitter (handles canvas and pixel access)
const blitter: Blitter = Blitter.getInstance();

/**
 * Loads and runs a demo.
 * 
 * @param path - Path to the compiled JavaScript demo module
 * @param width - Canvas width in pixels (default = 640)
 * @param height - Canvas height in pixels (default = 480)
 */
export async function loader(path: string, width: number = 640, height: number = 480) {
    // Initialise the blitter and canvas
    blitter.create({width: width, height: height, background: Color4.red})
    
    // Add the canvas to the DOM
    blitter.present();

    // Dynamically load the demo module
    const demo: Demo = await import(path);

    // Run the demo one-time setup function
    demo.initialize(blitter);

    // Animation state
    let running: boolean = true;
    let elapsedTime: number = 0;
    let lastTimestamp: number = performance.now();

    // Kick off the animation loop
    requestAnimationFrame(main);

    /**
     * Main render loop.
     * Called via requestAnimationFrame. Computes timing and delegates to demo.
     */
    function main(timestamp: number) {
        if (!running) return;
        
        const deltaTime: number = (timestamp - lastTimestamp) / 1000;
        lastTimestamp = timestamp;

        elapsedTime += deltaTime;

        // Run the demo rendering function
        demo.render(blitter, elapsedTime, deltaTime);

        // Draw the backbuffer to canvas
        blitter.blit();

        requestAnimationFrame(main);
    }

    /**
     * Key event listener.
     */
    document.addEventListener("keydown", function (event: KeyboardEvent) {
        // Press [Space] to toggle pause/resume
        if (event.code === "Space") {
            running = !running;
            if (running) requestAnimationFrame(main);
        }
    });
}