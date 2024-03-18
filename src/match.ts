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
    status: MatchStatus
    score: number
    siren: HTMLAudioElement | null
    sirenIntervalId: number | null

    constructor(maxLives: number, initialLevel: number, levelCompletedDelay: number) {
        this.maxLives = maxLives
        this.initialLevel = initialLevel
        this.levelCompletedAnimationDuration = levelCompletedDelay
        this.level = this.initialLevel
        this.lives = this.maxLives
        this.status = MatchStatus.Starting
        this.score = 2440 * (this.level - 1)
        this.siren = null
        this.sirenIntervalId = null
    }

    start () {
        this.status = MatchStatus.Starting
        new Audio("sounds/start.mp3").play()

        setTimeout(() => {
            this.status = MatchStatus.Playing
            this.startGhostSiren()
        }, 4000)
    }

    startGhostSiren () {
        this.playGhostSiren()
        if (this.sirenIntervalId) clearInterval(this.sirenIntervalId)
        this.sirenIntervalId = window.setInterval(() => this.playGhostSiren(), 2760)
    }

    playGhostSiren () {
        if (this.isPlaying()){
            this.siren = new Audio("sounds/ghosts.mp3")
            this.siren.play()
        }
    }

    isPlaying () : boolean {
        return this.status === MatchStatus.Playing
    }
}