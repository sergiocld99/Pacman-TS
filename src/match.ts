import SFX from "./sfx.js"

const enum MatchStatus { 
    Starting, 
    Playing, 
    LevelCompleted,
    EatingGhost,
    Losing
}

export default class Match {
    maxLives: number
    initialLevel: number
    levelCompletedAnimationDuration: number
    level: number
    lives: number
    ghostsEaten: number
    status: MatchStatus
    sfx: SFX
    score: number
    

    constructor(maxLives: number, initialLevel: number, levelCompletedDelay: number) {
        this.maxLives = maxLives
        this.initialLevel = initialLevel
        this.levelCompletedAnimationDuration = levelCompletedDelay
        this.level = this.initialLevel
        this.lives = this.maxLives
        this.ghostsEaten = 0
        this.status = MatchStatus.Starting
        this.sfx = new SFX()
        this.score = 2440 * (this.level - 1)
    }

    start () {
        this.status = MatchStatus.Starting
        this.sfx.playStarting()

        setTimeout(() => {
            this.status = MatchStatus.Playing
            this.sfx.sirenEnabled = true
            this.sfx.startGhostSiren()
        }, 4000)
    }

    isPlaying () : boolean {
        return this.status === MatchStatus.Playing
    }

    isLosing() : boolean {
        return this.status === MatchStatus.Losing
    }

    loseLive(animDuration: number) {
        this.status = MatchStatus.Losing
        this.sfx.sirenEnabled = false
        this.sfx.stopSiren()
        this.sfx.playLose()

        setTimeout(() => {
            this.lives--

            if (this.lives >= 0) {
                this.status = MatchStatus.Playing
                this.sfx.sirenEnabled = true
                this.sfx.startGhostSiren()
            }
        }, animDuration)
    }

    eatGhost(animDuration: number){
        this.ghostsEaten++
        this.addScore(Math.pow(2, this.ghostsEaten) * 100)
        this.status = MatchStatus.EatingGhost
        this.sfx.playEatGhost()

        setTimeout(() => {
            this.status = MatchStatus.Playing
        }, animDuration);
    }

    addScore(diff: number){
        let prev = this.score
        this.score += diff

        // extra life at 10K 
        if (this.score >= 10_000 && prev < 10_000)
            this.lives++
    }

    nextLevel(){
        this.status = MatchStatus.LevelCompleted
        this.sfx.sirenEnabled = false
        this.sfx.ghostsVulnerable = false
        this.sfx.stopSiren()
    }
}