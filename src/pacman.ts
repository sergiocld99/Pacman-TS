import Direction from "./direction.js";
import Entity from "./entity.js";

export default class Pacman extends Entity {

    constructor(){
        super([0,0,Direction.RIGHT])
    }
}