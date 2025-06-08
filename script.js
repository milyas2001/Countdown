// Target date (will be set dynamically by user)
let targetDate = new Date('2031-07-08T00:00:00').getTime();

// DOM elements
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const totalSecondsElement = document.getElementById('totalSeconds');
const targetDateInput = document.getElementById('targetDateInput');
const updateDateBtn = document.getElementById('updateDateBtn');
const countdownTitle = document.getElementById('countdownTitle');
const dateInfo = document.getElementById('dateInfo');

// Store previous values to add animation on change
let previousValues = {
    days: null,
    hours: null,
    minutes: null,
    seconds: null
};

function updateCountdown() {
    const now = new Date().getTime();
    const timeRemaining = targetDate - now;
    
    if (timeRemaining <= 0) {
        // Countdown finished
        daysElement.textContent = '00';
        hoursElement.textContent = '00';
        minutesElement.textContent = '00';
        secondsElement.textContent = '00';
        totalSecondsElement.textContent = '0';
        
        // You could add celebration animation here
        countdownTitle.textContent = '🎉 Target Date Reached! 🎉';
        return;
    }
    
    // Calculate time units
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    const totalSeconds = Math.floor(timeRemaining / 1000);
    
    // Format numbers with leading zeros
    const formattedDays = String(days).padStart(2, '0');
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    
    // Add pulse animation when values change
    updateElementWithAnimation(daysElement, formattedDays, 'days');
    updateElementWithAnimation(hoursElement, formattedHours, 'hours');
    updateElementWithAnimation(minutesElement, formattedMinutes, 'minutes');
    updateElementWithAnimation(secondsElement, formattedSeconds, 'seconds');
    
    // Update total seconds with formatting
    totalSecondsElement.textContent = totalSeconds.toLocaleString();
    
    // Store current values for next comparison
    previousValues = {
        days: formattedDays,
        hours: formattedHours,
        minutes: formattedMinutes,
        seconds: formattedSeconds
    };
}

function updateElementWithAnimation(element, newValue, type) {
    const oldValue = previousValues[type];
    
    if (oldValue !== null && oldValue !== newValue) {
        // Add pulse animation when value changes
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, 1000);
    }
    
    element.textContent = newValue;
}

// Function to update target date based on user input
function updateTargetDate() {
    const inputValue = targetDateInput.value;
    
    if (!inputValue) {
        alert('Please select a target date and time');
        return;
    }
    
    const newTargetDate = new Date(inputValue).getTime();
    const now = new Date().getTime();
    
    if (newTargetDate <= now) {
        alert('Please select a future date and time');
        return;
    }
    
    targetDate = newTargetDate;
    
    // Update the display
    const targetDateObj = new Date(targetDate);
    const formattedDate = targetDateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    dateInfo.textContent = `Target: ${formattedDate}`;
    countdownTitle.textContent = 'Time Until Your Target Date';
    
    // Immediately update countdown
    updateCountdown();
    
    console.log(`Target date updated to: ${formattedDate}`);
}

// Function to set default date input value to current target
function initializeDateInput() {
    const currentTarget = new Date(targetDate);
    const formattedInput = currentTarget.toISOString().slice(0, 16); // Format for datetime-local input
    targetDateInput.value = formattedInput;
    
    // Update initial display
    const formattedDate = currentTarget.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    dateInfo.textContent = `Target: ${formattedDate}`;
}

// Function to calculate age-based statistics (like in the first image)
function calculateAgeStatistics() {
    const birthDate = new Date('2001-07-08');
    const thirtiethBirthday = new Date('2031-07-08');
    const averageLifespan = 70; // years
    
    const now = new Date();
    const currentAge = (now - birthDate) / (1000 * 60 * 60 * 24 * 365.25);
    const remainingTime = thirtiethBirthday - now;
    const remainingSeconds = Math.floor(remainingTime / 1000);
    
    console.log(`Current age: ${currentAge.toFixed(1)} years`);
    console.log(`Seconds until 30: ${remainingSeconds.toLocaleString()}`);
    console.log(`Average lifespan target: ${averageLifespan} years`);
    
    return {
        currentAge: currentAge.toFixed(1),
        remainingSeconds: remainingSeconds,
        averageLifespan: averageLifespan
    };
}

// Initialize countdown
updateCountdown();

// Update every second
setInterval(updateCountdown, 1000);

// Log statistics on page load
window.addEventListener('load', () => {
    // Initialize date input with current target date
    initializeDateInput();
    
    // Add event listener for update button
    updateDateBtn.addEventListener('click', updateTargetDate);
    
    // Also allow Enter key to update date
    targetDateInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            updateTargetDate();
        }
    });
    
    const stats = calculateAgeStatistics();
    console.log('Age Statistics:', stats);
    
    // Add a subtle fade-in animation to the main elements
    setTimeout(() => {
        document.querySelector('.globe-container').style.opacity = '1';
        document.querySelector('.countdown-container').style.opacity = '1';
        document.querySelector('.info-section').style.opacity = '1';
        document.querySelector('.date-input-section').style.opacity = '1';
    }, 100);
});

// Add some interactive effects
document.querySelectorAll('.countdown-number').forEach(element => {
    element.addEventListener('mouseenter', () => {
        element.style.transform = 'scale(1.05)';
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1)';
    });
});

// Add click effect to globe
document.querySelector('.globe').addEventListener('click', () => {
    const globe = document.querySelector('.globe');
    globe.style.animation = 'none';
    globe.offsetHeight; // Trigger reflow
    globe.style.animation = 'rotate 2s linear infinite';
    
    setTimeout(() => {
        globe.style.animation = 'rotate 20s linear infinite';
    }, 2000);
});

// Performance optimization: Use requestAnimationFrame for smooth animations
let animationFrame;

function smoothUpdate() {
    updateCountdown();
    animationFrame = requestAnimationFrame(() => {
        setTimeout(smoothUpdate, 1000);
    });
}

// Optional: Replace setInterval with requestAnimationFrame for better performance
// smoothUpdate(); 