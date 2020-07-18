export abstract class Tetromino {
    xPosition: number
    yPosition: number
    layout: number[][]
    colour: string

    rotate() {
        let rotatedLayout: number[][] = []
        for (let column = 0; column < this.layout[0].length; column++) {
            rotatedLayout.push([])
            for (let row = this.layout.length - 1; row > -1; row--) {
                rotatedLayout[column].push(this.layout[row][column])
            }
        }

        this.layout = rotatedLayout
    }

    static copy<T extends Tetromino>(piece: T): Tetromino {
        let copy =  new T()
        copy.layout = piece.layout
        copy.xPosition = piece.xPosition
        copy.yPosition = piece.yPosition
        copy.colour = piece.colour
        return copy
    }
}

export class Z extends Tetromino {
    xPosition = 0
    yPosition = 0
    layout = [
        [1, 1, 0],
        [0, 1, 1]
    ]
    colour = 'red'
}

export class ReverseZ extends Tetromino {
    xPosition = 0
    yPosition = 0
    layout = [
        [0, 1, 1],
        [1, 1, 0]
    ]
    colour = 'green'
}

export class L extends Tetromino {
    xPosition = 0
    yPosition = 0
    layout = [
        [1, 0, 0],
        [1, 1, 1]
    ]
    colour = 'blue'
}

export class ReverseL extends Tetromino {
    xPosition = 0
    yPosition = 0
    layout = [
        [0, 0, 1],
        [1, 1, 1]
    ]
    colour = 'orange'
}

export class Line extends Tetromino {
    xPosition = 0
    yPosition = 0
    layout = [
        [1, 1, 1, 1]
    ]
    colour = 'cyan'
}

export class T extends Tetromino {
    xPosition = 0
    yPosition = 0
    layout = [
        [0, 1, 0],
        [1, 1, 1]
    ]
    colour = 'purple'
}

export class Block extends Tetromino {
    xPosition = 0
    yPosition = 0
    layout = [
        [1, 1],
        [1, 1]
    ]
    colour = 'yellow'
}

