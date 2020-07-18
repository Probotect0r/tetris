var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("Pieces", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.Block = exports.T = exports.Line = exports.ReverseL = exports.L = exports.ReverseZ = exports.Z = exports.Tetromino = void 0;
    var Tetromino = (function () {
        function Tetromino() {
        }
        Tetromino.prototype.rotate = function () {
            var rotatedLayout = [];
            for (var column = 0; column < this.layout[0].length; column++) {
                rotatedLayout.push([]);
                for (var row = this.layout.length - 1; row > -1; row--) {
                    rotatedLayout[column].push(this.layout[row][column]);
                }
            }
            this.layout = rotatedLayout;
        };
        Tetromino.copy = function (piece) {
            var copy = new T();
            copy.layout = piece.layout;
            copy.xPosition = piece.xPosition;
            copy.yPosition = piece.yPosition;
            copy.colour = piece.colour;
            return copy;
        };
        return Tetromino;
    }());
    exports.Tetromino = Tetromino;
    var Z = (function (_super) {
        __extends(Z, _super);
        function Z() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.xPosition = 0;
            _this.yPosition = 0;
            _this.layout = [
                [1, 1, 0],
                [0, 1, 1]
            ];
            _this.colour = 'red';
            return _this;
        }
        return Z;
    }(Tetromino));
    exports.Z = Z;
    var ReverseZ = (function (_super) {
        __extends(ReverseZ, _super);
        function ReverseZ() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.xPosition = 0;
            _this.yPosition = 0;
            _this.layout = [
                [0, 1, 1],
                [1, 1, 0]
            ];
            _this.colour = 'green';
            return _this;
        }
        return ReverseZ;
    }(Tetromino));
    exports.ReverseZ = ReverseZ;
    var L = (function (_super) {
        __extends(L, _super);
        function L() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.xPosition = 0;
            _this.yPosition = 0;
            _this.layout = [
                [1, 0, 0],
                [1, 1, 1]
            ];
            _this.colour = 'blue';
            return _this;
        }
        return L;
    }(Tetromino));
    exports.L = L;
    var ReverseL = (function (_super) {
        __extends(ReverseL, _super);
        function ReverseL() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.xPosition = 0;
            _this.yPosition = 0;
            _this.layout = [
                [0, 0, 1],
                [1, 1, 1]
            ];
            _this.colour = 'orange';
            return _this;
        }
        return ReverseL;
    }(Tetromino));
    exports.ReverseL = ReverseL;
    var Line = (function (_super) {
        __extends(Line, _super);
        function Line() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.xPosition = 0;
            _this.yPosition = 0;
            _this.layout = [
                [1, 1, 1, 1]
            ];
            _this.colour = 'cyan';
            return _this;
        }
        return Line;
    }(Tetromino));
    exports.Line = Line;
    var T = (function (_super) {
        __extends(T, _super);
        function T() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.xPosition = 0;
            _this.yPosition = 0;
            _this.layout = [
                [0, 1, 0],
                [1, 1, 1]
            ];
            _this.colour = 'purple';
            return _this;
        }
        return T;
    }(Tetromino));
    exports.T = T;
    var Block = (function (_super) {
        __extends(Block, _super);
        function Block() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.xPosition = 0;
            _this.yPosition = 0;
            _this.layout = [
                [1, 1],
                [1, 1]
            ];
            _this.colour = 'yellow';
            return _this;
        }
        return Block;
    }(Tetromino));
    exports.Block = Block;
});
define("GameBoard", ["require", "exports", "Pieces"], function (require, exports, Pieces_1) {
    "use strict";
    exports.__esModule = true;
    exports.GameBoard = void 0;
    var GameBoard = (function () {
        function GameBoard() {
            this.numberOfColumns = 12;
            this.numberOfRows = 25;
            this.updateInterval = 400;
            this.tiles = [];
            this.canvas = document.getElementById("canvas");
            this.canvasContext = this.canvas.getContext("2d");
            this.canvasContext.globalAlpha = 1;
            this.calculateTileSize();
            this.updateCanvasSize();
            this.initializeBoardTiles();
            this.spawnNewPiece();
            document.addEventListener('keydown', this.handleInput.bind(this));
            setInterval(this.update.bind(this), this.updateInterval);
            window.requestAnimationFrame(this.draw.bind(this));
        }
        GameBoard.prototype.calculateTileSize = function () {
            this.tileSize = Math.floor((window.innerHeight - 2) / this.numberOfRows);
            console.log("tile size: " + this.tileSize);
        };
        GameBoard.prototype.updateCanvasSize = function () {
            this.canvas.height = this.numberOfRows * this.tileSize;
            this.canvas.width = this.numberOfColumns * this.tileSize;
        };
        GameBoard.prototype.initializeBoardTiles = function () {
            for (var i = 0; i < this.numberOfRows; i++) {
                this.tiles.push([]);
                for (var j = 0; j < this.numberOfRows; j++) {
                    this.tiles[i][j] = { xPosition: j, yPosition: i, isFilled: false };
                }
            }
        };
        GameBoard.prototype.spawnNewPiece = function () {
            var pieceClasses = [Pieces_1.Z, Pieces_1.ReverseZ, Pieces_1.L, Pieces_1.ReverseL, Pieces_1.Line, Pieces_1.T, Pieces_1.Block];
            var randomNumber = Math.floor(Math.random() * Math.floor(6));
            this.currentPiece = new pieceClasses[randomNumber]();
        };
        GameBoard.prototype.draw = function () {
            this.drawBoard();
            this.drawCurrentPiece();
            window.requestAnimationFrame(this.draw.bind(this));
        };
        GameBoard.prototype.drawBoard = function () {
            for (var i = 0; i < this.tiles.length; i++) {
                for (var j = 0; j < this.tiles[i].length; j++) {
                    var tile = this.tiles[i][j];
                    if (tile.isFilled) {
                        this.drawTile(j, i, tile.colour);
                    }
                    else {
                        this.clearTile(j, i);
                    }
                }
            }
        };
        GameBoard.prototype.drawCurrentPiece = function () {
            var layout = this.currentPiece.layout;
            var colour = this.currentPiece.colour;
            for (var i = 0; i < layout.length; i++) {
                for (var j = 0; j < layout[i].length; j++) {
                    if (layout[i][j] == 1) {
                        this.drawTile(this.currentPiece.xPosition + j, this.currentPiece.yPosition + i, colour);
                    }
                }
            }
        };
        GameBoard.prototype.drawTile = function (xPosition, yPosition, colour) {
            this.canvasContext.fillStyle = 'white';
            this.canvasContext.fillRect(xPosition * this.tileSize, yPosition * this.tileSize, this.tileSize, this.tileSize);
            this.canvasContext.fillStyle = colour;
            this.canvasContext.fillRect(xPosition * this.tileSize + 1, yPosition * this.tileSize + 1, this.tileSize - 2, this.tileSize - 2);
        };
        GameBoard.prototype.clearTile = function (xPosition, yPosition) {
            this.canvasContext.clearRect(xPosition * this.tileSize, yPosition * this.tileSize, this.tileSize, this.tileSize);
        };
        GameBoard.prototype.update = function () {
            if (this.pieceHasCollided()) {
                this.commitCurrentPieceToBoard();
                this.spawnNewPiece();
            }
            else {
                this.currentPiece.yPosition++;
            }
        };
        GameBoard.prototype.pieceHasCollided = function (piece) {
            if (piece === void 0) { piece = this.currentPiece; }
            var layout = piece.layout, xPosition = piece.xPosition, yPosition = piece.yPosition;
            if (yPosition + layout.length - 1 == (this.numberOfRows - 1))
                return true;
            for (var row = layout.length - 1; row > -1; row--) {
                for (var column = 0; column < layout[row].length; column++) {
                    if (layout[row][column] == 1 && this.tiles[yPosition + row + 1][xPosition + column].isFilled)
                        return true;
                }
            }
            return false;
        };
        GameBoard.prototype.commitCurrentPieceToBoard = function () {
            var _a = this.currentPiece, layout = _a.layout, xPosition = _a.xPosition, yPosition = _a.yPosition, colour = _a.colour;
            for (var i = 0; i < layout.length; i++) {
                for (var j = 0; j < layout[i].length; j++) {
                    if (layout[i][j] == 1) {
                        this.tiles[yPosition + i][xPosition + j].isFilled = true;
                        this.tiles[yPosition + i][xPosition + j].colour = colour;
                    }
                }
            }
        };
        GameBoard.prototype.movePieceLeft = function () {
            var copy = Pieces_1.Tetromino.copy(this.currentPiece);
            copy.xPosition--;
            if (copy.xPosition < 0 || this.pieceHasCollided(copy))
                return;
            this.currentPiece.xPosition--;
        };
        GameBoard.prototype.movePieceRight = function () {
            var copy = Pieces_1.Tetromino.copy(this.currentPiece);
            copy.xPosition++;
            if (this.pieceHasCollided(copy) || copy.xPosition + copy.layout[0].length - 1 == this.numberOfColumns)
                return;
            this.currentPiece.xPosition++;
        };
        GameBoard.prototype.rotatePiece = function () {
            var copy = Pieces_1.Tetromino.copy(this.currentPiece);
            copy.rotate();
            if (this.pieceHasCollided(copy))
                return;
            this.currentPiece.rotate();
            var _a = this.currentPiece, xPosition = _a.xPosition, layout = _a.layout;
            if (xPosition + layout[0].length - 1 > this.numberOfColumns - 1) {
                this.currentPiece.xPosition = this.numberOfColumns - layout[0].length;
            }
        };
        GameBoard.prototype.handleInput = function (e) {
            switch (e.code) {
                case 'ArrowRight': {
                    this.movePieceRight();
                    break;
                }
                case 'ArrowLeft': {
                    this.movePieceLeft();
                    break;
                }
                case 'Space': {
                    this.dropPiece();
                    break;
                }
                case 'KeyS': {
                    this.rotatePiece();
                    break;
                }
            }
        };
        GameBoard.prototype.dropPiece = function () {
            while (!this.pieceHasCollided()) {
                this.currentPiece.yPosition++;
            }
        };
        return GameBoard;
    }());
    exports.GameBoard = GameBoard;
});
define("index", ["require", "exports", "GameBoard"], function (require, exports, GameBoard_1) {
    "use strict";
    exports.__esModule = true;
    var gameBoard = new GameBoard_1.GameBoard();
});
//# sourceMappingURL=index.js.map