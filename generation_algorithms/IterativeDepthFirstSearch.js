/**
 * Generates a maze using the iterative depth first search algorithm.
 * @param {TileGrid} maze - The maze object to generate the maze in.
 */
function iteravtive_depth_first_search(maze) {
    console.log('Starting of iterative depth first search Maze generation');

    // choose the initial cell,
    let [tile_id, tile] = maze.get_start_tile()
    tile = maze.switch_tile_type(tile_id, TileTypeEnumeration.PATH)
    tile.draw(maze.canvas_context)

    // mark it as visited and push it to the stack
    const visited_tiles = new Set([tile_id])
    const tile_stack = [tile_id]

    // While the stack is not empty
    while (tile_stack.length != 0) {

        // take one tile from tile stack
        let tile_id = tile_stack.pop()

        // get its walls and neighbours
        const tile_wall_ids = maze.get_neighbour_ids(tile_id)
        const tile_neighbour_ids = maze.get_neighbour_ids(tile_id, stride=2)

        // if all the neighbour are visited -- continue with next tile in stack
        const not_visited = tile_neighbour_ids.filter(id => !visited_tiles.has(id))
        if (not_visited.length == 0)
            continue;
        

        // returning a tile to stack -- it gets poped only when all neighbours are visited
        tile_stack.push(tile_id)

        // getting new random tile from array of not visited tiles [marking it as visited and adding it to stack]
        tile_id = not_visited.random()
        tile_stack.push(tile_id)
        visited_tiles.add(tile_id)
        
        // getting wall in between old tile and new tile
        let tile_wall = maze.get_neighbour_ids(tile_id).filter(id => tile_wall_ids.includes(id))[0]

        // swithiching the type of visited tile and inbetween wall to FREE
        tile = maze.switch_tile_type(tile_id, TileTypeEnumeration.PATH)
        tile_wall = maze.switch_tile_type(tile_wall, TileTypeEnumeration.PATH)

        setTimeout(draw_changes_i, 10*TIMER++, tile, tile_wall, maze.canvas_context);
    }
    console.log('Maze Generation finished');
}

/**
 * function that slows down drawing of tile changes so we can see it in slow motion
 * @param {Tile} tile 
 * @param {Tile} tile_wall 
 * @param {CanvasRenderingContext2D} ctx 
 */
function draw_changes_i(tile, tile_wall, ctx) {
    tile.draw(ctx)
    tile_wall.draw(ctx)
}
