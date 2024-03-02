"use strict"

async function run() {
    const monsterData = await loadMonsterData();
    const moveData = await loadMoveData();
    console.log(monsterData);
    console.log(moveData);
    console.log(createMonster(1, monsterData, moveData));

    // Give both players random monsters.
    function deployRandomMonsters(){
        const randomMonster1 = getRandomMonster(monsterData, moveData);
        const randomMonster2 = getRandomMonster(monsterData, moveData);

        // Update Pokemon image source
        setDeployedMonster(randomMonster1, 1);
        setDeployedMonster(randomMonster2, 2);
    }

    const selectButton1 = document.getElementById("select-button1");
    const selectButton2 = document.getElementById("select-button2");

    selectButton1.addEventListener("click", () => deployMonster(3, 1));
    selectButton2.addEventListener("click", () => deployMonster(4, 2));

    function deployMonster(number, whichImage) {
        const selectedMonster = createMonster(number, monsterData, moveData);
        setDeployedMonster(selectedMonster, whichImage);
    }

}

let PLAYER_1_MONSTER = null;
let PLAYER_2_MONSTER = null;
function setDeployedMonster(monster, player) {
    console.log("PLAYER", player, "deployed", monster);
    let image = document.getElementById("monster-image" + player);
    let moves = document.getElementById("move-buttons" + player);
    if (player === 1) {
        PLAYER_1_MONSTER = monster;
    }
    else if (player === 2) {
        PLAYER_2_MONSTER = monster;
    }
    image.src = monster.sprite_path;
    const moveButtons = moves.querySelectorAll(".move-button");
    for (let i = 0; i < monster.moves.length; i++) {
        moveButtons.item(i).innerText = monster.moves[i].name
    }
}

function getRandomMonster(monsterData, moveData) {
    const randomIndex = Math.floor(Math.random() * monsterData.monsters.length);
    return createMonster(randomIndex + 1, monsterData, moveData);
}


document.addEventListener("DOMContentLoaded", function () {
    run();
});

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
        this.name = id;
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
    let monster = null;
    for (const m of all_monsters.monsters) {
        if (m[0] === id) {
            monster = m;
            break;
        }
    }
    if (monster == null) {
        throw new Error("No monster with id: " + id);
    }
    const monster_moves = monster[4].map(m => createMove(m.toLowerCase(), all_moves));
    return new Monster(monster[0], monster[1], monster[2], monster[3], 30, monster_moves);
}

function createMove(id, moves) {
    for (const move of moves.moves) {
        if (move.id === id) {
            return new Move(move.id, move.types)
        }
    }
    throw new Error("No such move: " + id);
}