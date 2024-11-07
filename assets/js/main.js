const startContainer = document.querySelector("#start");
const choiseContainer = document.getElementById("choise");
const factionContainer = document.getElementById("faction");
const gameContainer = document.getElementById("game");
const restartContainer = document.getElementById("restart");
const winnerContainer = document.getElementById("winner");
const nulContainer = document.getElementById("nul");

const audio = new Audio("assets/son/wow.mp3");
const audioA = new Audio("assets/son/Ally.mp3");
const audioH = new Audio("assets/son/Horde.mp3");
const audioW = new Audio("assets/son/Warcraft.mp3");

let faction = 0;
let currentPlayer = 1;
let iaPlayer = false;
let tour = 1
let grid = [
    ["", "", "",],
    ["", "", "",],
    ["", "", "",],
];



//////////////////////// Fonction reset grille //////////////

function resetGrid() {
    grid = [
        ["", "", "",],
        ["", "", "",],
        ["", "", "",],
    ];
}

//////////////////////// Fonction Start Game //////////////

function startGame() {
    startContainer.classList.add("hidden");
    choiseContainer.classList.remove("hidden");
    audio.play();
    resetGrid();
}

/////////////////////////// Fonction choix pvp ou pvia ////////

function choiseAdversaire(choix) {
    choiseContainer.classList.add("hidden");
    factionContainer.classList.remove("hidden");
    createDimension()
    if (choix == 1) {
        iaPlayer = false;
    } else {
        iaPlayer = true
    }
}

////////////////////////// Choix de la Faction ///////////////

function choiseFaction(guilde) {
    factionContainer.classList.add("hidden")
    gameContainer.classList.remove("hidden")
    createDimension()
    currentPlayer = guilde
    if (currentPlayer == 2) {
        audio.pause()
        audioH.play();
        faction = 1
    } else {
        audio.pause()
        audioA.play();
        faction = 0
    }
}

////////////////////////// Fonction restart ///////////////

function restartGame() {
    startContainer.classList.remove("hidden");
    restartContainer.classList.add("hidden");
    winnerContainer.classList.add("hidden");
    nulContainer.classList.add("hidden");
    tour = 1
    resetGrid();
    audioA.pause()
    audioH.pause()
    audioW.play();
}

////////////////////////// Création gille ///////////////////

function createDimension() {
    gameContainer.textContent = ""
    for (let i = 0; i < grid.length; i++) {
        let rowgrid = grid[i];
        for (let j = 0; j < rowgrid.length; j++) {
            let gridGame = document.createElement("div")
            gameContainer.appendChild(gridGame);

            if (grid[i][j] === "" && !(iaPlayer && currentPlayer == 2)) {
                gridGame.addEventListener("click", () => {
                    if (grid[i][j] === "") {
                        grid[i][j] = currentPlayer;
                        checkWin(grid);
                        tour++;
                        tourParTour();
                        createDimension();
                    }
                });
            }

                switch (grid[i][j]) {
                    case 1:
                        let playeurOne = document.createElement("img");
                        playeurOne.src = "./assets/images/pion-ally.png";
                        gridGame.appendChild(playeurOne);
                        break;

                    case 2:
                        let playeurTwo = document.createElement("img");
                        playeurTwo.src = "./assets/images/pion-horde.png";
                        gridGame.appendChild(playeurTwo);
                        break;

                   default:
                        break;
                }
            }
        }
    }

    //////////////////////////// Fonction tour par tour //////////////////

    function tourParTour() {
        if (tour % 2 == faction) {
            currentPlayer = 2;
        } else {
            currentPlayer = 1;
        }
        if (iaPlayer && currentPlayer === 2) {
            setTimeout(iaPlay, 500);
        }
        
    }

    ////////////////////////////// Fonction iaPlay ///////////////////

    function iaPlay() {
    let possibleChoise = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === "") {
                possibleChoise.push({ i, j });
            }
        }
    }

    // Choix aléatoire d'une case parmi les cases disponibles
    if (possibleChoise.length > 0) {
        const move = possibleChoise[random(0, possibleChoise.length - 1)];
        grid[move.i][move.j] = currentPlayer;
        checkWin(grid); 
        tour++;
        tourParTour(); 
        createDimension(); 
    }
}

    ////////////////////////////// Fonction check win ////////////////

    function checkWin(grid) {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {

                if (grid[i][j] !== "" && grid[i][j] === grid[i][j + 1] && grid[i][j] === grid[i][j + 2]) {
                    displayWinner(grid[i][0]); // Affiche le gagnant
                    return true;
                }
                if (grid[i + 2] && grid[i][j] !== "" && grid[i][j] === grid[i + 1][j] && grid[i][j] === grid[i + 2][j]) {
                    displayWinner(grid[0][j]); // Affiche le gagnant
                    return true;
                }
            }
        }
        // Vérification des diagonales
        if (grid[0][0] !== "" && grid[0][0] === grid[1][1] && grid[0][0] === grid[2][2]) {
            displayWinner(grid[0][0]);
            return true;
        }
        if (grid[0][2] !== "" && grid[0][2] === grid[1][1] && grid[0][2] === grid[2][0]) {
            displayWinner(grid[0][2]);
            return true;
        }
        // Vérification du match nul
        if (grid.flat().every(cell => cell !== "")) {
            displayDraw();
            return true;
        }
        return false; // La partie continue
    }

    //////////////////////////// Afficher le gagnant /////////////////////////

    function displayWinner(player) {
        const factionName = player === 1 ? "L'Alliance" : "La Horde"; // Détermine la faction gagnante
        winnerContainer.classList.remove("hidden");
        winnerContainer.textContent = factionName + " a gagné !";
        // gameContainer.classList.add("hidden");
        restartContainer.classList.remove("hidden");
    }

    //////////////////////////// Afficher match nul /////////////////////////

    function displayDraw() {
        nulContainer.classList.remove("hidden");
        nulContainer.textContent = "Match nul !";
        gameContainer.classList.add("hidden");
        restartContainer.classList.remove("hidden");
    }

    //////////////////////////////// Fonction randaom ////////////////////

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }