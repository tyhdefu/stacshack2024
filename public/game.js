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
    constructor(id, types) {
        this.id = id
        this.types = types
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

function createMonster(id, all_monsters, all_moves) {
    const monster = all_monsters.pokemon[id];
    const monster_moves = monster[2].map(m => createMove(m, all_moves))
    return new Monster(monster[0], monster[1], monster_moves, 30, monster[3])
}

function createMove(id, moves) {
    for (const move of moves.moves) {
        if (move.id === id) {
            return new Move(move.id, move.types)
        }
    }
}

loadMonsterData().then((res) => {
    console.log(res)
})
loadMoveData().then((res) => console.log(res))