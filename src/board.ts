const enum CellType { 
    Wall, Space, Food, BigFood, GhostHouse
}

const Board = class {
    width: number
    height: number
    cellSize: number
    foodCount: number
    foodRadius: number
    delta: number
    wallColors: string[]
    matrix: CellType[][]

    constructor(width: number, height: number, cellSize: number, foodRadius: number, wallOffset: number) {
        this.width = width
        this.height = height
        this.cellSize = cellSize
        this.foodCount = 0
        this.foodRadius = foodRadius
        this.delta = wallOffset
        this.wallColors = ["blue", "purple", "orange"]
        this.matrix = []
    }

    build(){
        this.matrix = Array.from({length: this.height}, () => {
            return Array(this.width).fill(CellType.Wall)
        })

        this.placePaths()

        let count = 0
        this.matrix.forEach(row => {
            row.forEach(cell => {
                if (cell === CellType.Food || cell === CellType.BigFood) count++
            })
        })

        this.foodCount = count
    }

    placePaths(){
        this.placeRow(11,9,5)
        this.placeRow(14,0,9)
        this.placeRow(17,9,5)
        this.placeRow(23,13,1)
        this.placeColumn(9,11,9)
        this.placeColumn(12,8,4)

        this.placeFoodRow(1,1,12)
        this.placeFoodRow(5,1,13)
        this.placeFoodRow(8,1,6)
        this.placeFoodRow(8,9,4)
        this.placeFoodRow(20,1,12)
        this.placeFoodRow(23,1,3)
        this.placeFoodRow(23,6,7)
        this.placeFoodRow(26,1,6)
        this.placeFoodRow(26,9,4)
        this.placeFoodRow(29,1,13)

        this.placeFoodColumn(1,1,8)
        this.placeFoodColumn(6,1,26)
        this.placeFoodColumn(9,5,4)
        this.placeFoodColumn(12,1,5)
        this.placeFoodColumn(1,26,4)
        this.placeFoodColumn(3,23,4)
        this.placeFoodColumn(1,20,4)
        this.placeFoodColumn(12,20,4)
        this.placeFoodColumn(9,23,4)
        this.placeFoodColumn(12,26,4)

        // place big food
        this.placeItemMirrored(3,1,CellType.BigFood)
        this.placeItemMirrored(this.height-8,1,CellType.BigFood)

        // create ghost house (door and room)
        this.placeGhostHouse(12,13,2,1)
        this.placeGhostHouse(13,11,6,3)
    }

    placeRow(row: number, start: number, width: number){
        for (let i=0; i<width; i++) {
            this.placeItemMirrored(row, start+i, CellType.Space)
        }
    }

    placeColumn(col: number, start: number, height: number){
        for (let i=0; i<height; i++){
            this.placeItemMirrored(start+i, col, CellType.Space)
        }
    }

    placeItemMirrored(x: number, y: number, type: CellType){
        this.matrix[x][y] = type
        this.matrix[x][this.width-y-1] = type
    }

    placeFoodRow(row: number, start: number, count: number) {
        for (let i=0; i<count; i++){
            this.placeItemMirrored(row, start+i, CellType.Food)
        }
    }

    placeFoodColumn(col: number, start: number, count: number) {
        for (let i=0; i<count; i++){
            this.placeItemMirrored(start+i, col, CellType.Food)
        }
    }

    placeGhostHouse(x:number, y:number, w:number, h:number){
        for (let i=0; i<h; i++){
            for (let j=0; j<w; j++){
                this.matrix[x+i][y+j] = CellType.GhostHouse
            }
        }
    }

    // ---- DRAWING METHODS ----------------------

    draw(ctx: CanvasRenderingContext2D){
        this.matrix.forEach((row, y) => {
            row.forEach((cell, x) => {
                switch(cell){
                    case CellType.Wall:
                        this.drawLightWall(ctx, x, y)
                        break
                    case CellType.Space:
                        ctx.fillStyle = "black"
                        ctx.fillRect(x*this.cellSize, y*this.cellSize, this.cellSize, this.cellSize)
                        break
                    case CellType.Food:
                        this.drawCircle(ctx, x,y,this.foodRadius)
                        break
                    case CellType.BigFood:
                        this.drawCircle(ctx,x,y,this.foodRadius*2)
                        break
                    case CellType.GhostHouse:
                        ctx.fillStyle = "#110"
                        ctx.fillRect(x*this.cellSize, y*this.cellSize, this.cellSize, this.cellSize)
                        break
                }
            })
        })
    }

    drawLightWall(context: CanvasRenderingContext2D, x: number, y: number){
        context.strokeStyle = this.wallColors[0]

        const wallType = CellType.Wall
        const wall_above = y == 0 || this.matrix[y-1][x] == wallType
        const wall_below = y == this.height-1 || this.matrix[y+1][x] == wallType
        const wall_left = x == 0 || this.matrix[y][x-1] == wallType
        const wall_right = x == this.width-1 || this.matrix[y][x+1] == wallType

        const xa = x - this.delta
        const xb = x + this.delta
        const ya = y - this.delta
        const yb = y + this.delta

        if (!wall_left){
            const yu = wall_above ? y : yb
            const yd = wall_below ? y : ya
            context.beginPath()
            context.moveTo(xb*this.cellSize, yu*this.cellSize)
            context.lineTo(xb*this.cellSize, (yd+1)*this.cellSize)
            context.stroke()
        }

        if (!wall_right){
            const yu = wall_above ? y : yb
            const yd = wall_below ? y : ya
            context.beginPath()
            context.moveTo((xa+1)*this.cellSize, yu*this.cellSize)
            context.lineTo((xa+1)*this.cellSize, (yd+1)*this.cellSize)
            context.stroke()
        }
 
        if (!wall_above){
            const xl = wall_left ? x : xb
            const xd = wall_right ? x : xa
            context.beginPath()
            context.moveTo(xl*this.cellSize, yb*this.cellSize)
            context.lineTo((xd+1)*this.cellSize, yb*this.cellSize)
            context.stroke()
        }

        if (!wall_below){
            const xl = wall_left ? x : xb
            const xd = wall_right ? x : xa
            context.beginPath()
            context.moveTo(xl*this.cellSize, (ya+1)*this.cellSize)
            context.lineTo((xd+1)*this.cellSize, (ya+1)*this.cellSize)
            context.stroke()
        }
    }

    drawCircle(ctx: CanvasRenderingContext2D, x:number, y:number, rad:number){
        ctx.fillStyle = "white"
        ctx.beginPath()
        ctx.arc((x+0.5)*this.cellSize, (y+0.5)*this.cellSize, rad, 0, 2*Math.PI)
        ctx.fill()
    }
}

export default Board