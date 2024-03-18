type Img = HTMLImageElement

export default class ImgRepo {
    pacmanImgs: Img[] = Array(4)
    ghostImgs: Img[] = Array(4)
    liveImgs: Img[] = Array(3)
    pacmanClosedImg: Img
    eyesImg: Img
    scaredImg: Img
    scared2Img: Img

    constructor(document: Document){
        this.pacmanClosedImg = document.getElementById("pacman_closed") as Img
        this.eyesImg = document.getElementById("eyes") as Img
        this.scaredImg = document.getElementById("scared") as Img
        this.scared2Img = document.getElementById("scared2") as Img

        for (let i=0; i<this.pacmanImgs.length; i++) this.pacmanImgs[i] = document.getElementById(`pacman${i}`) as Img
        for (let i=0; i<this.ghostImgs.length; i++) this.ghostImgs[i] = document.getElementById(`ghost${i}`) as Img
        for (let i=0; i<this.liveImgs.length; i++) this.liveImgs[i] = document.getElementById(`live${i+1}`) as Img
    }
}