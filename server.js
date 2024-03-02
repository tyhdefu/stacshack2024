const express = require('express');
const fs = require('fs');

const monstersFileData = fs.readFileSync("pokemon.json");
const monstersJSON = JSON.parse(monstersFileData);

const movesFileData = fs.readFileSync("moves.json");
const movesJSON = JSON.parse(movesFileData);


const app = express();
app.use(express.json())
app.use(express.static('public'))

app.get("/monsters", (req, res) => res.json(monstersJSON))
app.get("/moves", (req, res) => res.json(movesJSON))

app.listen(8000, () => {
    console.log("Listening for requests.")
})