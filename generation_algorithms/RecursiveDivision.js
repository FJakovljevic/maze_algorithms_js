/**
 * Generates a maze using the recursive division algorithm.
 * The function sets all maze cells to PATH initially, then uses the chamber_division function to divide the maze into chambers.
 * @param {TileGrid} maze - The maze object to generate the maze in.
 */
function recursive_division(maze) {
    console.log('Starting of recursive division Maze generation');
    let [tile_id, tile] = maze.get_start_tile() 

    // Set all cells as PATH
    maze.get_all_tiles().forEach(tile_id => {
        tile = maze.switch_tile_type(tile_id, TileTypeEnumeration.PATH)
        tile.draw(maze.canvas_context)
    });

    // get walls start tile ids
    chamber_division(maze, tile_id)
    console.log('Maze Generation finished');
}

/**
 * Divide the chamber recursively in two parts by creating a wall and then
 * call itself for the divided chambers until minimum chamber size is reached
 * @param {TileGrid} maze - The maze object to generate the walls on.
 * @param {number} start_tile - The tile ID of the starting tile for the current chamber.
 * @param {number} num_of_cols - The number of columns in the current chamber.
 * @param {number} num_of_rows - The number of rows in the current chamber.
 */
function chamber_division(maze, start_tile, num_of_cols=Infinity, num_of_rows=Infinity) {
    // getting tiles that can be start for a wall
    const right_wall = maze.get_right_tile(start_tile)
    const columns = maze.get_tiles_in_direction(tile_id=right_wall, direction='right', stride=2, num_of_tiles=num_of_cols-1)

    const bot_wall = maze.get_bot_tile(start_tile)
    const rows = maze.get_tiles_in_direction(tile_id=bot_wall, direction='bot', stride=2, num_of_tiles=num_of_rows-1)

    // we exit when we get to minimal chamber where division is not possible
    if (columns.length < 1 || rows.length < 1) return;
    

    // picking at random if we will have vertical(column) or horisontal(row) wall -- biased towards picking from more options
    const random_choice = Math.floor(Math.random() * (columns.length + rows.length + 1))
    if (random_choice <= columns.length) {

        // divide chamber in 2 parts and get the dividing tile
        num_of_cols = Math.floor(columns.length / 2)
        const wall_start_tile = columns[num_of_cols]

        // create wall and recursivly call chamber_division on right chamber
        create_wall(maze, wall_start_tile, 'bot', 2*num_of_rows+1)
        chamber_division(maze, maze.get_right_tile(wall_start_tile), columns.length-num_of_cols-1, num_of_rows);

    } else {

        // divide chamber in 2 parts and get the dividing tile
        num_of_rows = Math.floor(rows.length / 2)
        const wall_start_tile = rows[num_of_rows]

        // create wall and recursivly call chamber_division on bottom chamber
        create_wall(maze, wall_start_tile, 'right', 2 * num_of_cols +1)
        chamber_division(maze, maze.get_bot_tile(wall_start_tile), num_of_cols, rows.length-num_of_rows-1);
    }

    // recursive call for chamber_division
    chamber_division(maze, start_tile, num_of_cols, num_of_rows)
}

/**
 * Creates a new wall in the maze starting from the given tile in the given direction
 * @param {TileGrid} maze - The maze object to create a new wall in
 * @param {number} wall_start_tile - The tile ID of the starting tile for the new wall
 * @param {string} direction - The direction in which the wall should be created ('right' or 'bot')
 * @param {number} num_of_tiles - The number of tiles the new wall should span
 */
function create_wall(maze, wall_start_tile, direction, num_of_tiles) {
    // get all tiles that will become a new wall
    let new_walls = maze.get_tiles_in_direction(tile_id=wall_start_tile, direction=direction, stride=1, num_of_tiles=num_of_tiles)

    // pick a random hole in wall and change all tiles to wall tiles
    const hole = new_walls.filter((_elem, index) => index % 2 == 0).random()
    new_walls = new_walls.filter(e => e != hole).map(tile_id => maze.switch_tile_type(tile_id, TileTypeEnumeration.WALL))

    // draw changes
    maze.stage_changes(new_walls)
}