import {Tetromino, Z, ReverseZ, L, ReverseL, Line, T, Block} from './Pieces.js'
import {Tile} from './Tile.js'

export class GameBoard {
    private canvasContext: CanvasRenderingContext2D

    private readonly numberOfColumns = 10
    private readonly numberOfRows = 20
    private updateInterval = 600
    private tileSize = 30
    private timerIntervalID: number
    private gameOver = false;

    private tiles: Tile[][] = []
    private currentPiece: Tetromino
    private boundInputHandler

    constructor(private canvas: HTMLCanvasElement) {
        this.setupCanvas()
        this.initializeBoardTiles()
        this.spawnNewPiece()

        this.boundInputHandler = this.handleInput.bind(this)
        document.addEventListener('keydown', this.boundInputHandler)

        this.timerIntervalID = setInterval(this.update.bind(this), this.updateInterval)
        window.requestAnimationFrame(this.draw.bind(this))
    }

    private setupCanvas() {
        this.canvasContext = this.canvas.getContext("2d")
        this.canvasContext.globalAlpha = 1

        this.updateCanvasSize()
    }

    private calculateTileSize() {
        // leave 2 pixels for border
        this.tileSize = Math.floor((window.innerHeight - 2) / this.numberOfRows)
    }

    private updateCanvasSize() {
        this.canvas.height = this.numberOfRows * this.tileSize
        this.canvas.width = this.numberOfColumns * this.tileSize
    }

    private initializeBoardTiles() {
        for (let i = 0; i < this.numberOfRows; i++) {
            this.tiles.push([])
            for (let j = 0; j < this.numberOfColumns; j++) {
                this.tiles[i][j] = {xPosition: j, yPosition: i, isFilled: false}
            }
        }
    }

    private spawnNewPiece() {
        let pieceClasses = [Z, ReverseZ, L, ReverseL, Line, T, Block]
        let randomNumber = Math.floor(Math.random() * Math.floor(6))
        this.currentPiece = new pieceClasses[randomNumber]()
    }

    private draw() {
        this.drawBoard()
        this.drawCurrentPiece()
        if (!this.gameOver) window.requestAnimationFrame(this.draw.bind(this))
    }

    private drawBoard() {
        for (let i = 0; i < this.tiles.length; i++) {
            for (let j = 0; j < this.tiles[i].length; j++) {
                let tile = this.tiles[i][j]
                if (tile.isFilled) {
                    this.drawTile(j, i, tile.colour)
                } else {
                    this.clearTile(j, i)
                }
            }
        }
    }

    private drawCurrentPiece() {
        let layout = this.currentPiece.layout
        let colour = this.currentPiece.colour
        for (let i = 0; i < layout.length; i++) {
            for (let j = 0; j < layout[i].length; j++) {
                if (layout[i][j] == 1) {
                    this.drawTile(
                        this.currentPiece.xPosition + j,
                        this.currentPiece.yPosition + i,
                        colour
                    )
                }
            }
        }
    }

    private drawTile(xPosition: number, yPosition: number, colour: string) {
        // draws coloured tile within white tile for white border effect
        this.canvasContext.fillStyle = 'white'
        this.canvasContext.fillRect(
            xPosition * this.tileSize,
            yPosition * this.tileSize,
            this.tileSize,
            this.tileSize
        )

        this.canvasContext.fillStyle = colour
        this.canvasContext.fillRect(
            xPosition * this.tileSize + 1,
            yPosition * this.tileSize + 1,
            this.tileSize - 2,
            this.tileSize - 2
        )
    }

    private clearTile(xPosition: number, yPosition: number) {
        this.canvasContext.clearRect(
            xPosition * this.tileSize,
            yPosition * this.tileSize,
            this.tileSize,
            this.tileSize
        )
    }

    private update() {
        if (this.pieceHasCollidedBelow()) {
            if (this.gameHasEnded()) return this.endGame()
            this.commitCurrentPieceToBoard()
            this.spawnNewPiece()
        } else {
            this.currentPiece.yPosition++
        }
        this.clearFilledRows()
    }

    private gameHasEnded(): Boolean {
        return this.currentPiece.xPosition == 0 && this.currentPiece.yPosition == 0
    }

    private endGame() {
        this.gameOver = true
        window.clearInterval(this.timerIntervalID)
        document.removeEventListener('keydown', this.boundInputHandler)
    }

    private clearFilledRows() {
        let filledRowsRemoved = this.tiles.filter(row => !row.every(tile => tile.isFilled)) // remove all filled lines
        for (let i = this.numberOfRows - filledRowsRemoved.length - 1; i > -1; i--) {
            filledRowsRemoved.unshift([])
            for (let j = 0; j < this.numberOfColumns; j++) {
                filledRowsRemoved[0].push({xPosition: j, yPosition: i, isFilled: false})
            }
        }
        this.tiles = filledRowsRemoved
    }

    private pieceHasCollidedBelow(piece: Tetromino = this.currentPiece): boolean {
        let copy = Tetromino.copy(piece)
        copy.yPosition++
        return this.pieceHasCollided(copy)
    }

    private pieceHasCollided(piece: Tetromino = this.currentPiece): boolean {
        let {layout, xPosition, yPosition} = piece

        for (let row = 0; row < layout.length; row++) {
            for (let column = 0; column < layout[row].length; column++) {
                if (!this.tiles[yPosition + row] || !this.tiles[yPosition + row][xPosition + column]) return true // piece will be off board
                if (layout[row][column] == 1 && this.tiles[yPosition + row][xPosition + column].isFilled)
                    return true
            }
        }

        return false
    }

    private commitCurrentPieceToBoard() {
        let {layout, xPosition, yPosition, colour} = this.currentPiece
        for (let i = 0; i < layout.length; i++) {
            for (let j = 0; j < layout[i].length; j++) {
                if (layout[i][j] == 1) {
                    this.tiles[yPosition + i][xPosition + j].isFilled = true
                    this.tiles[yPosition + i][xPosition + j].colour = colour
                }
            }
        }
    }

    private handleInput(e: KeyboardEvent) {
        switch (e.code) {
            case 'ArrowRight': {
                this.movePieceRight()
                break
            }
            case 'ArrowLeft': {
                this.movePieceLeft()
                break
            }
            case 'Space': {
                this.dropPiece()
                break
            }
            case 'KeyS': {
                this.rotatePiece()
                break
            }
        }
    }

    private movePieceLeft() {
        let copy = Tetromino.copy(this.currentPiece)
        copy.xPosition--
        if (copy.xPosition < 0 || this.pieceHasCollided(copy)) return
        this.currentPiece.xPosition--
    }

    private movePieceRight() {
        let copy = Tetromino.copy(this.currentPiece)
        copy.xPosition++
        if (this.pieceHasCollided(copy)) return
        this.currentPiece.xPosition++
    }

    private rotatePiece() {
        let copy = Tetromino.copy(this.currentPiece)
        copy.rotate()

        // move piece left so its not off the board after rotating
        while (copy.layout[0].length + copy.xPosition - 1 >= this.numberOfColumns) {
            copy.xPosition--
        }

        if (this.pieceHasCollided(copy)) return

        this.currentPiece.xPosition = copy.xPosition // in case copy was moved left
        this.currentPiece.rotate()
    }

    private dropPiece() {
        while (!this.pieceHasCollidedBelow()) {
            this.currentPiece.yPosition++
        }
        this.commitCurrentPieceToBoard()
        this.spawnNewPiece()
        this.clearFilledRows()
    }
}

