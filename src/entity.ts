import CellType from "./cellType.js"
import Direction from "./direction.js"

const Entity = class {
    x: number
    y: number
    tick: number
    startPos: [number, number, Direction]
    direction: Direction

    constructor(start: [number, number, Direction]) {
        this.x = start[0]
        this.y = start[1]
        this.tick = 0
        this.startPos = start
        this.direction = start[2]
    }

    reset(){
        this.x = this.startPos[0]
        this.y = this.startPos[1]
        this.direction = this.startPos[2]
    }

    nextTick() {
        if (this.tick++ > 99) this.tick = 0
    }

    fixX(x: number){
        if (this.direction == Direction.RIGHT){
            return Math.ceil(x)
        } else {
            return Math.floor(x)
        }
    }

    fixY(y: number) : number {
        if (this.direction == Direction.DOWN){
            return Math.ceil(y)
        } else {
            return Math.floor(y)
        }
    }

    move(direction: Direction){
        if (direction === this.direction){
            switch(direction){
                case Direction.UP:
                    this.y -= 0.5
                    break
                case Direction.LEFT:
                    this.x -= 0.5
                    break
                case Direction.RIGHT:
                    this.x += 0.5
                    break
                case Direction.DOWN:
                    this.y += 0.5
                    break
            }
        } else {
            switch(direction){
                case Direction.UP:
                case Direction.DOWN:
                    this.x = this.fixX(this.x)
                    break
                case Direction.LEFT:
                case Direction.RIGHT:
                    this.y = this.fixY(this.y)
                    break
            }

            this.direction = direction
        } 
    }

    moveUp(){this.move(Direction.UP)}
    moveLeft(){this.move(Direction.LEFT)}
    moveRight(){this.move(Direction.RIGHT)}
    moveDown(){this.move(Direction.DOWN)}

    isBelow(y: number): boolean {
        return this.y > y
    }

    isAbove(y: number): boolean {
        return this.y < y
    }

    isToTheLeft(x: number): boolean {
        return this.x < x
    }

    isToTheRight(x: number): boolean {
        return this.x > x
    }

    goBackwards(){
        switch(this.direction){
            case Direction.UP:
                this.direction = Direction.DOWN
                break
            case Direction.LEFT:
                this.direction = Direction.RIGHT
                break
            case Direction.RIGHT:
                this.direction = Direction.LEFT
                break
            case Direction.DOWN:
                this.direction = Direction.UP
                break
        }
    }

    checkTunnel(boardWidth: number){
        if (this.x >= boardWidth-1) this.x = 0
        else if (this.x <= 0) this.x = boardWidth-1
    }

    canMoveOn(cellType: CellType): boolean {
        return cellType != CellType.Wall
    }

    fixedX(): number {
        return this.fixX(this.x)
    }

    fixedY(): number {
        return this.fixY(this.y)
    }

    rotateClockwise() {
        this.tick = 0

        switch (this.direction) {
            case Direction.UP:
                this.direction = Direction.RIGHT
                break
            case Direction.LEFT:
                this.direction = Direction.UP
                break
            case Direction.RIGHT:
                this.direction = Direction.DOWN
                break
            case Direction.DOWN:
                this.direction = Direction.LEFT
                break;
        }
    }
}

export default Entity