// Target date: July 8, 2031 (your 30th birthday)
const targetDate = new Date('2031-07-08T00:00:00').getTime();

// DOM elements
const animatedDisplayContainer = document.getElementById('totalSecondsAnimatedDisplay');
const fadedBackgroundTimeElement = document.getElementById('fadedBackgroundTime');

// Store refs to flip cards and previous values
let flipCards = [];
let previousTotalSecondsString = '';

// Function to create flip card structure
function createFlipCard(currentDigit = 0) {
    const slot = document.createElement('div');
    slot.classList.add('digit-slot');
    
    const flipCard = document.createElement('div');
    flipCard.classList.add('flip-card');
    
    const frontFace = document.createElement('div');
    frontFace.classList.add('flip-card-face', 'flip-card-front');
    frontFace.textContent = currentDigit;
    
    const backFace = document.createElement('div');
    backFace.classList.add('flip-card-face', 'flip-card-back');
    backFace.textContent = currentDigit;
    
    flipCard.appendChild(frontFace);
    flipCard.appendChild(backFace);
    slot.appendChild(flipCard);
    
    return {
        slot: slot,
        flipCard: flipCard,
        frontFace: frontFace,
        backFace: backFace,
        currentValue: currentDigit
    };
}

// Function to setup the animated display
function setupAnimatedDisplay(initialSecondsString) {
    if (!animatedDisplayContainer) return;
    animatedDisplayContainer.innerHTML = '';
    flipCards = [];

    const parts = initialSecondsString.split(',');
    parts.forEach((part, partIndex) => {
        const digitGroup = document.createElement('div');
        digitGroup.classList.add('digit-group');

        for (let i = 0; i < part.length; i++) {
            const digit = parseInt(part[i]) || 0;
            const cardData = createFlipCard(digit);
            digitGroup.appendChild(cardData.slot);
            flipCards.push(cardData);
        }
        
        animatedDisplayContainer.appendChild(digitGroup);

        // Add comma separator (except for last part)
        if (partIndex < parts.length - 1) {
            const comma = document.createElement('span');
            comma.classList.add('comma-separator');
            comma.textContent = ',';
            animatedDisplayContainer.appendChild(comma);
        }
    });
}

// Function to animate a single flip card
function flipToNewDigit(cardData, newDigit) {
    if (cardData.currentValue === newDigit) return;
    
    // Set the back face to show the new digit
    cardData.backFace.textContent = newDigit;
    
    // Add flipping class to trigger animation
    cardData.flipCard.classList.add('flipping');
    
    // After animation completes, update front face and reset
    setTimeout(() => {
        cardData.frontFace.textContent = newDigit;
        cardData.flipCard.classList.remove('flipping');
        cardData.currentValue = newDigit;
    }, 400); // Half of the CSS transition duration
}

// Function to update the animated display
function updateAnimatedDisplay(totalSeconds) {
    if (!animatedDisplayContainer) return;

    const currentTotalSecondsString = totalSeconds.toLocaleString();
    
    // If structure changed significantly, rebuild
    const currentCommaCount = (currentTotalSecondsString.match(/,/g) || []).length;
    const previousCommaCount = (previousTotalSecondsString.match(/,/g) || []).length;
    
    if (currentTotalSecondsString.length !== previousTotalSecondsString.length || 
        currentCommaCount !== previousCommaCount) {
        setupAnimatedDisplay(currentTotalSecondsString);
        previousTotalSecondsString = currentTotalSecondsString;
        return;
    }
    
    // Update each digit with flip animation
    let cardIndex = 0;
    for (let i = 0; i < currentTotalSecondsString.length; i++) {
        const char = currentTotalSecondsString[i];
        if (char === ',') continue; // Skip commas
        
        if (cardIndex < flipCards.length) {
            const newDigit = parseInt(char) || 0;
            flipToNewDigit(flipCards[cardIndex], newDigit);
            cardIndex++;
        }
    }
    
    previousTotalSecondsString = currentTotalSecondsString;
}

// Function to update faded background time
function updateFadedBackgroundTime(now) {
    if (!fadedBackgroundTimeElement) return;
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    fadedBackgroundTimeElement.textContent = `${hours}:${minutes}`;
}

// Main countdown function
function updateCountdown() {
    const now = new Date();
    const timeRemaining = targetDate - now.getTime();

    if (timeRemaining <= 0) {
        // Countdown finished
        flipCards.forEach(cardData => flipToNewDigit(cardData, 0));
        
        // Update titles
        const titleElement = document.querySelector('.info-title');
        const labelElement = document.querySelector('.countdown-label-main');
        
        if (titleElement) titleElement.textContent = '🎉 You\'ve reached 30! 🎉';
        if (labelElement) labelElement.textContent = "Congratulations!";
        if (fadedBackgroundTimeElement) fadedBackgroundTimeElement.textContent = "30!";
        
        return;
    }

    const totalSeconds = Math.floor(timeRemaining / 1000);
    updateAnimatedDisplay(totalSeconds);
    updateFadedBackgroundTime(now);
}

// Age statistics (for console logging)
function calculateAgeStatistics() {
    const birthDate = new Date('2001-07-08');
    const thirtiethBirthday = new Date('2031-07-08');
    const averageLifespan = 70;

    const now = new Date();
    const currentAge = (now - birthDate) / (1000 * 60 * 60 * 24 * 365.25);
    const remainingTime = thirtiethBirthday - now;
    const currentRemainingSeconds = Math.floor(remainingTime / 1000);

    console.log(`Current age: ${currentAge.toFixed(1)} years`);
    console.log(`Seconds until 30: ${currentRemainingSeconds.toLocaleString()}`);
    console.log(`Average lifespan target: ${averageLifespan} years`);

    return {
        currentAge: currentAge.toFixed(1),
        remainingSeconds: currentRemainingSeconds,
        averageLifespan: averageLifespan
    };
}

// Initialize everything
window.addEventListener('load', () => {
    // Setup initial display
    const initialTimeRemaining = targetDate - new Date().getTime();
    const initialTotalSeconds = Math.max(0, Math.floor(initialTimeRemaining / 1000));
    setupAnimatedDisplay(initialTotalSeconds.toLocaleString());
    
    // Start the countdown
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Log statistics
    calculateAgeStatistics();
    
    console.log('FlipClock countdown initialized! 🚀');
});

// Add some interactive effects (if elements still exist)
const countdownNumberElement = document.querySelector('.countdown-number');
if (countdownNumberElement) {
    countdownNumberElement.addEventListener('mouseenter', () => {
        countdownNumberElement.style.transform = 'scale(1.05)';
    });

    countdownNumberElement.addEventListener('mouseleave', () => {
        countdownNumberElement.style.transform = 'scale(1)';
    });
}

// Add click effect to globe
const globeElement = document.querySelector('.globe');
if (globeElement) {
    globeElement.addEventListener('click', () => {
        globeElement.style.animation = 'none';
        globeElement.offsetHeight; // Trigger reflow
        globeElement.style.animation = 'rotate 2s linear infinite';

        setTimeout(() => {
            globeElement.style.animation = 'rotate 20s linear infinite';
        }, 2000);
    });
}

// Performance optimization: Use requestAnimationFrame for smooth animations (optional)
// let animationFrame;
// function smoothUpdate() {
//     updateCountdown();
//     animationFrame = requestAnimationFrame(() => {
//         setTimeout(smoothUpdate, 1000); // Adjust timing if needed
//     });
// }
// smoothUpdate(); // Call this instead of setInterval if using requestAnimationFrame 