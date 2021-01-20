import { GameBoard } from './GameBoard.js'

window.startSinglePlayer = function startSinglePlayer() {
    let canvas = document.getElementById("canvas")
    let menu = document.getElementById("menu")

    menu.style.display = "none"
    canvas.style.display = "block"
    let gameBoard = new GameBoard()
}
