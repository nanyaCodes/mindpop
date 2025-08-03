class MemoryGame {
    constructor() {
        this.splashScreen = document.getElementById('splash-screen');
        this.startBtn = document.getElementById('start-btn');
        this.mainGame = document.getElementById('main-game');
        this.board = document.getElementById('game-board');
        this.attemptsElement = document.getElementById('attempts-count');
        this.resetBtn = document.getElementById('reset-btn');
        this.winMessage = document.getElementById('win-message');
        this.finalAttemptsElement = document.getElementById('final-attempts');
        this.fireworksContainer = document.getElementById('fireworks');
        
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.attempts = 0;
        this.isChecking = false;
        
        // Mix of objects and numbers for 4x4 grid (8 pairs)
        this.symbols = ['⚽', '🎸', '📱', '🚗', '🏠', '1', '2', '3'];
        
        this.init();
    }
            
    init() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
    }
            
    startGame() {
        this.splashScreen.classList.add('hidden');
        setTimeout(() => {
            this.mainGame.style.opacity = '1';
            this.createCards();
        }, 800);
    }
            
    createCards() {
        // Clear existing cards
        this.board.innerHTML = '';
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.attempts = 0;
        this.isChecking = false;
        this.updateAttempts();
        this.winMessage.classList.add('hidden');
        this.clearFireworks();
        
        // Create pairs (8 pairs for 4x4 grid)
        const cardPairs = [...this.symbols, ...this.symbols];
        
        // Shuffle cards
        this.shuffleArray(cardPairs);
         
        // Create card elements
        cardPairs.forEach((symbol, index) => {
            const card = this.createCardElement(symbol, index);
            this.cards.push(card);
            this.board.appendChild(card.element);
        });
    }
            
    createCardElement(symbol, index) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card aspect-square';
        
        cardElement.innerHTML = `
            <div class="card-inner h-full">
                <div class="card-face card-back">
                    ?
                </div>
                <div class="card-face card-front">
                    ${symbol}
                </div>
            </div>
        `;
        
        const card = {
            element: cardElement,
            symbol: symbol,
            index: index,
            isFlipped: false,
            isMatched: false
        };
        
        cardElement.addEventListener('click', () => this.flipCard(card));
        
        return card;
    }
            
    flipCard(card) {
        if (this.isChecking || card.isFlipped || card.isMatched || this.flippedCards.length >= 2) {
            return;
        }
        
        card.isFlipped = true;
        card.element.classList.add('flipped');
        this.flippedCards.push(card);
        
        if (this.flippedCards.length === 2) {
            this.attempts++;
            this.updateAttempts();
            this.checkMatch();
        }
    }
            
    checkMatch() {
        this.isChecking = true;
        const [card1, card2] = this.flippedCards;
        
        setTimeout(() => {
            if (card1.symbol === card2.symbol) {
                // Match found
                this.handleMatch(card1, card2);
            } else {
                // No match
                this.handleMismatch(card1, card2);
            }
            
            this.flippedCards = [];
            this.isChecking = false;
            
            // Check win condition
            if (this.matchedPairs === 8) {
                this.handleWin();
            }
        }, 1000);
    }
            
    handleMatch(card1, card2) {
        card1.isMatched = true;
        card2.isMatched = true;
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        this.matchedPairs++;
    }
            
    handleMismatch(card1, card2) {
        card1.isFlipped = false;
        card2.isFlipped = false;
        card1.element.classList.remove('flipped');
        card2.element.classList.remove('flipped');
        card1.element.classList.add('shake');
        card2.element.classList.add('shake');
        
        setTimeout(() => {
            card1.element.classList.remove('shake');
            card2.element.classList.remove('shake');
        }, 500);
    }
            
    handleWin() {
        this.winMessage.classList.remove('hidden');
        this.winMessage.classList.add('game-won');
        this.finalAttemptsElement.textContent = this.attempts;
        this.createFireworks();
    }
            
    createFireworks() {
        const colors = ['#ff6b9d', '#4ecdc4', '#45b7d1', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3'];
        
        for (let i = 0; i < 60; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'firework';
                firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                firework.style.left = Math.random() * 100 + '%';
                firework.style.top = Math.random() * 100 + '%';
                
                this.fireworksContainer.appendChild(firework);
                
                setTimeout(() => {
                    firework.remove();
                }, 1200);
            }, i * 80);
        }
    }
            
    clearFireworks() {
        this.fireworksContainer.innerHTML = '';
    }
            
    updateAttempts() {
        this.attemptsElement.textContent = this.attempts;
    }
            
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
            
    resetGame() {
        this.winMessage.classList.remove('game-won');
        this.createCards();
    }
    }
        

    document.addEventListener('DOMContentLoaded', () => {
        new MemoryGame();
    });