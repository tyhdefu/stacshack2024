function getPokemon(number) {
    const data = require('../pokemon.json');

    for (var i = 0; i < 151; i++) {
        if (data["pokemon"][i][0] == number) {
            document.getElementById("pokemon-image1").innerHTML(<img src="data['pokemon'][i][3]"></img>)
        }
    }
}