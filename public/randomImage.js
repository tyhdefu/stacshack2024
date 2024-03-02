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
            const randomIndex = Math.floor(Math.random() * 5);
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
    })
});
