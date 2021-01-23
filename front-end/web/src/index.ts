import { GameBoard } from './GameBoard.js'

document.getElementById('single_player').addEventListener("click", startSinglePlayer)
let canvas = document.getElementById("canvas") as HTMLCanvasElement
let menu = document.getElementById("menu")

function startSinglePlayer() {
    menu.style.display = "none"
    canvas.style.display = "block"
    new GameBoard(canvas, showMenu)
}

function showMenu() {
    menu.style.display = "flex"
    canvas.style.display = "none"
}
