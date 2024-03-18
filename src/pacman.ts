import Board from "./board.js";
import CellType from "./cellType.js";
import Direction from "./direction.js";
import Entity from "./entity.js";
import ImgRepo from "./imgRepo.js";
import Match from "./match.js";

export default class Pacman extends Entity {
    board: Board
    match: Match
    movableTick: number

    constructor(board: Board, match: Match){
        super([board.width / 2 - 1, board.height-8, Direction.RIGHT])
        this.board = board
        this.match = match
        this.movableTick = 0
    }

    canMoveTo(x: number, y: number){
        super.checkTunnel(this.board.width)

        let ok = this.isValidCell(super.fixX(x), super.fixY(y))
        if (ok) super.nextTick()
        return ok
    }

    isValidCell(x: number, y: number): boolean {
        let cell = this.board.matrix[y][x]
        
        if (cell === CellType.Food) {
            this.board.matrix[y][x] = CellType.Space
            this.board.foodCount -= 1
            this.match.score += 10
        } else if (cell === CellType.BigFood){
            this.board.matrix[y][x] = CellType.Space
            this.board.foodCount -= 1
        }
        
        return super.canMoveOn(cell) && cell != CellType.GhostHouse
    }

    moveAuto(){
        if (++this.movableTick < 3) return
        this.movableTick = 0

        switch(this.direction){
            case Direction.UP:
                if (this.canMoveTo(this.x, this.y-0.5)) super.moveUp()
                break
            case Direction.LEFT:
                if (this.canMoveTo(this.x-0.5, this.y)) super.moveLeft()
                break
            case Direction.RIGHT:
                if (this.canMoveTo(this.x+0.5, this.y)) super.moveRight()
                break
            case Direction.DOWN:
                if (this.canMoveTo(this.x, this.y+0.5)) super.moveDown()
                break
        }
    }

    draw(ctx: CanvasRenderingContext2D, imgRepo: ImgRepo){
        const cellSize = this.board.cellSize
        let img = this.tick % 2 ? imgRepo.pacmanClosedImg : imgRepo.pacmanImgs[this.direction]
        ctx.drawImage(img, this.x*cellSize, this.y*cellSize, cellSize, cellSize)
    }
}