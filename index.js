// Player object - now will be updated from setup screen
let player = {
    name: "Player",
    chips: 500
}

// Game state variables - preserved from original
let cards = []
let sum = 0
let hasBlackJack = false
let isAlive = false
let message = ""

// DOM elements
let messageEl = document.getElementById("message-el")
let sumEl = document.getElementById("sum-el")
let cardsDisplayEl = document.getElementById("cards-display")
let playerDisplayEl = document.getElementById("player-display")

// Screen elements
let setupScreen = document.getElementById("setup-screen")
let gameScreen = document.getElementById("game-screen")

// Setup screen elements
let playerNameInput = document.getElementById("player-name")
let chipButtons = document.querySelectorAll(".chip-btn")
let enterCasinoBtn = document.getElementById("enter-casino-btn")

// Game control buttons
let startGameBtn = document.getElementById("start-game-btn")
let hitBtn = document.getElementById("hit-btn")
let standBtn = document.getElementById("stand-btn")
let newGameBtn = document.getElementById("new-game-btn")

// Card suits and their properties
const SUITS = {
    spades: { symbol: '♠', color: 'black' },
    hearts: { symbol: '♥', color: 'red' },
    diamonds: { symbol: '♦', color: 'red' },
    clubs: { symbol: '♣', color: 'black' }
}

const SUIT_NAMES = Object.keys(SUITS)

// Setup screen functionality
function initializeSetup() {
    // Handle chip selection
    chipButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            chipButtons.forEach(b => b.classList.remove('selected'))
            this.classList.add('selected')
        })
    })

    // Handle enter casino button
    enterCasinoBtn.addEventListener('click', enterCasino)
    
    // Handle enter key in name input
    playerNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            enterCasino()
        }
    })
    
    // Focus on name input
    playerNameInput.focus()
}

function enterCasino() {
    const name = playerNameInput.value.trim()
    
    if (!name) {
        alert('Please enter your name!')
        playerNameInput.focus()
        return
    }
    
    if (name.length < 2) {
        alert('Name must be at least 2 characters long!')
        playerNameInput.focus()
        return
    }
    
    const selectedChips = document.querySelector('.chip-btn.selected').getAttribute('data-chips')
    
    // Update player object
    player.name = name
    player.chips = parseInt(selectedChips)
    
    // Update player display
    updatePlayerDisplay()
    
    // Transition to game screen
    setupScreen.classList.add('hidden')
    gameScreen.classList.remove('hidden')
}

function updatePlayerDisplay() {
    playerDisplayEl.textContent = `${player.name}: $${player.chips}`
}

// Original getRandomCard function - preserved exactly as is
function getRandomCard() {
    let randomNumber = Math.floor( Math.random()*13 ) + 1
    if (randomNumber > 10) {
        return 10
    } else if (randomNumber === 1) {
        return 11
    } else {
        return randomNumber
    }
}

// Enhanced card creation with visual representation
function createCardObject(value) {
    const suitName = SUIT_NAMES[Math.floor(Math.random() * SUIT_NAMES.length)]
    const suit = SUITS[suitName]
    
    return {
        value: value,
        suit: suit.symbol,
        color: suit.color,
        displayValue: getCardDisplayValue(value)
    }
}

function getCardDisplayValue(value) {
    if (value === 11) return 'A'
    if (value === 10) {
        const faceCards = ['10', 'J', 'Q', 'K']
        return faceCards[Math.floor(Math.random() * faceCards.length)]
    }
    return value.toString()
}

function createCardElement(cardObj) {
    const cardEl = document.createElement('div')
    cardEl.className = `card ${cardObj.color}`
    
    cardEl.innerHTML = `
        <div class="card-value">${cardObj.displayValue}</div>
        <div class="card-suit">${cardObj.suit}</div>
        <div class="card-value" style="transform: rotate(180deg);">${cardObj.displayValue}</div>
    `
    
    return cardEl
}

function updateButtonStates() {
    if (!isAlive || hasBlackJack) {
        hitBtn.disabled = true
        standBtn.disabled = true
        newGameBtn.disabled = false
    } else {
        hitBtn.disabled = false
        standBtn.disabled = false
        newGameBtn.disabled = true
    }
    
    startGameBtn.disabled = isAlive || hasBlackJack
}

// Enhanced startGame function with visual cards
function startGame() {
    isAlive = true
    hasBlackJack = false
    
    let firstCard = getRandomCard()
    let secondCard = getRandomCard()
    cards = [createCardObject(firstCard), createCardObject(secondCard)]
    sum = firstCard + secondCard
    
    renderGame()
    updateButtonStates()
}

// Enhanced renderGame function with visual cards
function renderGame() {
    // Clear existing cards
    cardsDisplayEl.innerHTML = ''
    
    // Add visual cards with animation delay
    cards.forEach((card, index) => {
        setTimeout(() => {
            const cardElement = createCardElement(card)
            cardsDisplayEl.appendChild(cardElement)
        }, index * 200)
    })
    
    // Update sum display
    sumEl.textContent = `Sum: ${sum}`
    
    // Update message based on game state
    if (sum <= 20) {
        message = "Do you want to draw a new card?"
        messageEl.className = "game-message"
    } else if (sum === 21) {
        message = "🎉 You've got Blackjack! 🎉"
        hasBlackJack = true
        messageEl.className = "game-message blackjack"
    } else {
        message = "💥 You're out of the game! 💥"
        isAlive = false
        messageEl.className = "game-message lose"
    }
    
    messageEl.textContent = message
    updateButtonStates()
}

// Enhanced newCard function (now called by HIT ME button)
function newCard() {
    if (isAlive === true && hasBlackJack === false) {
        let cardValue = getRandomCard()
        let newCardObj = createCardObject(cardValue)
        sum += cardValue
        cards.push(newCardObj)
        renderGame()
    }
}

// New stand function
function stand() {
    if (isAlive && !hasBlackJack) {
        isAlive = false
        if (sum <= 21) {
            message = "🎯 You chose to stand! Good game! 🎯"
            messageEl.className = "game-message win"
        } else {
            message = "💥 You busted! 💥"
            messageEl.className = "game-message lose"
        }
        messageEl.textContent = message
        updateButtonStates()
    }
}

// New game function to completely restart
function newGame() {
    // Reset game state
    cards = []
    sum = 0
    hasBlackJack = false
    isAlive = false
    message = ""
    
    // Clear display
    cardsDisplayEl.innerHTML = ''
    sumEl.textContent = "Sum: 0"
    messageEl.textContent = "Ready for another round?"
    messageEl.className = "game-message"
    
    // Reset button states
    startGameBtn.disabled = false
    hitBtn.disabled = true
    standBtn.disabled = true
    newGameBtn.disabled = true
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeSetup()
    updatePlayerDisplay()
    updateButtonStates()
})
