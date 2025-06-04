// Target date: July 8, 2031 (your 30th birthday)
const targetDate = new Date('2031-07-08T00:00:00').getTime();

// DOM elements for the new theme
const animatedDisplayContainer = document.getElementById('totalSecondsAnimatedDisplay');
const fadedBackgroundTimeElement = document.getElementById('fadedBackgroundTime');

// Store refs to digit reels and previous values for animation
let digitReels = [];
let previousTotalSecondsString = '';

// Function to create the initial digit slots
function setupAnimatedDisplay(initialSecondsString) {
    if (!animatedDisplayContainer) return;
    animatedDisplayContainer.innerHTML = ''; // Clear any existing content
    digitReels = [];

    const parts = initialSecondsString.split(',');
    parts.forEach((part, index) => {
        const digitGroup = document.createElement('div');
        digitGroup.classList.add('digit-group');

        for (let i = 0; i < part.length; i++) {
            const char = part[i];
            const slot = document.createElement('div');
            slot.classList.add('digit-slot');

            const reel = document.createElement('div');
            reel.classList.add('digit-reel');

            // Populate reel with numbers 0-9
            for (let j = 0; j <= 9; j++) {
                const numSpan = document.createElement('span');
                numSpan.textContent = j;
                reel.appendChild(numSpan);
            }
            slot.appendChild(reel);
            digitGroup.appendChild(slot);
            digitReels.push({ reel: reel, digitHeight: 0 }); // digitHeight will be calculated later
        }
        animatedDisplayContainer.appendChild(digitGroup);

        if (index < parts.length - 1) {
            const comma = document.createElement('span');
            comma.classList.add('comma-separator');
            comma.textContent = ',';
            animatedDisplayContainer.appendChild(comma);
        }
    });

    // Calculate digit height after DOM is updated (important for animation)
    if (digitReels.length > 0 && digitReels[0].reel.querySelector('span')) {
        const sampleDigitSpan = digitReels[0].reel.querySelector('span');
        const digitHeight = sampleDigitSpan.offsetHeight;
        digitReels.forEach(dr => dr.digitHeight = digitHeight);
    }
}

function updateAnimatedDisplay(totalSeconds) {
    if (!animatedDisplayContainer || digitReels.length === 0) return;

    const currentTotalSecondsString = totalSeconds.toLocaleString();

    // If the number of digits or commas changes, rebuild the display
    if (previousTotalSecondsString.length !== currentTotalSecondsString.length || 
        (previousTotalSecondsString.match(/,/g) || []).length !== (currentTotalSecondsString.match(/,/g) || []).length) {
        setupAnimatedDisplay(currentTotalSecondsString);
        if (digitReels.length === 0) return; // Exit if setup failed or resulted in no reels
    }
    
    previousTotalSecondsString = currentTotalSecondsString;
    let reelIndex = 0;

    for (let i = 0; i < currentTotalSecondsString.length; i++) {
        const char = currentTotalSecondsString[i];
        if (char === ',') continue; // Skip commas for reel animation

        if (reelIndex < digitReels.length) {
            const digit = parseInt(char);
            const { reel, digitHeight } = digitReels[reelIndex];
            if (reel && digitHeight > 0) {
                reel.style.transform = `translateY(-${digit * digitHeight}px)`;
            }
            reelIndex++;
        }
    }
}

function updateFadedBackgroundTime(now) {
    if (!fadedBackgroundTimeElement) return;
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    fadedBackgroundTimeElement.textContent = `${hours}:${minutes}`;
}

function updateCountdown() {
    const now = new Date();
    const timeRemaining = targetDate - now.getTime();

    if (timeRemaining <= 0) {
        if (animatedDisplayContainer) animatedDisplayContainer.innerHTML = '<div class="digit-slot"><span>0</span></div>'; // Simplified end state
        document.querySelector('.info-title').textContent = '🎉 You\'ve reached 30! 🎉';
        if (document.querySelector('.countdown-label-main')) {
            document.querySelector('.countdown-label-main').textContent = "It's Here!";
        }
        if (fadedBackgroundTimeElement) fadedBackgroundTimeElement.textContent = "--:--";
        return;
    }

    const totalSeconds = Math.floor(timeRemaining / 1000);
    updateAnimatedDisplay(totalSeconds);
    updateFadedBackgroundTime(now);
}

// Function to calculate age-based statistics (can be kept for console logging)
function calculateAgeStatistics() {
    const birthDate = new Date('2001-07-08');
    const thirtiethBirthday = new Date('2031-07-08');
    const averageLifespan = 70; // years

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

// Initialize
window.addEventListener('load', () => {
    // Initial setup for display based on current remaining seconds
    const initialTimeRemaining = targetDate - new Date().getTime();
    const initialTotalSeconds = Math.max(0, Math.floor(initialTimeRemaining / 1000));
    setupAnimatedDisplay(initialTotalSeconds.toLocaleString());
    
    updateCountdown(); // First immediate update
    setInterval(updateCountdown, 1000); // Subsequent updates

    calculateAgeStatistics(); // Log stats

    // Fade-in for new elements if desired (ensure selectors match new HTML)
    const container = document.querySelector('.container');
    if(container) container.style.opacity = '1'; // Example fade-in for whole container
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