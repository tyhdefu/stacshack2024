"use strict"

class Monster {
    constructor(id, type, max_hp, moves) {
        this.id = id
        this.type = type
        this.max_hp = max_hp
        this.hp = max_hp
        this.moves = moves
    }
}

class Move {
    constructor(id, type) {
        this.id = id
        this.type = type
    }
}
