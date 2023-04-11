// giving arrays an ability to output a random element
Array.prototype.random = function () {
    return this[this.length * Math.random() | 0];
}

// getting canvas from HTML
const canvas = document.getElementById('canvas')
canvas.width  = document.getElementById('canvas_div').offsetWidth - 1
canvas.height = document.getElementById('canvas_div').offsetHeight - 1
console.log('Window size - ', 'width:', canvas.width, 'height:', canvas.height);
const ctx = canvas.getContext('2d')

let TIMER = 1

function on_button_click() {
    // drawing black background on canvas
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    TIMER = 1
    const MAZE = new TileGrid(ctx, canvas.width, canvas.height, 15)
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

    // draw start and end tile
    const tiles = MAZE.get_all_tiles()
    MAZE.switch_tile_type(tiles.at(0), TileTypeEnumeration.START).draw(MAZE.canvas_context)
    MAZE.switch_tile_type(tiles.at(-1), TileTypeEnumeration.FINISH).draw(MAZE.canvas_context)
}
