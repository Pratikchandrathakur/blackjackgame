let player = {
    name: "Player",
    chips: 200
}

let currentBet = 10
let cards = []
let cardDetails = [] // Store card objects with suit and value info
let sum = 0
let hasBlackJack = false
let isAlive = false
let message = ""

// DOM elements
let messageEl = document.getElementById("message-el")
let sumEl = document.getElementById("sum-el")
let cardsEl = document.getElementById("cards-el")
let playerEl = document.getElementById("player-el")
let cardsDisplay = document.getElementById("cards-display")
let setupScreen = document.getElementById("setup-screen")
let gameScreen = document.getElementById("game-screen")
let currentBetEl = document.getElementById("current-bet")

// Card suits and their symbols
const suits = {
    hearts: { symbol: '♥', color: 'red' },
    diamonds: { symbol: '♦', color: 'red' },
    clubs: { symbol: '♣', color: 'black' },
    spades: { symbol: '♠', color: 'black' }
}

const suitNames = Object.keys(suits)

function setupGame() {
    const nameInput = document.getElementById("player-name")
    const chipsInput = document.getElementById("starting-chips")
    
    // Validate inputs
    if (!nameInput.value.trim()) {
        alert("Please enter your name!")
        return
    }
    
    const chips = parseInt(chipsInput.value)
    if (isNaN(chips) || chips < 50 || chips > 10000) {
        alert("Please enter a valid chip amount (50-10000)!")
        return
    }
    
    // Set player info
    player.name = nameInput.value.trim()
    player.chips = chips
    
    // Update display
    updatePlayerDisplay()
    
    // Switch to game screen
    setupScreen.classList.add("hidden")
    gameScreen.classList.remove("hidden")
}

function updatePlayerDisplay() {
    playerEl.textContent = player.name + ": $" + player.chips
    currentBetEl.textContent = "Current Bet: $" + currentBet
}

function getRandomCard() {
    let randomNumber = Math.floor(Math.random() * 13) + 1
    let value
    let displayValue
    
    if (randomNumber > 10) {
        value = 10
        displayValue = randomNumber === 11 ? 'J' : randomNumber === 12 ? 'Q' : 'K'
    } else if (randomNumber === 1) {
        value = 11
        displayValue = 'A'
    } else {
        value = randomNumber
        displayValue = randomNumber.toString()
    }
    
    // Get random suit
    const suitName = suitNames[Math.floor(Math.random() * suitNames.length)]
    const suit = suits[suitName]
    
    return {
        value: value,
        displayValue: displayValue,
        suit: suit.symbol,
        color: suit.color
    }
}

function createCardElement(cardObj) {
    const cardEl = document.createElement('div')
    cardEl.className = `card ${cardObj.color}`
    
    cardEl.innerHTML = `
        <div class="card-value">${cardObj.displayValue}</div>
        <div class="card-suit">${cardObj.suit}</div>
        <div class="card-value-bottom">${cardObj.displayValue}</div>
    `
    
    return cardEl
}

function startGame() {
    // Check if player has enough chips
    const betAmount = parseInt(document.getElementById("bet-amount").value)
    if (betAmount > player.chips) {
        alert("You don't have enough chips for this bet!")
        return
    }
    
    currentBet = betAmount
    isAlive = true
    hasBlackJack = false
    
    let firstCard = getRandomCard()
    let secondCard = getRandomCard()
    cards = [firstCard.value, secondCard.value]
    cardDetails = [firstCard, secondCard]
    
    updatePlayerDisplay()
    renderGame()
}

function calculateSum() {
    let tempSum = 0
    let aces = 0
    
    // Count all cards and track aces
    for (let i = 0; i < cards.length; i++) {
        if (cards[i] === 11) {
            aces++
        }
        tempSum += cards[i]
    }
    
    // Convert aces from 11 to 1 if needed to avoid busting
    while (tempSum > 21 && aces > 0) {
        tempSum -= 10 // Convert an ace from 11 to 1
        aces--
    }
    
    return tempSum
}

function renderGame() {
    // Recalculate sum with smart ace handling
    sum = calculateSum()
    
    // Clear previous cards
    cardsDisplay.innerHTML = ''
    
    // Display cards with animation delay
    cardDetails.forEach((cardObj, index) => {
        setTimeout(() => {
            const cardEl = createCardElement(cardObj)
            cardsDisplay.appendChild(cardEl)
        }, index * 200) // Stagger the animations
    })
    
    cardsEl.textContent = "Cards: "
    for (let i = 0; i < cards.length; i++) {
        cardsEl.textContent += cards[i] + " "
    }
    
    sumEl.textContent = "Sum: " + sum
    
    if (sum <= 20) {
        message = "Do you want to draw a new card?"
    } else if (sum === 21) {
        if (cards.length === 2) {
            message = "You've got Blackjack! 🎉"
            hasBlackJack = true
            player.chips += Math.floor(currentBet * 1.5) // Blackjack pays 3:2
        } else {
            message = "You got 21! You win! 🎉"
            player.chips += currentBet
        }
        isAlive = false
        updatePlayerDisplay()
    } else {
        message = "You're out of the game! 😞"
        isAlive = false
        player.chips -= currentBet
        updatePlayerDisplay()
        
        // Check if player is out of money
        if (player.chips < 10) {
            setTimeout(() => {
                alert("You're out of chips! Refreshing for a new game...")
                location.reload()
            }, 1000)
        }
    }
    
    messageEl.textContent = message
}

function newCard() {
    if (isAlive === true && hasBlackJack === false) {
        let newCardObj = getRandomCard()
        let cardValue = newCardObj.value
        cards.push(cardValue)
        cardDetails.push(newCardObj)
        renderGame()
    }
}

// Initialize the game
updatePlayerDisplay()
