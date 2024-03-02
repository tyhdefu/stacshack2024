"use strict"

const monsterData = loadMonsterData()
//const moveData = await loadMoveData()

console.log(monsterData)

function createMonster(id) {

}

async function loadMonsterData() {
    const response = await fetch("/monsters")
    return response.json()
}

async function loadMoveData() {
    //const moves = await fetch("./moves.json")
    //return moves.json()
    return []
}