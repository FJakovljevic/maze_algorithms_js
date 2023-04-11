// import Maze from "../utility_calsses/MazeClass"
// import { Tile, TileTypeEnumeration } from "../utility_calsses/TileClass"

/**
 * Generates a randomized Kruskal's maze using the provided maze object.
 * @param {TileGrid} maze - The maze object to generate the maze in.
 */
function randomized_kruksal(maze) {
    console.log('Starting of randomized kruksal Maze generation');
    let [start_tile_id, tile] = maze.get_start_tile() 

    // Create a list of all wall tile IDs
    let wall_ids_list = maze.get_all_tiles().filter((_elem, index) => index % 1 == 0)

    // Create a list of all path tile IDs
    let path_ids_list = maze.get_tiles_in_direction(start_tile_id, 'bot', stride=2)
        .flatMap(ednge_tile_id => maze.get_tiles_in_direction(ednge_tile_id, 'right', stride = 2)
        .map(tile_id => {
                    tile = maze.switch_tile_type(tile_id, TileTypeEnumeration.PATH)
                    tile.draw(maze.canvas_context)
                    return tile_id
                }
            )
        )

    // Create a DisjointSet from all path tiles (each path tile at start will be in separete set)
    const path_sets = new DisjointSet(path_ids_list);

    // Remove walls and join path cells until there is no more unvisited walls
    while (wall_ids_list.length != 0) {

        // get random wall and path tiles it divides
        const random_wall_id = wall_ids_list.random()
        const [tile_1, tile_2] = maze.get_neighbour_ids(random_wall_id).filter(
            tile_id => maze.get_tile(tile_id).get_type() === TileTypeEnumeration.PATH)
        
        // If the cells divided by this wall belong to distinct sets: Remove the wall.
        if (path_sets.union(tile_1, tile_2)) {
            wall_tile = maze.switch_tile_type(random_wall_id, TileTypeEnumeration.PATH)
            setTimeout(draw_changes_k, 5*TIMER++, wall_tile, maze.canvas_context)
        }

        wall_ids_list = wall_ids_list.filter(element => element!=random_wall_id)
    }

    console.log('Maze Generation finished');
}


/**
 * Class representing a Disjoint Set.
 * @class
 * @classdesc A Disjoint Set is a data structure that keeps track of a set of elements partitioned into a number of disjoint subsets.
 * The elements are divided into sets, with each set containing a single element to start with. The `union` function is used to join two sets together into one set.
 */
class DisjointSet {
    /**
     * Creates a new DisjointSet from an iterable.
     *
     * @constructor
     * @param {Iterable} iterable - The iterable to create the disjoint set from.
     * @throws {TypeError} Throws an error if the parameter is not iterable.
     */
    constructor(iterable) {
        if (!iterable[Symbol.iterator]) 
            throw new TypeError(`${iterable} is not iterable`);
        
        this.disjoint_set = Array.from(iterable).map(set_element => new Set([set_element]))
    }

    /**
   * Searches for sets containing items and performs an union of them if they are in separate sets.
   * 
   * @param {*} item_1 - The first item to search in disjoint sets.
   * @param {*} item_2 - The second item to search in disjoint sets.
   * @returns {boolean} `true` if union was successful, `false` if set items were already in the same set.
   */
    union(item_1, item_2) {
        // Find the sets that contain the two items.
        const set_1 = this.disjoint_set.find(element => element.has(item_1));
        const set_2 = this.disjoint_set.find(element => element.has(item_2));

        // If either item is not found or they are already in the same set, return false.
        if (set_1 === undefined || set_2 === undefined || set_1 === set_2) 
            return false;

        // Remove the two sets from the disjoint set array.
        this.disjoint_set = this.disjoint_set.filter(element => (element !== set_1 && element !== set_2));

        // Merge the two sets together by adding all elements from set_2 to set_1.
        set_2.forEach(element => set_1.add(element));

        // Add the merged set back to the disjoint set array.
        this.disjoint_set.push(set_1);
        return true;
    }
}


/**
 * A function that draws a single tile to a canvas context. Useful for slowing down the drawing of tile changes.
 * @param {Tile} tile - The tile to draw.
 * @param {CanvasRenderingContext2D} ctx - The canvas context to draw the tile on.
 */
function draw_changes_k(tile, ctx) {
    tile.draw(ctx)
}