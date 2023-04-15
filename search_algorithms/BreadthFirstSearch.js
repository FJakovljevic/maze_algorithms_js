/**
 * Performs a breadth-first search on a given maze
 * @param {TileGrid} maze - The maze object on which to perform the search
 * @returns {void} - Does not return anything, but modifies the maze object by changing the type of its tiles.
 */
function breadth_first_search(maze) {
    console.log('Starting of breadth first search');

    // get stating tile
    let [tile_id, _] = maze.get_start_tile()
    let parent_edge_row = [{
        parent: undefined,
        edge_id: tile_id,
        edge_type: maze.get_tile(tile_id).get_type()
    }]

    // init finish and history for backtracking and drawing
    let finish
    let history = [parent_edge_row]
    while (true) {
        // get all neighbours and assing them to parents
        const new_parent_edge_row = parent_edge_row.flatMap(item => {
            return maze.get_neighbour_ids(item.edge_id).map(new_edge => {
                return {
                    parent: item.edge_id, 
                    edge_id: new_edge, 
                    edge_type: maze.get_tile(new_edge).get_type()
                }
            });
        })
        
        // Find the first edge with a type of FINISH else return undefined
        finish = new_parent_edge_row.find(x => x.edge_type === TileTypeEnumeration.FINISH)

        // Get all new edges with a type of PATH
        parent_edge_row = new_parent_edge_row.filter(x => x.edge_type === TileTypeEnumeration.PATH);

        // If we have reached the finish or have nowhere else to move, exit the loop
        if (finish || parent_edge_row.length == 0)
            break

        // push new edges and parents so we can backtrack later
        history.push(parent_edge_row)

        // draw changes
        maze.stage_changes(parent_edge_row.map(item => maze.switch_tile_type(item.edge_id, TileTypeEnumeration.VISITED)))
    }

    // backtracing part
    if (!finish)
        return

    history.shift(1)
    let previous = finish
    for (const row of history.reverse()){
        previous = row.find(x => x.edge_id == previous.parent)
        maze.stage_changes(maze.switch_tile_type(previous.edge_id, TileTypeEnumeration.CHOOSEN_PATH))
    }

    console.log('Breadth first search finished');
}