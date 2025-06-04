// Target date: July 8, 2031 (your 30th birthday)
const targetDate = new Date('2031-07-08T00:00:00').getTime();

// DOM elements
const totalSecondsDisplayElement = document.getElementById('totalSecondsDisplay');
// const totalSecondsInfoElement = document.getElementById('totalSeconds'); // This is now commented out in HTML

// Store previous value for animation (optional for total seconds)
let previousTotalSeconds = null;

function updateCountdown() {
    const now = new Date().getTime();
    const timeRemaining = targetDate - now;

    if (timeRemaining <= 0) {
        // Countdown finished
        if (totalSecondsDisplayElement) totalSecondsDisplayElement.textContent = '0';
        // if (totalSecondsInfoElement) totalSecondsInfoElement.textContent = '0';
        document.querySelector('.info-title').textContent = '🎉 You\'ve reached 30! 🎉';
        if (document.querySelector('.countdown-label')) {
            document.querySelector('.countdown-label').textContent = "It's Here!";
        }
        return;
    }

    const totalSeconds = Math.floor(timeRemaining / 1000);
    const formattedTotalSeconds = totalSeconds.toLocaleString();

    if (totalSecondsDisplayElement) {
        // Optional: Add animation if value changes (might be too frequent for seconds)
        // if (previousTotalSeconds !== null && previousTotalSeconds !== formattedTotalSeconds) {
        //     totalSecondsDisplayElement.classList.add('pulse');
        //     setTimeout(() => {
        //         totalSecondsDisplayElement.classList.remove('pulse');
        //     }, 700); // Shorter pulse for rapid changes
        // }
        totalSecondsDisplayElement.textContent = formattedTotalSeconds;
        previousTotalSeconds = formattedTotalSeconds;
    }

    // if (totalSecondsInfoElement) { // This is now commented out in HTML
    //     totalSecondsInfoElement.textContent = formattedTotalSeconds;
    // }
}

// Function to calculate age-based statistics (like in the first image)
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

// Initialize countdown
updateCountdown();

// Update every second
setInterval(updateCountdown, 1000);

// Log statistics on page load
window.addEventListener('load', () => {
    const stats = calculateAgeStatistics();
    console.log('Age Statistics:', stats);

    // Add a subtle fade-in animation to the main elements
    // Ensure these elements still exist or update selectors if needed
    const globeContainer = document.querySelector('.globe-container');
    const countdownContainer = document.querySelector('.countdown-container');
    const infoSection = document.querySelector('.info-section');

    if (globeContainer) globeContainer.style.opacity = '1';
    if (countdownContainer) countdownContainer.style.opacity = '1';
    if (infoSection) infoSection.style.opacity = '1';
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