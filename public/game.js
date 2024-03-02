"use strict"

class Monster {
    constructor(id, name, types, sprite_path, max_hp, moves) {
        this.id = id;
        this.name = name;
        this.sprite_path = sprite_path;
        this.types = types;
        this.max_hp = max_hp;
        this.hp = max_hp;
        this.moves = moves;
    }
}

class Move {
    constructor(id, types) {
        this.id = id;
        this.types = types;
    }
}

async function loadMonsterData() {
    const response = await fetch("/monsters");
    return response.json();
}

async function loadMoveData() {
    const moves = await fetch("./moves");
    return moves.json();
}

function createMonster(id, all_monsters, all_moves) {
    const monster = all_monsters.pokemon[id];
    const monster_moves = monster[4].map(m => createMove(m.toLowerCase(), all_moves));
    return new Monster(monster[0], monster[1], monster[2], monster[3], 30, monster_moves);
}

function createMove(id, moves) {
    for (const move of moves.moves) {
        if (move.id === id) {
            return new Move(move.id, move.types)
        }
    }
}

loadMonsterData().then((monsterData) => {
    console.log(monsterData);
    loadMoveData().then((moveData) => {
        console.log(moveData);
        console.log(createMonster(1, monsterData, moveData));
    })
})