const app = require('express')();
const http = require("http").Server(app);

const hostname = 'localhost';
const port = 3000;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/game', function(req, res){
    let data = getResult();
    res.json(data);
});

let winlines = game([["LOW_1", "SCATTER", "HIGH_1"],
    ["LOW_2", "HIGH_3", "LOW_2"],
    ["HIGH_2", "HIGH_2", "HIGH_4"],
    ["HIGH_2", "HIGH_1", "HIGH_4"],
    ["HIGH_2", "LOW_3", "HIGH_4"]]);
if (winlines.length === 2 && winlines[0] === 0 && winlines[1] === 2){
    http.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
} else {
    console.log("Server failed to start");
}


const array_symbol = ["SCATTER", "LOW_1", "LOW_2", "LOW_3", "LOW_4", "HIGH_1", "HIGH_2", "HIGH_3", "HIGH_4"];

function getSpin() {
    let reel = [];
    let spinResult = [];

    for (let i = 0; i < 5; i++){
        reel[i] = [];
        spinResult[i] = [];
        for(let j = 0; j < 100; j++){
            let index = getRandomInt(0, 8);
            reel[i].push(array_symbol[index])
        }
        let indexStop = getRandomInt(0, 99);
        spinResult[i].push(reel[i][indexStop]);
        if (indexStop > 97) indexStop = 0;
        spinResult[i].push(reel[i][indexStop + 1]);
        spinResult[i].push(reel[i][indexStop + 2]);
    }
    return spinResult
}

function game(spinResult) {
    let winlines = [];
    for (let i = 0; i < 3; i++){
        let current = spinResult[0][i];

        let count = 1;
        for (let j = 1; j < 5; j++){
            if (spinResult[j][i] === current){
                count ++;
            } else {
                count = 1;
                current = spinResult[j][i]
            }
            if (count === 3){
                winlines.push(i);
                continue
            }
        }
    }
    return winlines
}

function getResult() {
    let spinResult = getSpin();

    return {
        "winlines": game(spinResult),
        spinResult
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}