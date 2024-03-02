"use strict"

async function loadMonsterData() {
    const response = await fetch("/monsters")
    return response.json()
}

async function loadMoveData() {
    const moves = await fetch("./moves")
    return moves.json()
}

loadMonsterData().then((res) => console.log(res))
loadMoveData().then((res) => console.log(res))