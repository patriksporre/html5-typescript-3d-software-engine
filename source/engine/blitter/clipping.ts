/**
 * Project: html5-typescript-3d-software-engine
 * File: clipping.ts
 * Author: Patrik Sporre
 * License: MIT
 * 
 * Description:
 *   Defines the Clipping class used to determine whether a given (x, y) coordinate
 *   lies inside or outside a defined rectangular region.
 * 
 *   The bounds are stored internally using a compact Int16Array for performance.
 *   Typically used during pixel plotting to prevent out-of-bounds writes.
 */
export class Clipping {
    private bounds: Int16Array;
  
    /**
     * Constructs a new clipping region.
     * 
     * @param minX - Minimum x-coordinate (inclusive)
     * @param minY - Minimum y-coordinate (inclusive)
     * @param maxX - Maximum x-coordinate (inclusive for inside, exclusive for outside)
     * @param maxY - Maximum y-coordinate (inclusive for inside, exclusive for outside)
     */
    constructor(minX: number, minY: number, maxX: number, maxY: number) {
      this.bounds = new Int16Array([minX, minY, maxX, maxY]);
    }
  
    // Minimum X boundary (inclusive)
    get minX(): number {
      return this.bounds[0];
    }
  
    // Minimum Y boundary (inclusive) 
    get minY(): number {
      return this.bounds[1];
    }
  
    // Maximum X boundary (inclusive for inside check)
    get maxX(): number {
      return this.bounds[2];
    }
  
    // Maximum Y boundary (inclusive for inside check)
    get maxY(): number {
      return this.bounds[3];
    }
  
    /**
     * Checks if the given point is inside the clipping rectangle.
     * 
     * @param x - X coordinate
     * @param y - Y coordinate
     * @returns true if the point is within or on the bounds
     */
    public inside(x: number, y: number): boolean {
      return (
        x >= this.bounds[0] &&
        x <= this.bounds[2] &&
        y >= this.bounds[1] &&
        y <= this.bounds[3]
      );
    }

    /**
     * Checks if the given point lies outside the clipping rectangle.
     * 
     * @param x - X coordinate
     * @param y - Y coordinate
     * @returns true if the point is outside the bounds
     */
    public outside(x: number, y: number): boolean {
        return (
          x < this.bounds[0] ||
          x >= this.bounds[2] ||
          y < this.bounds[1] ||
          y >= this.bounds[3]
        );
      }
  }