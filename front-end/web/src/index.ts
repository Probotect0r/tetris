import { GameBoard } from './GameBoard.js'

document.getElementById('single_player').addEventListener("click", startSinglePlayer)

function startSinglePlayer() {
    let canvas = document.getElementById("canvas")
    let menu = document.getElementById("menu")

    menu.style.display = "none"
    canvas.style.display = "block"
    let gameBoard = new GameBoard()
}
