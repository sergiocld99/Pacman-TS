import Entity from "./entity.js"
import Direction from "./direction.js"
import Board from "./board.js"
import Pacman from "./pacman.js"
import ImgRepo from "./imgRepo.js"
import GhostStatus from "./ghostStatus.js"

export default class Ghost extends Entity {
    id: number
    bounces: number
    bounceLimit: number
    atHome: boolean
    status: GhostStatus
    board: Board
    pacman: Pacman

    constructor(id: number, board: Board, pacman: Pacman){
        super([11+id+(id>1 ? 2:0), 14, id % 3 ? Direction.UP : Direction.DOWN])
        this.id = id
        this.bounces = 0
        this.bounceLimit = 5 * (this.id + 1)
        this.atHome = true
        this.status = GhostStatus.Normal
        this.board = board
        this.pacman = pacman
    }

    reset(){
        super.reset()
        this.bounces = 0
        this.atHome = true
        this.status = GhostStatus.Normal
    }

    moveIfTicks(tickPeriod: number){
        switch(this.status){
            case GhostStatus.Normal:
                if (this.tick >= tickPeriod) this.moveAuto()
                break
            case GhostStatus.Vulnerable:
                if (this.tick >= tickPeriod+1) this.moveAuto()
                break
            case GhostStatus.Eaten:
                if (this.tick) this.moveAuto()
                break
        }

        super.nextTick()
    }

    moveAuto() {
        this.tick = 0
        
        switch(this.direction){
            case Direction.UP:
                this.moveUp()
                break
            case Direction.LEFT:
                this.moveLeft()
                break
            case Direction.RIGHT:
                this.moveRight()
                break
            case Direction.DOWN:
                this.moveDown()
                break
        }
    }

    moveUp(){
        if (this.y == 14 && (this.x == 6 || this.x == 21)){
            switch(this.status){
                case GhostStatus.Normal:
                    if (this.pacman.isBelow(this.y)) this.changeToRandomDirection()
                    else super.moveUp()
                    break
                case GhostStatus.Vulnerable:
                    if (this.pacman.isAbove(this.y)) this.changeToRandomDirection()
                    else super.moveUp()
                    break
                case GhostStatus.Eaten:
                    this.rotateTowardsHouse()
                    break
            }
        } else if (this.canMoveTo(this.x, this.y-0.5)){
            super.moveUp()
        } else {
            if (this.bounces < this.bounceLimit) this.direction = 3
            else {
                if (this.atHome) {
                    this.direction = this.x < 14 ? 2 : 1
                    this.atHome = false
                } else {
                    this.changeToRandomDirection()
                }
            }
        }
    }

    moveLeft(){
        if (this.status === GhostStatus.Eaten && this.x == 14 && this.y == 11){
            this.direction = 3
        } else if (this.x == 14 && this.y == 13){
            this.direction = 0
        } else if (this.canMoveTo(this.x-0.5, this.y)){
            super.moveLeft()
        } else {
            this.changeToRandomDirection()
        }
    }

    moveRight(){
        if (this.status === GhostStatus.Eaten && this.x == 14 && this.y == 11){
            this.direction = 3
        } else if (this.x == 13 && this.y == 13){
            this.direction = 0
        } else if (this.canMoveTo(this.x+0.5, this.y)){
            super.moveRight()
        } else this.changeToRandomDirection()
    }

    moveDown(){
        if (this.status === GhostStatus.Eaten && this.x == 14 && this.y == 14){
            this.unscare()
            this.direction = 0
        } else if (this.y == 14 && (this.x == 6 || this.x == 21)){
            switch(this.status){
                case GhostStatus.Normal:
                    if (this.pacman.isAbove(this.y)) this.changeToRandomDirection()
                    else super.moveDown()
                    break
                case GhostStatus.Vulnerable:
                    if (this.pacman.isBelow(this.y)) this.changeToRandomDirection()
                    else super.moveDown()
                    break
                case GhostStatus.Eaten:
                    this.rotateTowardsHouse()
                    break
            }
        } else if (this.canMoveTo(this.x, this.y+0.5)){
            super.moveDown()
        } else {
            if (this.atHome) this.direction = 0
            else this.changeToRandomDirection()
        }
    }

    canMoveTo(x:number,y:number): boolean{
        const x_try = super.fixX(x)
        const y_try = super.fixY(y)

        // check tunnel
        super.checkTunnel(this.board.width)

        let ok = this.isValidCell(x_try, y_try)
        if (!ok) this.bounces++
        return ok
    }

    isValidCell(x: number, y: number): boolean {
        const cell = this.board.matrix[y][x]
        return super.canMoveOn(cell)
    }

    rotateTowardsHouse(){
        switch (this.direction){
            case Direction.UP:
            case Direction.DOWN:
                this.direction = super.isToTheLeft(14) ? Direction.RIGHT : Direction.LEFT
                break
            case Direction.LEFT:
            case Direction.RIGHT:
                this.direction = super.isAbove(11) ? Direction.DOWN : Direction.UP
                break
        }
    }

    changeToRandomDirection(){
        let op1, op2

        switch (this.direction) {
            case Direction.UP:
            case Direction.DOWN:
                op1 = this.isValidCell(this.x-1, this.y)
                op2 = this.isValidCell(this.x+1, this.y)

                if (op1 && op2) {
                    if (this.status === GhostStatus.Eaten) this.rotateTowardsHouse()
                    else if (Math.random() < 0.4) this.direction = Math.random() < 0.5 ? 1 : 2
                    else if (this.status == GhostStatus.Vulnerable) this.direction = this.pacman.isToTheLeft(this.x) ? 2 : 1
                    else this.direction = this.pacman.isToTheLeft(this.x) ? 1 : 2
                } else if (op1) this.direction = 1
                else if (op2) this.direction = 2
                else this.goBackwards()
                break;
            case Direction.LEFT:
            case Direction.RIGHT:
                op1 = this.isValidCell(this.x, this.y-1)
                op2 = this.isValidCell(this.x, this.y+1)

                if (op1 && op2) {
                    if (this.status === GhostStatus.Eaten) this.rotateTowardsHouse()
                    else if (Math.random() < 0.4) this.direction = Math.random() < 0.5 ? 0 : 3
                    else if (this.status === GhostStatus.Vulnerable) this.direction = this.pacman.isAbove(this.y) ? 3 : 0
                    else this.direction = this.pacman.isAbove(this.y) ? 0 : 3
                } else if (op1) this.direction = 0
                else if (op2) this.direction = 3
                else this.goBackwards()
                break;
        }
    }

    unscare(){
        this.status = GhostStatus.Normal
        
        // go towards pacman
        switch (this.direction){
            case Direction.UP:
                if (this.pacman.isBelow(this.y)) this.goBackwards()
                break
            case Direction.LEFT:
                if (this.pacman.isToTheRight(this.x)) this.goBackwards()
                break
            case Direction.RIGHT:
                if (this.pacman.isToTheLeft(this.x)) this.goBackwards()
                break
            case Direction.DOWN:
                if (this.pacman.isAbove(this.y)) this.goBackwards()
                break
        }
    }

    // ---- DRAWING METHODS ---------------

    draw(ctx: CanvasRenderingContext2D, imgSize: number, imgRepo: ImgRepo){
        switch(this.status){
            case GhostStatus.Normal:
                this.drawNormal(ctx,imgSize,imgRepo)
                break
            case GhostStatus.Vulnerable:
                break
            case GhostStatus.Eaten:
                break
        }
    }

    drawNormal(ctx: CanvasRenderingContext2D, imgSize: number, imgRepo: ImgRepo){
        const sw = imgSize
        const sh = imgSize
        const internalSize = 96
        const cellSize = this.board.cellSize
        let sx, sy

        switch(this.direction){
            case Direction.UP:
                sx = 0
                sy = internalSize
                break
            case Direction.LEFT:
                sx = internalSize
                sy = internalSize
                break
            case Direction.RIGHT:
                sx = 0
                sy = 0
                break
            case Direction.DOWN:
                sx = internalSize
                sy = 0
                break
        }

        ctx.drawImage(imgRepo.ghostImgs[this.id], sx, sy, sw, sh, this.x*cellSize, this.y*cellSize, cellSize*1.2, cellSize*1.2)
    }

    checkPacmanCollision(): boolean {
        switch(this.direction){
            case Direction.UP:
            case Direction.DOWN:
                if (this.x != this.pacman.x) return false
                return this.y == this.pacman.y || this.fixedY() == this.pacman.y || this.y == this.pacman.fixedY()                 
            case Direction.LEFT:
            case Direction.RIGHT:
                if (this.y != this.pacman.y) return false
                return this.x == this.pacman.x || this.fixedX() == this.pacman.x || this.x == this.pacman.fixedX()
        }
    }
}

