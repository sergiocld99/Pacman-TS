// import
import Board from "./board.js"
import Ghost from "./ghost.js"
import Match from "./match.js"
import Pacman from "./pacman.js"

// alias
type Img = HTMLImageElement

// from html
const canvas = document.querySelector('canvas')!
const canvasCtx = canvas?.getContext("2d")

const pacmanImgs: Img[] = Array(4)
const ghostImgs: Img[] = Array(4)
const liveImgs: Img[] = Array(3)

for (let i=0; i<pacmanImgs.length; i++) pacmanImgs[i] = document.getElementById(`pacman${i}`) as Img
for (let i=0; i<ghostImgs.length; i++) ghostImgs[i] = document.getElementById(`ghost${i}`) as Img
for (let i=0; i<liveImgs.length; i++) liveImgs[i] = document.getElementById(`live${i+1}`) as Img

const pacmanClosedImg = document.getElementById("pacman_closed") as Img
const eyesImg = document.getElementById("eyes") as Img
const scaredImg = document.getElementById("scared") as Img
const scared2Img = document.getElementById("scared2") as Img

const levelTxt = document.getElementById("level_txt") as HTMLParagraphElement
const scoreTxt = document.getElementById("score_txt") as HTMLParagraphElement

// objects
const match = new Match(2, 1, 2000)
const board = new Board(28, 31, 20, 20/6, 0.25)
const pacman = new Pacman()
const ghosts: Ghost[] = Array(4)

for (let i=0; i<ghosts.length; i++) ghosts[i] = new Ghost(i%ghostImgs.length, board, pacman)

// game
const setup = () => {
    resetGame()

    document.addEventListener("keydown", e => {
        if (!match.isPlaying()) return

        // keyboard configuration
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
        ghosts.forEach((g, i) => g.draw(canvasCtx, 100, ghostImgs[i], board.cellSize))
    }

    if (match.isPlaying()){
        ghosts.forEach(g => {
            g.moveIfTicks(2)
            // console.log(g.x, g.y)
        })
    } else {

    }

    // imgs visibility
    liveImgs.forEach((img, i) => {
        
    })

    levelTxt.innerText = "Level " + match.level
    scoreTxt.innerText = "Score: " + match.score
}

setTimeout(() => {
    setup()
    setInterval(loop, 20)
}, 600)