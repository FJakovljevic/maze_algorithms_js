// import Point2D from "./PointClass"

/**
 * Enumeration class that contains all possible tile variations
 */
class TileTypeEnumeration {
    static UNREGISTERED = 'UNREGISTERED'
    static PATH = 'PATH'
    static WALL = 'WALL'

    static START = 'START'
    static FINISH = 'FINISH'

    /**
     * Factory method to create a new Tile of the specified TileTypeEnumeration.
     * @param {Tile} tile - The original tile.
     * @param {TileTypeEnumeration} new_type - The new tile type.
     * @returns {Tile} A new Tile of the specified type.
     */
    static switch_tile_type_factory(tile, new_type) {
        switch (new_type) {
            case TileTypeEnumeration.START:
                return new StartTile(tile.tile_coords.x, tile.tile_coords.y, tile.pixel_size);

            case TileTypeEnumeration.FINISH:
                return new FinishTile(tile.tile_coords.x, tile.tile_coords.y, tile.pixel_size);

            case TileTypeEnumeration.PATH:
                return new FreeTile(tile.tile_coords.x, tile.tile_coords.y, tile.pixel_size);

            case TileTypeEnumeration.WALL:
                return new WallTile(tile.tile_coords.x, tile.tile_coords.y, tile.pixel_size);

            default:
                return new Tile(tile.tile_coords.x, tile.tile_coords.y, tile.pixel_size)
        }    
    }
}


/**
 * Class Tile
 * 
 * This is the parent class for all types of tiles.
 * It defines basic properties and methods that are shared by all tile types.
 * @class
 * @property {TileTypeEnumeration} type - The type of the tile. By default, it is set to UNREGISTERED, but it can be set to FREE, WALL, RED, or any other custom tile type.
 * @property {number} pixel_size - The size of the tile in pixels.
 * @property {Point2D} tile_coords - The coordinates of the tile in the maze grid.
 * @property {Point2D} corner - The position of the top-left corner of the tile in the canvas, in pixels.
 * @property {Point2D} center - The position of the center of the tile in the canvas, in pixels.
 */
class Tile {
    /**
     * The type of tile, as defined by the TileTypeEnumeration.
     * This property should be overridden by the subclasses of Tile.
     */
    static type = TileTypeEnumeration.UNREGISTERED

    /**
     * Constructs a new Tile object.
     * @param {number} x - The x coordinate of the tile in the grid.
     * @param {number} y - The y coordinate of the tile in the grid.
     * @param {number} pixel_size - The pixel size of the tile.
     */
    constructor(x, y, pixel_size) {
        this.pixel_size = pixel_size
        this.tile_coords = new Point2D(x, y)

        const corner = new Point2D(x*pixel_size, y*pixel_size)
        this.corner = corner
        
        const center_offset = pixel_size/2
        this.center = new Point2D(corner.x+center_offset, corner.y+center_offset)
    }

    /**
     * Returns the type of tile.
     * @returns {TileTypeEnumeration} - The type of tile.
     */
    get_type() {
        return this.constructor.type
    }

    /**
     * Draws the tile on the canvas.
     * This method should be overridden by the subclasses of Tile.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        throw new Error('draw method must be implemented in subclasses of Tile');
    }
}


class FreeTile extends Tile {
    static type = TileTypeEnumeration.PATH

    draw(ctx) {
        const offset = 0.5
        ctx.fillStyle = 'gray'
        ctx.fillRect(this.corner.x+offset, this.corner.y+offset, this.pixel_size-offset, this.pixel_size-offset)
    }
}


class WallTile extends Tile {
    static type = TileTypeEnumeration.WALL

    draw(ctx) {
        const offset = 0.5
        ctx.fillStyle = 'black'
        ctx.fillRect(this.corner.x+offset, this.corner.y+offset, this.pixel_size-offset, this.pixel_size-offset)
    }
}


class FinishTile extends Tile {
    static type = TileTypeEnumeration.FINISH

    draw(ctx) {
        const offset = 0.5
        ctx.fillStyle = 'red'
        ctx.fillRect(this.corner.x+offset, this.corner.y+offset, this.pixel_size-offset, this.pixel_size-offset)
    }
}


class StartTile extends Tile {
    static type = TileTypeEnumeration.START

    draw(ctx) {
        const offset = 0.5
        ctx.fillStyle = 'green'
        ctx.fillRect(this.corner.x + offset, this.corner.y + offset, this.pixel_size - offset, this.pixel_size - offset)
    }
}

// export {Tile, WallTile, FreeTile, TileTypeEnumeration}