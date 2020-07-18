import {Tetromino, Z, ReverseZ, L, ReverseL, Line, T, Block} from './Pieces'
export class GameBoard {
    private canvas: HTMLCanvasElement
    private canvasContext: CanvasRenderingContext2D

    private readonly numberOfColumns = 12
    private readonly numberOfRows = 25
    private updateInterval = 400
    private tileSize: number;

    private tiles: Tile[][] = []
    private currentPiece: Tetromino

    constructor() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.canvasContext = this.canvas.getContext("2d")
        this.canvasContext.globalAlpha = 1

        // set up canvas
        this.calculateTileSize()
        this.updateCanvasSize()

        // set up board
        this.initializeBoardTiles()
        this.spawnNewPiece()

        // handle key presses
        document.addEventListener('keydown', this.handleInput.bind(this))

        // start drawing
        setInterval(this.update.bind(this), this.updateInterval)
        window.requestAnimationFrame(this.draw.bind(this))
    }

    private calculateTileSize() {
        // leave 2 pixels for border
        this.tileSize = Math.floor((window.innerHeight - 2) / this.numberOfRows)
        console.log(`tile size: ${this.tileSize}`)
    }

    private updateCanvasSize() {
        this.canvas.height = this.numberOfRows * this.tileSize
        this.canvas.width = this.numberOfColumns * this.tileSize
    }

    private initializeBoardTiles() {
        for (let i = 0; i < this.numberOfRows; i++) {
            this.tiles.push([])
            for (let j = 0; j < this.numberOfRows; j++) {
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
        window.requestAnimationFrame(this.draw.bind(this))
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
        if (this.pieceHasCollided()) {
            this.commitCurrentPieceToBoard()
            this.spawnNewPiece()
        } else {
            this.currentPiece.yPosition++
        }
    }

    private pieceHasCollided(piece: Tetromino = this.currentPiece): boolean {
        let {layout, xPosition, yPosition} = piece
        if (yPosition + layout.length - 1 == (this.numberOfRows - 1)) return true

        for (let row = layout.length - 1; row > -1; row--) {
            for (let column = 0; column < layout[row].length; column++) {
                if (layout[row][column] == 1 && this.tiles[yPosition + row + 1][xPosition + column].isFilled)
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

    private movePieceLeft() {
        let copy = Tetromino.copy(this.currentPiece)
        copy.xPosition--
        if (copy.xPosition < 0 || this.pieceHasCollided(copy)) return
        this.currentPiece.xPosition--
    }

    private movePieceRight() {
        let copy = Tetromino.copy(this.currentPiece)
        copy.xPosition++
        if(this.pieceHasCollided(copy) || copy.xPosition + copy.layout[0].length - 1 == this.numberOfColumns) return
        this.currentPiece.xPosition++
    }

    private rotatePiece() {
        let copy = Tetromino.copy(this.currentPiece)
        copy.rotate()

        if (this.pieceHasCollided(copy)) return

        this.currentPiece.rotate()

        // adjust x position so that piece is not off screen after rotate
        let {xPosition, layout} = this.currentPiece
        if (xPosition + layout[0].length - 1 > this.numberOfColumns - 1) {
            this.currentPiece.xPosition = this.numberOfColumns - layout[0].length
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

    private dropPiece() {
        while (!this.pieceHasCollided()) {
            this.currentPiece.yPosition++
        }
    }
}

interface Tile {
    xPosition: number
    yPosition: number
    isFilled: boolean;
    colour?: string;
}
