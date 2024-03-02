document.addEventListener("DOMContentLoaded", function () {
    // Your Pokemon JSON data
    const pokemonData = {
        "pokemon": [
            [1, "Bulbasaur", "Grass", "gen1/1.png"],
            [2, "Ivysaur", "Grass", "gen1/2.png"],
            [3, "Venusaur", "Grass", "gen1/3.png"],
            [4, "Charmander", "Fire", "gen1/4.png"],
            [5, "Charmeleon", "Fire", "gen1/5.png"],
            [6, "Charizard", "Fire", "gen1/6.png"],
            [7, "Squirtle", "Water", "gen1/7.png"],
            [8, "Wartortle", "Water", "gen1/8.png"],
            [9, "Blastoise", "Water", "gen1/9.png"],
            [10, "Caterpie", "Bug", "gen1/10.png"],
        ]
    };

    // Get DOM elements
    const middleButton = document.getElementById("middle-button");
    const pokemonImage1 = document.getElementById("pokemon-image1");
    const pokemonImage2 = document.getElementById("pokemon-image2");


    // Function to get a random Pokemon from the JSON
    function getRandomPokemon() {
        const randomIndex = Math.floor(Math.random() * pokemonData.pokemon.length);
        return pokemonData.pokemon[randomIndex];
    }

    // Event listener for the middle button
    middleButton.addEventListener("click", function () {
        const randomPokemon1 = getRandomPokemon();
        const randomPokemon2 = getRandomPokemon();

        // Update Pokemon image source
        pokemonImage1.src = randomPokemon1[3];
        pokemonImage2.src = randomPokemon2[3];
    });
});
