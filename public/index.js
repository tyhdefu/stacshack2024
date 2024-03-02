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

    function deployMonster(number, whichPlayer) {
        const selectedMonster = createMonster(number, monsterData, moveData);
        setDeployedMonster(selectedMonster, whichPlayer);
    }

    // document.getElementById("sprites-button1").addEventListener("click", function () {
    //     // Call setDeployedMonster with parameters 4 and 1
    //     // createMonster(4, monsterData, moveData)
    //     deployMonster(1, 1);
    // });

    const moveButtons1 = document.getElementById("move-buttons1");
    const moveButtons2 = document.getElementById("move-buttons2");

    moveButtons1.querySelectorAll(".move-button").forEach(b => {
        b.addEventListener("click", () => pickMove(b, 1));
    })

    moveButtons2.querySelectorAll(".move-button").forEach(b => {
        b.addEventListener("click", () => pickMove(b, 2));
    })

    function generateRandomIndexes() {
        const indexes = [];
        while (indexes.length < 3) {
            const randomIndex = Math.floor(Math.random() * monsterData.monsters.length - 1) + 1;
            if (!indexes.includes(randomIndex)) {
                indexes.push(randomIndex);
            }
        }
        return indexes;
    }

    function createButtons(containerId, buttonCount, imageIndexArray, monsterData) {
        const container = document.getElementById(containerId);
    
        for (let i = 0; i < buttonCount; i++) {
            const button = document.createElement("button");
            button.className = "sprite-button";
            const image = document.createElement("img");
    
            // Ensure that imageIndexArray[i] is within the valid range
            if (imageIndexArray[i] >= 0 && imageIndexArray[i] < monsterData.monsters.length) {
                image.src = monsterData.monsters[imageIndexArray[i]][3];
            } else {
                console.error("Invalid index in imageIndexArray:", imageIndexArray[i]);
                continue; // Skip this iteration if the index is invalid
            }
    
            image.alt = "Button Image";
            button.appendChild(image);
            button.addEventListener("click", () => deployMonster(imageIndexArray[i] + 1, parseInt(containerId.slice(-1))));
            container.appendChild(button);
        }
    }

    const randomIndexes = generateRandomIndexes();
    const randomIndexes2 = generateRandomIndexes();
    createButtons("sprites1", 3, randomIndexes, monsterData);
    createButtons("sprites2", 3, randomIndexes2, monsterData);
}

let PLAYER_1_MONSTER = null;
let PLAYER_2_MONSTER = null;

function setDeployedMonster(monster, player) {
    console.log("PLAYER", player, "deployed", monster);
    let image = document.getElementById("monster-image" + player);
    let moves = document.getElementById("move-buttons" + player);
    if (player === 1) {
        PLAYER_1_MONSTER = monster;
        PLAYER_1_SELECTED_MOVE = null;
    }
    else if (player === 2) {
        PLAYER_2_MONSTER = monster;
        PLAYER_2_SELECTED_MOVE = null;
    }
    image.src = monster.sprite_path;
    const moveButtons = moves.querySelectorAll(".move-button");
    for (let i = 0; i < monster.moves.length; i++) {
        moveButtons.item(i).innerText = monster.moves[i].name
    }
}

let PLAYER_1_SELECTED_MOVE = null;
let PLAYER_2_SELECTED_MOVE = null;

function pickMove(moveElement, player) {
    let move_id = moveElement.dataset.num
    let monster;
    if (player === 1) {
        monster = PLAYER_1_MONSTER;
    }
    else {
        monster = PLAYER_2_MONSTER;
    }
    if (monster == null) {
        console.error("No monster selected!");
        return;
    }
    deselectMove(player);
    moveElement.classList.add("selected-move");
    if (player === 1) {
        PLAYER_1_SELECTED_MOVE = monster.moves[move_id];
    }
    else {
        PLAYER_2_SELECTED_MOVE = monster.moves[move_id];
    }

    if (PLAYER_1_SELECTED_MOVE !== null && PLAYER_2_SELECTED_MOVE !== null) {
        console.log("Both players selected a move, fighting:");
        fight(PLAYER_1_MONSTER, PLAYER_1_SELECTED_MOVE, PLAYER_2_MONSTER, PLAYER_2_SELECTED_MOVE);
        deselectMove(1);
        deselectMove(2);
    }
}

function deselectMove(player) {
    let moveButtons = document.getElementById("move-buttons" + player);
    moveButtons.querySelectorAll(".selected-move").forEach(m => {
        m.classList.remove("selected-move");
    });
    if (player === 1) {
        PLAYER_1_SELECTED_MOVE = null;
    }
    else {
        PLAYER_2_SELECTED_MOVE = null;
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
        this.typesNum = getNumberFromTypes(types);
    }

    isType(type) {
        return isTypeFromNum(TYPES_TO_BINARY[type], this.typesNum)
    }
}

function isTypeFromNum(num, typeNum) {
    return (typeNum & num) !== 0;
}

function getNumberFromTypes(types) {
    let number = 0;
    for (const type of types) {
        number |= TYPES_TO_BINARY[type]
    }
    return number;
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

function fight(monster1, move1, monster2, move2) {
    console.log(monster1, "uses ", move1, ", ", monster2, "uses", move2);

    let p1_dmg = 0;
    let p2_dmg = 0;
    for (const type in TYPES_TO_BINARY) {
        let attack_result = 0;

        if (move1.isType(type)) {
            attack_result++;
        }
        if (move2.isType(type)) {
            attack_result--;
        }

        // Add bonuses / defends, but don't begin an attack on a given type.
        if (attack_result !== 0) {
            if (monster1.isType(type)) {
                attack_result++;
            }
            if (monster2.isType(type)) {
                attack_result--;
            }
        }
        console.log(type, ": ", attack_result);
        if (attack_result > 0) {
            p1_dmg += attack_result;
        }
        if (attack_result < 0) {
            p2_dmg += -attack_result;
        }
    }
    monster1.hp -= p1_dmg;
    monster2.hp -= p2_dmg;
    console.log("P1 took ", p1_dmg, "dmg");
    console.log("P2 took ", p2_dmg, "dmg");
}
