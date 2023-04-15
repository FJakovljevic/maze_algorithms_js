
/**
 * Performs A* search algorithm on a given maze to find the shortest path between the start and finish tiles.
 * @param {TileGrid} maze - The maze object to search.
 * @returns {void} - Does not return anything, but modifies the maze object by changing the type of its tiles.
 */
function  a_star_search(maze) {
    console.log('Starting of A star search');

    // getting start tile
    const all_tiles = maze.get_all_tiles()
    const [start_id, start] = maze.get_start_tile()

    // getting finish tile
    const finish_id = all_tiles.filter(x => maze.get_tile(x).get_type() === TileTypeEnumeration.FINISH)
    const finish = maze.get_tile(finish_id)

    let queue = [{ 
        id: start_id,
        tile: start,
        node_path: [],
        cost: start.center.get_manhattan_distance(finish.center)
    }]

    let selected_node
    while (queue.length != 0) {
        // sort nodes by least cost (distance to finish)
        queue = queue.sort((a, b) => a.cost - b.cost)

        // pop node with least cost
        selected_node = queue.shift(1)

        // is selected node is finish exit out of loop
        if (selected_node.tile.get_type() === TileTypeEnumeration.FINISH)
            break

        // for every neighbour node if its PATH or FINISH add them to queue
        maze.get_neighbour_ids(selected_node.id).forEach(node_id => {
            node_tile = maze.get_tile(node_id)
            if (node_tile.get_type() === TileTypeEnumeration.PATH || node_tile.get_type() === TileTypeEnumeration.FINISH) {
                queue.push({
                    id: node_id,
                    tile: node_tile,
                    node_path: [node_id, ...selected_node.node_path],
                    cost: selected_node.cost + node_tile.center.get_manhattan_distance(finish.center)
                })
            }
        });

        // draw changes
        if (selected_node.id != start_id)
            maze.stage_changes(maze.switch_tile_type(selected_node.id, TileTypeEnumeration.VISITED))
    }

    // backtracing part
    if (selected_node.id != finish_id)
        return
        
    selected_node.node_path.shift(1)
    selected_node.node_path.forEach(element => {
        maze.stage_changes(maze.switch_tile_type(element, TileTypeEnumeration.CHOOSEN_PATH))
    });

    console.log('A star search finished');
}
