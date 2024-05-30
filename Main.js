// giving arrays an ability to output a random element
Array.prototype.random = function () {
    return this[this.length * Math.random() | 0];
}

// global maze
let MAZE = undefined

// getting canvas from HTML
const canvas = document.getElementById('canvas')
canvas.width = document.getElementById('canvas_div').offsetWidth - 1
canvas.height = document.getElementById('canvas_div').offsetHeight - 1
console.log('Window size - ', 'width:', canvas.width, 'height:', canvas.height);
const ctx = canvas.getContext('2d')


async function maze_button_click() {
    // drawing black background on canvas
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // disable search button
    Array.from(document.getElementsByTagName("button")).forEach(b => b.disabled = true)

    MAZE = new TileGrid(ctx, canvas.width, canvas.height, 25)
    const selected = document.getElementById("maze_alg_selection").value
    switch (selected) {
        case 'Iterative Depth First Search':
            iteravtive_depth_first_search(MAZE)
            break;
        case 'Randomized Kruskal':
            randomized_kruksal(MAZE)
            break;
        case 'Recursive Division':
            recursive_division(MAZE)
            break;
    }

    // add start and finish tiles
    const path_tiles = MAZE.get_all_tiles().filter(x => MAZE.get_tile(x).get_type() === TileTypeEnumeration.PATH)
    const start_tile = MAZE.switch_tile_type(path_tiles.at(0), TileTypeEnumeration.START)
    const fisih_tile = MAZE.switch_tile_type(path_tiles.at(-1), TileTypeEnumeration.FINISH)
    MAZE.stage_changes([start_tile, fisih_tile])

    // draw maze
    await MAZE.draw_changes()

    // enable search button
    Array.from(document.getElementsByTagName("button")).forEach(b => b.disabled = false)
}


async function search_button_click() {
    // disable all buttons
    Array.from(document.getElementsByTagName("button")).forEach(b => b.disabled = true)

    // clear all previous searches
    console.log('Clearing all previous searches');
    MAZE.switch_all_tiles_with_type(TileTypeEnumeration.CHOOSEN_PATH, TileTypeEnumeration.PATH)
    MAZE.switch_all_tiles_with_type(TileTypeEnumeration.VISITED, TileTypeEnumeration.PATH)
    MAZE.redraw_maze()

    const selected = document.getElementById("search_alg_selection").value
    switch (selected) {
        case 'Depth First Search':
            deapth_first_search(MAZE)
            break;
        case 'Breadth First Search':
            breadth_first_search(MAZE)
            break;
        case 'A* Search':
            a_star_search(MAZE)
            break;
    }
    // draw maze
    await MAZE.draw_changes()

    // enable all buttons
    Array.from(document.getElementsByTagName("button")).forEach(b => b.disabled = false)
}
