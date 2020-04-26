const { fireSound, missSound, successSound, wrongAreaSound } = require("./sounds")


// Global Variables
const form = document.getElementById("form")
const guessInput = document.getElementById("guessInput")
const fireButton = document.getElementById("fireButton")
const messageArea = document.getElementById("messageArea")
const clockElement = document.getElementById("clock")
const table = document.getElementById("table")
const pageblur = document.getElementById("blur")
const popup = document.getElementById("popup")
const credits = document.getElementById("credits")


// INITAL INSTRUCTIONS FUNCTION --> PLAY BUTTON
function readInstructions() {
    pageblur.classList.remove("active")
    popup.classList.add("hidden")
    clockElement.classList.add("clockAnimation")
    init()
}


function init() {
    fireButton.onclick = handleFireButton
    guessInput.onkeypress = handleKeyPress
    model.generateShipLocations()
    table.onclick = tableClickHandler
    countdownHandler()
    showCreditsHandler()
}


function handleFireButton() {
    let guess = guessInput.value
    controller.processGuess(guess)
    guessInput.value = ""
}


function handleKeyPress(e) {
    if (e.keyCode === 13) {
        fireButton.click()
        return false // to prevent form doing something else - Like trying to SUBMIT itself 
    }
}


function tableClickHandler() {
    guessInput.classList = "isVisible"
    fireButton.classList = "isVisible"
    // wrongAreaSound.play()
    addEventListener("animationend", animationEndCallback)
}


function animationEndCallback() {
    guessInput.classList.remove("isVisible")
    fireButton.classList.remove("isVisible")
    messageArea.classList.remove("isVisible")
    clockElement.classList.remove("addAnimate")
    clockElement.classList.remove("minusAnimate")
}


function showCreditsHandler() {
    credits.addEventListener("click", toggleAccordion)
}


function toggleAccordion() {
    const creditsContent = credits.querySelector(".accordion-content")
    const arrow = credits.querySelector(".accordion-arrow")
    
    arrow.classList.toggle("active-arrow")
    creditsContent.classList.toggle("hidden")
    creditsContent.classList.toggle("active-content")
}


let view = {
    displayMessage: function(msg) {
        messageArea.style.visibility = "visible"
        messageArea.classList = "isVisible"
        messageArea.innerHTML = msg
        addEventListener("animationend", animationEndCallback)
    }, 

    displayHit: function(location) {
        let cell = document.getElementById(location)
        cell.setAttribute("class", "hit")
    }, 

    displayMiss: function(location) {
        let cell = document.getElementById(location)
        cell.setAttribute("class", "miss")
    }
}


let model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3, 
    shipsSunk: 0,

    ships: [{ locations: [0, 0, 0] , hits: ["", "", ""] },
            { locations: [0, 0, 0], hits: ["", "", ""] },
            { locations: [0, 0, 0], hits: ["", "", ""] }],

    fire: function(guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i]
            console.log(ship)
            let index = ship.locations.indexOf(guess)
            
            if (index >= 0) {
                ship.hits[index] = "hit"
                view.displayHit(guess)
                view.displayMessage("HIT!")
                countdownEventsHandler.addTime()
                // fireSound.play()

                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!")
                    this.shipsSunk++
                }

                return true
            }
        }

        view.displayMiss(guess)
        view.displayMessage("You missed.")
        countdownEventsHandler.removeTime()
        // missSound.play()
        return false
    },

    isSunk: function(ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false
            }
        }

        return true
    },

    generateShipLocations: function() {
        let locations 
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip()
                
            } while (this.collision(locations))

            this.ships[i].locations = locations
        }
    },

    generateShip: function() {
        // Gerar 2 possibilidades aleatórias --> 2 direcções
            // Uma possibilidade - gera ships na horizontal
            // A outra - gera ships na vertical
        // Com essa direção vamos primeiro definir o STARTING POINT da localização do SHIP


        let direction = Math.floor(Math.random() * 2)
        let row, col

        console.log(direction)

        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize)
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength))
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength))
            col = Math.floor(Math.random() * this.boardSize)
        }


        // Após ter-se criado as 2 direções --> vamos começar a criar as localizações adjacentes a cada um do STARTING POINT criado acima
            // E passar estas localizações para um ARRAY

        let newShipLocations = []
        
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i))
            } else {
                newShipLocations.push((row + i) + "" + col)
            }
        }
        
        console.log(newShipLocations)
        
        return newShipLocations
    },

    collision: function(locations) {
        
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i]

            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true
                }
            }
        }

        return false
    }

}


let controller = {
    guesses: 0,

    processGuess: function(guess){
        let location = parseGuess(guess)

        if (location) {
            console.log(location)
            this.guesses++

            let hit = model.fire(location)

            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleships in " + this.guesses + " guesses")
                form.style.display = "none"
                // successSound.play()
                clearInterval(countdown)
            }
        }
    }
    
}


function parseGuess(guess) {
    let alphabet = ["A", "B", "C", "D", "E", "F", "G"]

    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.")
    } else {
        let firstChar = guess.charAt(0).toUpperCase()
        let row = alphabet.indexOf(firstChar)
        let column = guess.charAt(1)
        console.log(row + column)

        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't in the board.")
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert("Oops, that's off the board!")
        } else {
            return row + column
        }
    }
    
    return null
}


// Countdown Function - Using setInterval
const initialMinutes = 4
let time = initialMinutes * 60
let countdown

function countdownHandler() {
    countdown = setInterval(function() {
        let minutes = Math.floor(time / 60)
        let seconds = time % 60

        seconds = seconds < 10 ? "0" + seconds : seconds
        clockElement.innerHTML = `${minutes}:${seconds}`

        time--

        if (time < 0) {
            clearInterval(countdown)
            form.style.display = "none"
            view.displayMessage("Time's up! Better Luck Next Time")
        }

    }, 1000)    
}


// Events Handler Object --> With the 2 Methods / functions 
// Each event is calling a Callback function --> that is triggered on Animation END
    // To remove the animation class
    const countdownEventsHandler = {
        addTime: function() { 
            if (time < initialMinutes * 60) {
                time = time + 5

                clockElement.classList.add("addAnimate")
                clockElement.addEventListener("animationend", animationEndCallback)
                return time
            }
        },
        removeTime: function() {
            if (time < initialMinutes * 60) {
                time = time - 5

                clockElement.classList.add("minusAnimate")
                console.log("water")
                clockElement.addEventListener("animationend", animationEndCallback)
                return time
            }
        }
    }
    
