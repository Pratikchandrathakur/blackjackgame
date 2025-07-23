// Game state variables
let player = {
    name: "Player",
    chips: 200
}

let cards = []
let cardDetails = [] // Store detailed card info for display
let sum = 0
let hasBlackJack = false
let isAlive = false
let gameStarted = false
let message = ""

// DOM elements
let setupScreen = document.getElementById("setup-screen")
let gameScreen = document.getElementById("game-screen")
let playerNameInput = document.getElementById("player-name")
let startingChipsSelect = document.getElementById("starting-chips")
let enterGameBtn = document.getElementById("enter-game-btn")

let messageEl = document.getElementById("message-el")
let sumEl = document.getElementById("sum-el")
let cardsEl = document.getElementById("cards-el")
let playerDisplayEl = document.getElementById("player-display")
let chipsDisplayEl = document.getElementById("chips-display")

let startGameBtn = document.getElementById("start-game-btn")
let newCardBtn = document.getElementById("new-card-btn")
let standBtn = document.getElementById("stand-btn")
let newGameBtn = document.getElementById("new-game-btn")

// Card suits and display mapping
const cardSuits = ['♠', '♥', '♦', '♣']
const cardNames = {
    1: 'A', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: 'J', 12: 'Q', 13: 'K'
}

// Initialize the game
function initGame() {
    // Setup event listeners
    enterGameBtn.addEventListener("click", enterGame)
    startGameBtn.addEventListener("click", startGame)
    newCardBtn.addEventListener("click", newCard)
    standBtn.addEventListener("click", stand)
    newGameBtn.addEventListener("click", resetToSetup)
    
    // Focus on name input
    playerNameInput.focus()
    
    // Allow Enter key to start game
    playerNameInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            enterGame()
        }
    })
}

function enterGame() {
    const name = playerNameInput.value.trim()
    const chips = parseInt(startingChipsSelect.value)
    
    if (!name) {
        alert("Please enter your name!")
        playerNameInput.focus()
        return
    }
    
    // Set player data
    player.name = name
    player.chips = chips
    
    // Switch to game screen
    setupScreen.classList.add("hidden")
    gameScreen.classList.remove("hidden")
    
    // Update player display
    updatePlayerDisplay()
}

function updatePlayerDisplay() {
    playerDisplayEl.textContent = `👤 ${player.name}`
    chipsDisplayEl.textContent = `💰 $${player.chips}`
}

function getRandomCard() {
    let randomNumber = Math.floor(Math.random() * 13) + 1
    let suit = cardSuits[Math.floor(Math.random() * 4)]
    let displayName = cardNames[randomNumber]
    let isRed = suit === '♥' || suit === '♦'
    
    // Store detailed card info
    let cardDetail = {
        value: randomNumber > 10 ? 10 : randomNumber === 1 ? 11 : randomNumber,
        displayName: displayName,
        suit: suit,
        isRed: isRed
    }
    
    cardDetails.push(cardDetail)
    
    return cardDetail.value
}

function createCardElement(cardDetail, delay = 0) {
    const cardEl = document.createElement("div")
    cardEl.className = `card ${cardDetail.isRed ? 'red' : 'black'}`
    
    cardEl.innerHTML = `
        <div class="card-value">${cardDetail.displayName}</div>
        <div class="card-suit">${cardDetail.suit}</div>
    `
    
    // Add dealing animation with delay
    setTimeout(() => {
        cardEl.classList.add("dealing")
        cardsEl.appendChild(cardEl)
    }, delay)
    
    return cardEl
}

function startGame() {
    if (gameStarted) return
    
    // Reset game state
    isAlive = true
    hasBlackJack = false
    gameStarted = true
    cards = []
    cardDetails = []
    sum = 0
    
    // Clear previous cards
    cardsEl.innerHTML = ""
    
    // Deal two cards with animation
    let firstCard = getRandomCard()
    let secondCard = getRandomCard()
    
    cards = [firstCard, secondCard]
    sum = firstCard + secondCard
    
    // Create card elements with staggered animation
    createCardElement(cardDetails[0], 100)
    createCardElement(cardDetails[1], 300)
    
    // Update UI after cards are dealt
    setTimeout(() => {
        renderGame()
        // Enable game buttons
        newCardBtn.disabled = false
        standBtn.disabled = false
        startGameBtn.disabled = true
    }, 500)
}

function renderGame() {
    sumEl.textContent = "Sum: " + sum
    
    if (sum <= 20) {
        message = "Do you want to draw a new card?"
        messageEl.className = "game-message"
    } else if (sum === 21) {
        message = "🎉 You've got Blackjack! 🎉"
        messageEl.className = "game-message game-blackjack"
        hasBlackJack = true
        endGame()
    } else {
        message = "💥 You're out of the game! 💥"
        messageEl.className = "game-message game-lose"
        isAlive = false
        endGame()
    }
    
    messageEl.textContent = message
}

function newCard() {
    if (isAlive === true && hasBlackJack === false) {
        let card = getRandomCard()
        sum += card
        cards.push(card)
        
        // Add new card with animation
        const newCardDetail = cardDetails[cardDetails.length - 1]
        createCardElement(newCardDetail, 100)
        
        setTimeout(() => {
            renderGame()
        }, 200)
    }
}

function stand() {
    if (isAlive && !hasBlackJack) {
        if (sum <= 21) {
            message = `🎊 You stand with ${sum}! Great game! 🎊`
            messageEl.className = "game-message game-win"
        }
        endGame()
    }
}

function endGame() {
    // Disable game buttons
    newCardBtn.disabled = true
    standBtn.disabled = true
    gameStarted = false
    startGameBtn.disabled = false
}

function resetToSetup() {
    // Reset everything and go back to setup
    gameScreen.classList.add("hidden")
    setupScreen.classList.remove("hidden")
    
    // Reset game state
    gameStarted = false
    isAlive = false
    hasBlackJack = false
    cards = []
    cardDetails = []
    sum = 0
    
    // Reset UI
    cardsEl.innerHTML = ""
    messageEl.textContent = "Ready to play? Click START GAME!"
    messageEl.className = "game-message"
    sumEl.textContent = "Sum: 0"
    
    // Reset buttons
    startGameBtn.disabled = false
    newCardBtn.disabled = true
    standBtn.disabled = true
    
    // Clear inputs
    playerNameInput.value = ""
    startingChipsSelect.value = "200"
    playerNameInput.focus()
}

// Start the application
document.addEventListener("DOMContentLoaded", initGame)
