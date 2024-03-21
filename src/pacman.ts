import Board from "./board.js";
import CellType from "./cellType.js";
import Direction from "./direction.js";
import Entity from "./entity.js";
import Ghost from "./ghost.js";
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

    reset(){
        super.reset()
        this.movableTick = 0
    }

    canMoveTo(x: number, y: number, ghosts: Ghost[]){
        super.checkTunnel(this.board.width)

        let ok = this.processCell(super.fixX(x), super.fixY(y), ghosts)
        if (ok) super.nextTick()
        return ok
    }

    processCell(x: number, y: number, ghosts: Ghost[]): boolean {
        let cell = this.board.matrix[y][x]
        
        if (cell === CellType.Food) {
            this.board.matrix[y][x] = CellType.Space
            this.board.foodCount -= 1
            this.match.score += 10
        } else if (cell === CellType.BigFood){
            this.board.matrix[y][x] = CellType.Space
            this.board.foodCount -= 1
            ghosts.forEach(g => g.scare(8000))
        }
        
        return super.canMoveOn(cell) && cell != CellType.GhostHouse
    }

    moveAuto(ghosts: Ghost[]){
        if (++this.movableTick < 3) return
        this.movableTick = 0

        switch(this.direction){
            case Direction.UP:
                if (this.canMoveTo(this.x, this.y-0.5, ghosts)) super.moveUp()
                break
            case Direction.LEFT:
                if (this.canMoveTo(this.x-0.5, this.y, ghosts)) super.moveLeft()
                break
            case Direction.RIGHT:
                if (this.canMoveTo(this.x+0.5, this.y, ghosts)) super.moveRight()
                break
            case Direction.DOWN:
                if (this.canMoveTo(this.x, this.y+0.5, ghosts)) super.moveDown()
                break
        }
    }

    draw(ctx: CanvasRenderingContext2D, imgRepo: ImgRepo){
        const cellSize = this.board.cellSize
        let img = this.tick % 2 ? imgRepo.pacmanClosedImg : imgRepo.pacmanImgs[this.direction]
        ctx.drawImage(img, this.x*cellSize, this.y*cellSize, cellSize, cellSize)
    }

    lose(){
        let rotateIntervalId = setInterval(() => {
            this.rotateClockwise()
        }, 200)

        setTimeout(() => {
            clearInterval(rotateIntervalId)
            this.reset()
        }, 1700)
    }
}