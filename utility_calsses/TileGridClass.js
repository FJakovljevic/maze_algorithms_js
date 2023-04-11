// import { Tile, TileTypeEnumeration, WallTile } from "./TileClass"
// import int_division from "./UtilityFunctions"

/**
 * class TileGrid
 * - describing TileGrid
 */
class TileGrid {
    /**
     * Class TileGrid constructor
     * @param {CanvasRenderingContext2D} ctx - the canvas context to draw the grid
     * @param {number} width - the width of the grid in pixels
     * @param {number} height - the height of the grid in pixels
     * @param {number} tile_size - the size of each tile in pixels
     */
    constructor(ctx, width, height, tile_size) {
        this.canvas_context = ctx;
        this.px_width = width;
        this.px_height = height;
        this.tile_size = tile_size;
        this.move = {
            top: -0x10000,
            right: 0x00001,
            bot: 0x10000,
            left: -0x00001
        };
        this.generate_grid();
    }

    /**
     * Generates an empty grid of WallTile objects
     */
    generate_grid() {
        console.log('Creating empty grid');
        this.tile_grid = new Map();
        this.num_x_tiles = Math.floor(this.px_width / this.tile_size);
        this.num_y_tiles = Math.floor(this.px_height / this.tile_size);

        for (let x = 0; x < this.num_x_tiles; x++) {
            for (let y = 0; y < this.num_y_tiles; y++) {
                const tile = new WallTile(x, y, this.tile_size);
                this.tile_grid.set(this._hash_tile(x, y), tile);
            }
        }
        console.log('Empty grid created');
    }

    /**
     * Generates a 32-bit hash for a tile using its x and y coordinates.
     * @param {number} x - The x coordinate of the tile.
     * @param {number} y - The y coordinate of the tile.
     * @returns {number} A 32-bit number representing the tile hash.
     */
    _hash_tile(x, y) {
        return x | (y<<16);
    }

    /**
     * Returns a list of unique IDs for all the tiles in the grid.
     * @returns {Array} A list of tile IDs.
     */
    get_all_tiles() {
        return [...this.tile_grid.keys()]
    }

    /**
     * Returns the Tile object with the specified ID.
     * @param {number} tile_id - The unique ID of the tile being retrieved.
     * @returns {Tile} The tile object.
     */
    get_tile(tile_id) {
        return this.tile_grid.get(tile_id)
    }

    /**
     * Returns the starting tile of the grid.
     * @returns {Tile} The start tile object.
     */
    get_start_tile() {
        return this.tile_grid.entries().next().value
    }

    /**
     * Switches the type of a tile in the grid.
     * @param {number} tile_id - The ID of the tile to switch.
     * @param {TileTypeEnumeration} new_type - The new type to switch the tile to.
     * @returns {Tile} - The updated tile object.
     */
    switch_tile_type(tile_id, new_type) {
        const new_tile = TileTypeEnumeration.switch_tile_type_factory(this.tile_grid.get(tile_id), new_type)
        this.tile_grid.set(tile_id, new_tile)
        return new_tile
    }

    /**
     * Returns an array of tiles in the specified direction from the given tile ID.
     * @param {number} tile_id - The ID of the starting tile.
     * @param {string} direction - The direction to search for tiles. Must be one of "top", "right", "bot", or "left".
     * @param {number} [stride=1] - The number of tiles to skip before checking the next tile in the direction. Must be a positive integer greater than 0.
     * @param {number} [num_of_tiles=Infinity] - The maximum number of tiles to return. Must be a positive integer greater than 0 or Infinity.
     * @param {boolean} [exclude_start=false] - Whether to exclude the starting tile from the returned array.
     * @returns {Array.<number>} An array of tile IDs in the specified direction, starting from the given tile ID. If exclude_start is set to true, the array does not include the starting tile.
     * @throws {Error} If stride is not a positive integer greater than 0 or exclude_start is not a boolean.
     */
    get_tiles_in_direction(tile_id, direction, stride=1, num_of_tiles=Infinity, exclude_start=false) {
        if (!Number.isInteger(stride) || stride <= 0) throw new Error('stride must be a positive integer greater than 0');
        if (typeof exclude_start !== 'boolean') throw new Error('exclude_start must be a boolean');

        let following_tiles = []
        const movement_direction = this.move[direction] * stride
        while ((num_of_tiles-- >= 0) && this.tile_grid.has(tile_id)) { 
            following_tiles.push(tile_id)
            tile_id = tile_id + movement_direction
        }

        if (exclude_start) following_tiles.shift()

        return following_tiles
    }

    /**
     * Returns the tile ID of the tile on top of the given tile ID after moving `stride` number of steps.
     * @param {number} tile_id - The ID of the starting tile.
     * @param {number} [stride=1] - The number of steps to take.
     * @returns {number | undefined} - The ID of the tile on top of the starting tile, or undefined if it does not exist.
     */
    get_top_tile(tile_id, stride=1) {
        tile_id = tile_id + this.move['top'] * stride
        return this.tile_grid.has(tile_id) ? tile_id : undefined
    }

    /**
     * Returns the tile ID of the tile on the right of the given tile ID after moving `stride` number of steps.
     * @param {number} tile_id - The ID of the starting tile.
     * @param {number} [stride=1] - The number of steps to take.
     * @returns {number | undefined} - The ID of the tile on the right of the starting tile, or undefined if it does not exist.
     */
    get_right_tile(tile_id, stride = 1) {
        tile_id = tile_id + this.move['right'] * stride
        return this.tile_grid.has(tile_id) ? tile_id : undefined
    }

    /**
     * Returns the tile ID of the tile below the given tile ID after moving `stride` number of steps.
     * @param {number} tile_id - The ID of the starting tile.
     * @param {number} [stride=1] - The number of steps to take.
     * @returns {number | undefined} - The ID of the tile below the starting tile, or undefined if it does not exist.
     */
    get_bot_tile(tile_id, stride = 1) {
        tile_id = tile_id + this.move['bot'] * stride
        return this.tile_grid.has(tile_id) ? tile_id : undefined
    }

    /**
     * Returns the tile ID of the tile on the left of the given tile ID after moving `stride` number of steps.
     * @param {number} tile_id - The ID of the starting tile.
     * @param {number} [stride=1] - The number of steps to take.
     * @returns {number | undefined} - The ID of the tile on the left of the starting tile, or undefined if it does not exist.
     */
    get_left_tile(tile_id, stride = 1) {
        tile_id = tile_id + this.move['left'] * stride
        return this.tile_grid.has(tile_id) ? tile_id : undefined
    }
    
    /**
     * Returns the IDs of the tiles that are within `stride` steps from the given tile ID.
     * @param {number} tile_id - The ID of the starting tile.
     * @param {number} [stride=1] - The number of steps to take in each direction.
     * @returns {Array<number>} - An array containing the IDs of the neighbouring tiles.
     */
    get_neighbour_ids(tile_id, stride = 1) {
        const top = this.get_top_tile(tile_id, stride);
        const right = this.get_right_tile(tile_id, stride);
        const bot = this.get_bot_tile(tile_id, stride);
        const left = this.get_left_tile(tile_id, stride);
        return [top, right, bot, left].filter(neighbor => neighbor !== undefined);
    }
}

// export default TileGrid