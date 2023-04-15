/**
 * Performs a depth-first search to find a path from the start tile to the finish tile in the given maze.
 * @param {Maze} maze - The maze to search.
 * @returns {void} - Does not return anything, but modifies the maze object by changing the type of its tiles.
 */
function deapth_first_search(maze) {
    console.log('Starting of depth first search');

    // get stating tile
    let [tile_id, _] = maze.get_start_tile()

    // recursive deapth first search
    const path_to_finish = recursive_search(maze, {id: tile_id, type: maze.get_tile(tile_id).get_type()})

    // backtracing part
    if (!path_to_finish)
        return
    path_to_finish.forEach(element => {
        maze.stage_changes(maze.switch_tile_type(element.id, TileTypeEnumeration.CHOOSEN_PATH))
    });

    console.log('Depth first search finished');
}

/**
 * Recursive helper function for depth-first search.
 * @param {Maze} maze - The maze to search.
 * @param {Tile} tile - The current tile being searched.
 * @returns {Tile[]|undefined} An array of tiles representing the path to the finish tile, or undefined if no path was found.
 */
function recursive_search(maze, tile) {
    // get possible paths
    const neighbours = maze.get_neighbour_ids(tile.id).map(edge_tile => {
        return {id: edge_tile, 
                type: maze.get_tile(edge_tile).get_type()}
    }).filter(x => x.type === TileTypeEnumeration.FINISH || x.type === TileTypeEnumeration.PATH)

    if (neighbours.length == 0)
        return undefined 

    // recursive call for neighbours
    for (const neighbour_tile of neighbours) {

        // check if neighbour tile is FINISH
        if (neighbour_tile.type === TileTypeEnumeration.FINISH)
            return []

        // mark tile as visited
        maze.stage_changes(maze.switch_tile_type(neighbour_tile.id, TileTypeEnumeration.VISITED))

        // recursive call for the tile
        const ret = recursive_search(maze, neighbour_tile)
        if (ret !== undefined)
            return [...ret, neighbour_tile]       
    }
}