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
