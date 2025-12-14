// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const greetingId = urlParams.get('id');
const isPreview = urlParams.get('preview') === 'true';
const animationsEnabled = urlParams.get('animations') !== 'false';

let greetingData = null;

// Load greeting data
async function loadGreeting() {
    if (isPreview) {
        // Load from sessionStorage for preview
        const previewData = sessionStorage.getItem('previewData');
        if (previewData) {
            greetingData = JSON.parse(previewData);
            renderGreeting();
            return;
        }
    }

    if (greetingId) {
        try {
            const response = await fetch(`/api/get-greeting?id=${greetingId}`);
            if (!response.ok) {
                throw new Error('Greeting not found');
            }
            greetingData = await response.json();
            renderGreeting();
        } catch (error) {
            console.error('Error loading greeting:', error);
            document.body.innerHTML = '<div style="text-align: center; padding: 50px;"><h1>Greeting Not Found</h1><p>The greeting you are looking for does not exist.</p><a href="index.html">Go Home</a></div>';
        }
    } else {
        // Default greeting
        greetingData = {
            recipientName: 'Dear Friend',
            greetingType: 'birthday',
            customGreeting: '',
            dateText: '',
            imageUrl: './assets/images/default-avatar.png',
            messageTitle: 'To You!',
            messageText: 'Happy birthday! Wishing you all the joy and happiness in the world!',
            buttonText: 'Click Here'
        };
        renderGreeting();
    }
}

// Render greeting
function renderGreeting() {
    if (!greetingData) return;

    // Set recipient name
    const recipientNameEl = document.getElementById('recipientName');
    if (recipientNameEl) {
        recipientNameEl.textContent = greetingData.recipientName;
    }

    // Set image
    const recipientImageEl = document.getElementById('recipientImage');
    if (recipientImageEl) {
        recipientImageEl.src = greetingData.imageUrl;
        recipientImageEl.onerror = function() {
            this.src = './assets/images/default-avatar.png';
        };
    }

    // Set date
    const dateTextEl = document.getElementById('dateText');
    if (dateTextEl && greetingData.dateText) {
        dateTextEl.textContent = greetingData.dateText;
    }

    // Set button text
    const buttonTextEl = document.getElementById('buttonText');
    if (buttonTextEl) {
        buttonTextEl.textContent = greetingData.buttonText;
    }

    // Set greeting title
    const greetingText = getGreetingText();
    const happyTitle = document.getElementById('happyTitle');
    const birthdayTitle = document.getElementById('birthdayTitle');
    
    if (happyTitle && birthdayTitle) {
        const words = greetingText.split(' ');
        const firstWord = words[0] || 'Happy';
        const restWords = words.slice(1).join(' ') || 'Birthday';
        
        happyTitle.innerHTML = firstWord.split('').map((char, i) => 
            `<span style="--t: ${4 + i * 0.2}s;">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
        
        birthdayTitle.innerHTML = restWords.split('').map((char, i) => 
            `<span style="--t: ${5 + i * 0.2}s;">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
    }

    // Set modal content
    const modalImage = document.getElementById('modalImage');
    if (modalImage) {
        modalImage.src = greetingData.imageUrl;
        modalImage.onerror = function() {
            this.src = './assets/images/default-avatar.png';
        };
    }

    const modalRecipient = document.getElementById('modalRecipient');
    if (modalRecipient) {
        modalRecipient.textContent = `To: ${greetingData.recipientName} 💖`;
    }

    const modalGreeting = document.getElementById('modalGreeting');
    if (modalGreeting) {
        modalGreeting.textContent = greetingText;
    }

    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
        modalTitle.textContent = greetingData.messageTitle;
    }

    const modalMessage = document.getElementById('modalMessage');
    if (modalMessage) {
        modalMessage.textContent = greetingData.messageText;
    }

    // Disable animations if needed
    if (!animationsEnabled) {
        document.getElementById('wrapper').classList.add('no-animations');
    }
}

// Get greeting text based on type
function getGreetingText() {
    if (greetingData.greetingType === 'custom' && greetingData.customGreeting) {
        return greetingData.customGreeting;
    }
    
    const greetings = {
        'birthday': 'Happy Birthday',
        'anniversary': 'Happy Anniversary',
        'congratulations': 'Congratulations'
    };
    
    return greetings[greetingData.greetingType] || 'Happy Birthday';
}

// Letter button click handler
const btnLetter = document.getElementById('btn__letter');
if (btnLetter) {
    btnLetter.addEventListener('click', function() {
        const boxMail = document.querySelector('.boxMail');
        if (boxMail) {
            boxMail.classList.add('active');
        }
    });
}

// Close modal
const closeBtn = document.querySelector('.fa-xmark');
if (closeBtn) {
    closeBtn.addEventListener('click', function() {
        const boxMail = document.querySelector('.boxMail');
        if (boxMail) {
            boxMail.classList.remove('active');
        }
    });
}

// Load greeting on page load
loadGreeting();

