/**
 * Represents a point in a two-dimensional space.
 */
class Point2D {
    /**
     * Creates a new `Point2D` object with the given `x` and `y` coordinates.
     * @param {number} x - The x coordinate of the point.
     * @param {number} y - The y coordinate of the point.
     */
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  
    /**
     * Calculates the Manhattan distance between the current point and a `target_point` that is passed as an argument.
     * @param {Point2D} target_point - The point to which the Manhattan distance is calculated.
     * @returns {number} The Manhattan distance between the current point and the `target_point`.
     */
    get_manhattan_distance(target_point) {
      return Math.abs(this.x - target_point.x) + Math.abs(this.y - target_point.y);
    }
}

// export default Point2D;

