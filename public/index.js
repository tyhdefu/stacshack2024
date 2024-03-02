"use strict"

document.addEventListener("DOMContentLoaded", function () {
    // Your Pokemon JSON data
    fetch("/monsters")
        .then((res) => res.json())
        .then((pokemonData) => {
            // Get DOM elements
            const middleButton = document.getElementById("middle-button");
            const pokemonImage1 = document.getElementById("pokemon-image1");
            const pokemonImage2 = document.getElementById("pokemon-image2");


            // Function to get a random Pokemon from the JSON
            function getRandomPokemon() {
                const randomIndex = Math.floor(Math.random() * pokemonData.pokemon.length);
                return pokemonData.pokemon[randomIndex];
            }

            function selectRandomPokemon(){
                const randomPokemon1 = getRandomPokemon();
                const randomPokemon2 = getRandomPokemon();

                // Update Pokemon image source
                pokemonImage1.src = randomPokemon1[3];
                pokemonImage2.src = randomPokemon2[3];
            }

            function pickPockeMon(id1, id2){
                pokemonImage1.src = "gen1/" + id1 +".png";
                pokemonImage2.src = "gen1/" + id2 +".png";
            }
            // Event listener for the middle button
            middleButton.addEventListener("click", function () {
                selectRandomPokemon()
                // pickPockeMon(1, 2)
            });
        })
});

fetch('/monsters').then(data => data.json()).then((data) => {
    console.log(data);

    const selectButton1 = document.getElementById("select-button1");
    const selectButton2 = document.getElementById("select-button2");
    const pokemonImage1 = document.getElementById("pokemon-image1");
    const pokemonImage2 = document.getElementById("pokemon-image2");

    selectButton1.addEventListener("click", () => getPokemon(3, 1));
    selectButton2.addEventListener("click", () => getPokemon(4, 2));

    function getPokemon(number, whichImage) {
        for (let i = 0; i < data.pokemon.length; i++) {
            if (data["pokemon"][i][0] == number) {
                if (whichImage == 1) {
                    pokemonImage1.src = data["pokemon"][i][3];
                }
                else {
                    pokemonImage2.src = data["pokemon"][i][3];
                }
            }
        }
    }
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