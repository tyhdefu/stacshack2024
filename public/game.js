"use strict"

class Monster {
    constructor(id, name, types, max_hp, moves) {
        this.id = id
        this.name = name
        this.types = types
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

async function loadMonsterData() {
    const response = await fetch("/monsters")
    return response.json()
}

async function loadMoveData() {
    const moves = await fetch("./moves")
    return moves.json()
}

function createMonster(id, monsters, moves) {
    const monster = data.pokemon[id];
    return Monster(monster[0], monster[1], monster[2], 30, monster[3])
}

function createMove(id, moves) {
    for
}

loadMonsterData().then((res) => {
    console.log(res)
})
loadMoveData().then((res) => console.log(res))