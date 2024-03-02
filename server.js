const express = require('express');
const fs = require('fs');

const monstersFileData = fs.readFileSync("pokemon.json");
const monstersJSON = JSON.parse(monstersFileData);

const app = express();
app.use(express.json())
app.use(express.static('public'))

app.get("/monsters", (req, res) => res.json(monstersJSON))

app.listen(8000, () => {
    console.log("Listening for requests.")
})