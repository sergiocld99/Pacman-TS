export default class SFX {
    siren: HTMLAudioElement | null
    sirenIntervalId: number | null
    vulnerableIntervalId: number | null
    ghostsVulnerable: boolean
    sirenEnabled: boolean

    constructor(){
        this.siren = null
        this.sirenIntervalId = null
        this.vulnerableIntervalId = null
        this.ghostsVulnerable = false
        this.sirenEnabled = true
    }

    startGhostSiren() {
        this.playGhostSiren()
        if (this.sirenIntervalId) clearInterval(this.sirenIntervalId)
        this.sirenIntervalId = window.setInterval(() => {
            this.playGhostSiren()
        }, 2760)
    }

    startScareSiren(duration: number){
        if (!this.ghostsVulnerable){
            this.ghostsVulnerable = true
            this.stopSiren()
            this.playScareSiren()
            this.sirenIntervalId = window.setInterval(() => {
                this.playScareSiren()
            }, 3190)
        } 

        // duration
        if (this.vulnerableIntervalId) clearInterval(this.vulnerableIntervalId)
        this.vulnerableIntervalId = window.setTimeout(() => {
            this.stopSiren()
            this.ghostsVulnerable = false
            this.startGhostSiren()
        }, duration)
    }

    playGhostSiren() {
        if (this.sirenEnabled){
            this.siren = new Audio("sounds/ghosts.mp3")
            this.siren.play()
        }
    }

    playScareSiren(){
        this.siren = new Audio("sounds/scared_x6.mp3")
        this.siren.play()
    }

    stopSiren(){
        if (this.sirenIntervalId) clearInterval(this.sirenIntervalId)
        this.siren?.pause()
    }

    playLose(){
        let sound = new Audio("sounds/lose.mp3")
        sound.volume = 0.3
        sound.play()
    }

    playStarting(){
        new Audio("sounds/start.mp3").play()
    }

    playEatFood(num: number){
        new Audio(`sounds/food${num}.mp3`).play()
    }

    playEatGhost(){
        new Audio("sounds/eat_ghost.mp3").play()
    }
}