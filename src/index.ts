// import
import Board from "./board.js"
import CellType from "./cellType.js"
import Direction from "./direction.js"
import Ghost from "./ghost.js"
import GhostStatus from "./ghostStatus.js"
import ImgRepo from "./imgRepo.js"
import Match from "./match.js"
import Pacman from "./pacman.js"

// alias
type Img = HTMLImageElement

// from html
const canvas = document.querySelector('canvas')!
const canvasCtx = canvas?.getContext("2d")
const levelTxt = document.getElementById("level_txt") as HTMLParagraphElement
const scoreTxt = document.getElementById("score_txt") as HTMLParagraphElement

// objects
const imgRepo = new ImgRepo(document)
const match = new Match(2, 1, 2000)
const board = new Board(28, 31, 20, 20/6, 0.25)
const pacman = new Pacman(board, match)
const ghosts: Ghost[] = Array(4)

for (let i=0; i<ghosts.length; i++) ghosts[i] = new Ghost(i%4, board, pacman)

// game
const setup = () => {
    resetGame()

    document.addEventListener("keydown", e => {
        if (!match.isPlaying()) return

        // keyboard configuration
        if ((e.key === 'w' || e.key === 'ArrowUp') && pacman.direction != Direction.UP) pacman.moveUp()
        else if ((e.key === 's' || e.key === 'ArrowDown') && pacman.direction != Direction.DOWN) pacman.moveDown()
        else if ((e.key === 'a' || e.key === 'ArrowLeft') && pacman.direction != Direction.LEFT) pacman.moveLeft()
        else if ((e.key === 'd' || e.key === 'ArrowRight') && pacman.direction != Direction.RIGHT) pacman.moveRight()
    })
}

const resetGame = () => {
    board.build()
    match.start()
}

const loop = () => {
    // clear screen and draw board
    if (canvasCtx){
        canvasCtx.clearRect(0,0,canvas.width, canvas.height)
        board.draw(canvasCtx)
        pacman.draw(canvasCtx, imgRepo)

        if (!match.isLosing()){
            ghosts.forEach(g => g.draw(canvasCtx, 100, imgRepo))
        }
    }

    if (match.isPlaying()){
        ghosts.forEach(g => {
            g.moveIfTicks(3)

            if (g.checkPacmanCollision()){
                switch (g.status){
                    case GhostStatus.Normal:
                        // ghost kills pacman
                        match.loseLive()
                        pacman.lose()
                        ghosts.forEach(g => g.reset())
                        break
                    case GhostStatus.Vulnerable:
                        break
                    case GhostStatus.Eaten:
                        break
                }
            }
        })
        
        pacman.moveAuto()
    } else {

    }

    // imgs visibility
    imgRepo.liveImgs.forEach((img, i) => {
        img.style.visibility = match.lives > i ? 'visible' : 'hidden'
    })

    levelTxt.innerText = "Level " + match.level
    scoreTxt.innerText = "Score: " + match.score
}

setTimeout(() => {
    setup()
    setInterval(loop, 20)
}, 600)