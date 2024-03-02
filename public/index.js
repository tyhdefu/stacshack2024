"use strict"

let player1;
let player2;

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

        // Update Monster image source
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
        while (indexes.length < 4) {
            const randomIndex = Math.floor(Math.random() * (monsterData.monsters.length - 1)) + 1;
            if (!indexes.includes(randomIndex)) {
                indexes.push(randomIndex);
            }
        }
        return indexes;
    }

    function createButtons(containerId, buttonCount, monsterIdArray, monsterData) {
        const monsterArray = new Array(16);
        const container = document.getElementById(containerId);
        container.style.textAlign = "center";
        for (let i = 0; i < buttonCount; i++) {
            const button = document.createElement("button");
            button.className = "sprite-button";
            const image = document.createElement("img");

            const monster = createMonster(monsterIdArray[i], monsterData, moveData);
            monsterArray[i] = monster;

            image.src = monster.sprite_path
            image.alt = "Button Image";
            image.classList.add("extra-monster-image")

            button.appendChild(image);
            button.addEventListener("click", () => setDeployedMonster(monster, parseInt(containerId.slice(-1))));
            container.appendChild(button);
        }

        return monsterArray;
    }

    const randomIndexes = generateRandomIndexes();
    const randomIndexes2 = generateRandomIndexes();
    player1 = new Player(createButtons("sprites1", 4, randomIndexes, monsterData));
    player2 = new Player(createButtons("sprites2", 4, randomIndexes2, monsterData));
    // Use last element of indexes for the current monster.
    setDeployedMonster(createMonster(randomIndexes[0], monsterData, moveData), 1);
    setDeployedMonster(createMonster(randomIndexes2[0], monsterData, moveData), 2);
}

let PLAYER_1_MONSTER = null;
let PLAYER_2_MONSTER = null;

function setDeployedMonster(monster, player) {
    console.log("PLAYER", player, "deployed", monster);
    let image = document.getElementById("monster-image" + player);
    let moves = document.getElementById("move-buttons" + player);
    if (player === 1) {
        PLAYER_1_MONSTER = monster;
        updateMonsterHp(PLAYER_1_MONSTER, 1);
    }
    else if (player === 2) {
        PLAYER_2_MONSTER = monster;
        updateMonsterHp(PLAYER_2_MONSTER, 2);
    }
    image.src = monster.sprite_path;
    const moveButtons = moves.querySelectorAll(".move-button");
    for (let i = 0; i < monster.moves.length; i++) {
        moveButtons.item(i).innerText = monster.moves[i].name
    }
}

let TURN_COUNTER = 0;

function pickMove(moveElement, player) {
    if (TURN_COUNTER % 2 !== (player - 1)) {
        console.error("Not player " + player + "'s turn!");
        return;
    }
    let move_id = moveElement.dataset.num
    let monster;
    let target;
    if (player === 1) {
        monster = PLAYER_1_MONSTER;
        target = PLAYER_2_MONSTER;
    }
    else {
        monster = PLAYER_2_MONSTER;
        target = PLAYER_1_MONSTER;
    }
    if (monster == null) {
        console.error("You must select a monster first!");
        return;
    }
    const move = monster.moves[move_id];
    fight(monster, move, target);
    runAttackAnimation(player, monster, move, target);
    TURN_COUNTER += 1;
}

function getRandomMonster(monsterData, moveData) {
    const randomIndex = Math.floor(Math.random() * monsterData.monsters.length);
    return createMonster(randomIndex + 1, monsterData, moveData);
}


document.addEventListener("DOMContentLoaded", function () {
    run();
});

class Player {
    constructor(monsters) {
        this.total = 100.00;
        this.monsters = monsters;
    }
}

class Monster {
    constructor(id, name, types, sprite_path, max_hp, moves, value) {
        this.id = id;
        this.name = name;
        this.sprite_path = sprite_path;
        this.types = types;
        this.typesNum = getNumberFromTypes(types);
        this.max_hp = max_hp;
        this.hp = max_hp;
        this.moves = moves;
        this.value = value;
    }

    isType(type) {
        return isTypeFromNum(TYPES_TO_BINARY[type], this.typesNum)
    }
}

class Move {
    constructor(id, name, types) {
        this.id = id;
        this.name = name;
        this.types = types;
        this.typesNum = getNumberFromTypes(types);
    }

    isType(type) {
        return isTypeFromNum(TYPES_TO_BINARY[type], this.typesNum)
    }
}
const TYPES_TO_BINARY = {
    "basic":     0b10000000,
    "fire":      0b01000000,
    "water":     0b00100000,
    "grass":     0b00010000,
    "rock":      0b00001000,
    "flying":    0b00000100,
    "fighting":  0b00000010,
    "legendary": 0b00000001,
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
    return new Monster(monster[0], monster[1], monster[2], monster[3], 30, monster_moves, monster[5]);
}

function createMove(id, moves) {
    for (const move of moves.moves) {
        if (move.id === id) {
            return new Move(move.id, move.name, move.types)
        }
    }
    throw new Error("No such move: " + id);
}

function fight(attacker, move, target) {
    console.log(attacker, "uses ", move, " against ", target);

    let dmg = 0;
    for (const type in TYPES_TO_BINARY) {
        let attack_result = calcDmgResult(attacker.isType(type), move.isType(type), target.isType(type));
        console.log(type, ": ", attack_result, "dmg");
        dmg += attack_result;
    }
    console.log("Target took ", dmg, "dmg");
    target.hp -= dmg;
    updateMonsterHp(PLAYER_1_MONSTER, 1);
    updateMonsterHp(PLAYER_2_MONSTER, 2);
}

function calcDmgResult(attackerHasStat, moveHasStat, defenderHasStat) {
    const BASE_DMG = 4;

    let attack_result = 0;

    if (moveHasStat) {
        attack_result = BASE_DMG;
        if (attackerHasStat) {
            attack_result *= 2;
        }
        if (defenderHasStat) {
            attack_result = Math.round(attack_result / 3);
        }
    }
    return attack_result;
}

function runAttackAnimation(player, attacker, move, defender) {
    console.log("PLAYER: ", player);
    const attackTableContainer = document.getElementById("player" + player + "Attack");

    const table = document.createElement("table");
    const attackerHeader = document.createElement("th");
    attackerHeader.innerText = "Attacker";
    const moveHeader = document.createElement("th");
    moveHeader.innerText = "Move";
    const defenderHeader = document.createElement("th");
    defenderHeader.innerText = "Defender";

    const headerRow = document.createElement("tr");
    headerRow.append(attackerHeader, moveHeader, defenderHeader);
    table.append(headerRow);

    for (let i = 0; i < 8; i++) {
        const mask = 1 << i;

        function createStatNode(hasStat) {
            const td = document.createElement("td");
            if (hasStat) {
                td.innerText = "1";
                td.style.color = "green";
            }
            else {
                td.innerText = "0";
            }
            return td;
        }

        const row = document.createElement("tr");

        const attackerHasStat = isTypeFromNum(attacker.typesNum, mask);
        const moveHasStat = isTypeFromNum(move.typesNum, mask);
        const defenderHasStat = isTypeFromNum(defender.typesNum, mask);

        const dmgResult = calcDmgResult(attackerHasStat, moveHasStat, defenderHasStat);

        const attackerNode = createStatNode(attackerHasStat);
        attackerNode.classList.add("attacker-value");
        const moveNode = createStatNode(moveHasStat);
        moveNode.classList.add("move-value");
        const defenderNode = createStatNode(defenderHasStat);
        defenderNode.classList.add("defender-value");
        defenderNode.dataset["result"] = "" + dmgResult;
        row.append(attackerNode, moveNode, defenderNode);
        table.append(row);
    }

    attackTableContainer.append(table);
    attackTableContainer.style.display = "block";

    const UPDATE_TO_RESULT_TIMEOUT = 2000;
    const HIDE_TABLE_TIMEOUT = 3500;

    setTimeout(() => {
        // Set all defender-value fields to the result
        attackTableContainer.querySelectorAll(".move-value").forEach(mf => {
            mf.innerHTML = "";
        })
        attackTableContainer.querySelectorAll(".defender-value").forEach(df => {
            const dmg = df.dataset["result"];
            df.innerHTML = -parseInt(dmg) + "";
            if (dmg > 4) {
                df.style.color = "red";
            }
            else if (dmg > 3) {
                df.style.color = "orange";
            }
            else if (dmg > 0) {
                df.style.color = "gold";
            }
            else {
                df.style.color = "";
            }
        })
    }, UPDATE_TO_RESULT_TIMEOUT);

    setTimeout(() => {
        attackTableContainer.querySelectorAll("table").forEach(c => c.remove());
        attackTableContainer.style.visibility = "none";
    }, HIDE_TABLE_TIMEOUT);

}

let deadMonster;

function updateMonsterHp(monster, player) {
    const monsterHP = document.querySelector("#monster" + player).querySelector(".current-hp");

    const monsterHPPct = (monster.hp / monster.max_hp) * 100;

    if (monsterHPPct <= 0) {
        monsterHP.style.width = "0%";

        deadMonster = monster;
        die(player);
    }

    monsterHP.style.width = monsterHPPct + "%";
}

let losingPlayer = 0;
let winningPlayer = 0;

function die(player) {
    losingPlayer = player;
    if (losingPlayer == 1) {
        winningPlayer = 2;
    }
    else {
        winningPlayer = 1;
    }

    window.onload = openPopup(player);
}

function openPopup(player) {
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('overlay');
    const text = document.getElementById("text");

    popup.style.display = 'block';
    overlay.style.display = 'block';
    text.innerHTML = "Player " + player;
}

function openPopupForSale() {
    const popupSale = document.getElementById('popupSale');
    const overlaySale = document.getElementById('overlaySale');
    const textSale = document.getElementById("textSale");

    popupSale.style.display = 'block';
    overlaySale.style.display = 'block';
    textSale.innerHTML = "Does Player " + winningPlayer + " accept the sale?";
}

function closePopup() {
    popup.style.display = 'none';
    overlay.style.display = 'none';
}

function closePopupForSale() {
    popupSale.style.display = 'none';
    overlaySale.style.display = 'none';
}

const buyButton = document.getElementById('buy');
buyButton.addEventListener('click', buyNewMonster);

const sellButton = document.getElementById('sell');
sellButton.addEventListener('click', exchangeMonster);

const yesButton = document.getElementById('yes');
yesButton.addEventListener('click', exchangeMonsterYes);

const noButton = document.getElementById('no');
noButton.addEventListener('click', exchangeMonsterNo);

function buyNewMonster() {
    const monsterValue = 15;

    if (losingPlayer == 1) {
        player1.total -= monsterValue; //Need to allow user to search list of monsters
        //Add monster to assets
    }
    else {
        player2.total -= monsterValue //Need to allow user to search list of monsters
        //Add monster to assets
    }

    closePopup();
    closePopupForSale();
}

function exchangeMonster() {
    openPopupForSale();
}

function exchangeMonsterYes() {
    if (losingPlayer == 1) {
        player1.total += 0.5 * deadMonster.value;

        for (let i = 0; i < player1.monsters.length; i++) {
            if (deadMonster == player1.monsters[i]) {
                player2.monsters[player2.monsters.length + 1] = deadMonster;
            }
        }
    }
    else {
        player2.total += 0.5 * deadMonster.value;

        for (let i = 0; i < player2.monsters.length; i++) {
            if (deadMonster == player2.monsters[i]) {
                player1.monsters[player1.monsters.length + 1] = deadMonster;
            }
        }
    }

    closePopup();
    closePopupForSale();
}

function exchangeMonsterNo() {
    buyNewMonster();
}