// Supabase Configuration
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client (you'll need to include the Supabase JS library)
// For now, we'll use fetch API directly

let animationsEnabled = true;
let isMobileView = false;
let currentGreetingId = null;
let uploadedImageUrl = null;

// Sidebar Toggle
const sidebar = document.getElementById('editSidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

if (sidebar && sidebarToggle) {
    const sidebarIcon = sidebarToggle.querySelector('i');
    if (sidebarIcon) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            if (sidebar.classList.contains('collapsed')) {
                sidebarIcon.classList.remove('fa-chevron-right');
                sidebarIcon.classList.add('fa-chevron-left');
            } else {
                sidebarIcon.classList.remove('fa-chevron-left');
                sidebarIcon.classList.add('fa-chevron-right');
            }
        });
    }
}

// Handle custom greeting option
const greetingTypeEl = document.getElementById('greetingType');
if (greetingTypeEl) {
    greetingTypeEl.addEventListener('change', function() {
        const customGroup = document.getElementById('customGreetingGroup');
        if (customGroup) {
            if (this.value === 'custom') {
                customGroup.style.display = 'block';
            } else {
                customGroup.style.display = 'none';
            }
        }
        updatePreview();
    });
}

// Handle image file upload
const imageFileEl = document.getElementById('imageFile');
if (imageFileEl) {
    imageFileEl.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                this.value = '';
                return;
            }
            
            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                alert('Image file is too large. Please select an image smaller than 5MB');
                this.value = '';
                return;
            }
            
            // Show preview
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('imagePreview');
                const previewImg = document.getElementById('previewImg');
                if (preview && previewImg) {
                    previewImg.src = e.target.result;
                    preview.style.display = 'block';
                }
            };
            reader.readAsDataURL(file);
            
            // Upload to Supabase Storage
            try {
                uploadedImageUrl = await uploadImageToSupabase(file);
                const imageUrlEl = document.getElementById('imageUrl');
                if (imageUrlEl) {
                    imageUrlEl.value = uploadedImageUrl;
                }
                updatePreview();
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Error uploading image. Please try again or use an image URL.');
            }
        }
    });
}

// Upload image to Supabase Storage
async function uploadImageToSupabase(file) {
    const fileName = `${Date.now()}_${file.name}`;
    const formData = new FormData();
    formData.append('file', file);
    
    // Call API route to upload
    const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        throw new Error('Upload failed');
    }
    
    const data = await response.json();
    return data.url;
}

// View mode toggle
const viewToggleBtn = document.getElementById('viewToggleBtn');
const viewToggleIcon = document.getElementById('viewToggleIcon');
const viewToggleText = document.getElementById('viewToggleText');
const greetingPreview = document.getElementById('greetingPreview');

if (viewToggleBtn && viewToggleIcon && viewToggleText && greetingPreview) {
    viewToggleBtn.addEventListener('click', function() {
        isMobileView = !isMobileView;
        if (isMobileView) {
            greetingPreview.classList.remove('aspect-ratio-desktop');
            greetingPreview.classList.add('aspect-ratio-mobile');
            viewToggleIcon.classList.remove('fa-desktop');
            viewToggleIcon.classList.add('fa-mobile-screen-button');
            viewToggleText.textContent = 'Mobile (19.5:9)';
        } else {
            greetingPreview.classList.remove('aspect-ratio-mobile');
            greetingPreview.classList.add('aspect-ratio-desktop');
            viewToggleIcon.classList.remove('fa-mobile-screen-button');
            viewToggleIcon.classList.add('fa-desktop');
            viewToggleText.textContent = 'Desktop (16:9)';
        }
        setTimeout(function() {
            scaleIframeContent();
        }, 100);
    });
}

// Animation toggle
const animationToggle = document.getElementById('animationToggle');
const animationToggleIcon = document.getElementById('animationToggleIcon');
const animationToggleText = document.getElementById('animationToggleText');

if (animationToggle && animationToggleIcon && animationToggleText) {
    animationToggle.addEventListener('click', function() {
        animationsEnabled = !animationsEnabled;
        if (animationsEnabled) {
            animationToggleIcon.classList.remove('fa-pause');
            animationToggleIcon.classList.add('fa-play');
            animationToggleText.textContent = 'Animations On';
            this.classList.remove('animations-off');
        } else {
            animationToggleIcon.classList.remove('fa-play');
            animationToggleIcon.classList.add('fa-pause');
            animationToggleText.textContent = 'Animations Off';
            this.classList.add('animations-off');
        }
        updatePreview();
    });
}

// Update preview function
function updatePreview() {
    const iframe = document.getElementById('previewIframe');
    if (!iframe) {
        console.error('Preview iframe not found');
        return;
    }

    const recipientName = document.getElementById('recipientName')?.value || 'Dear Friend';
    const greetingType = document.getElementById('greetingType')?.value || 'birthday';
    const customGreeting = document.getElementById('customGreeting')?.value || '';
    const dateText = document.getElementById('dateText')?.value || '';
    const imageUrl = document.getElementById('imageUrl')?.value || uploadedImageUrl || './assets/images/default-avatar.png';
    const messageTitle = document.getElementById('messageTitle')?.value || 'To You!';
    const messageText = document.getElementById('messageText')?.value || '';
    const buttonText = document.getElementById('buttonText')?.value || 'Click Here';

    // Prepare greeting data
    const greetingData = {
        recipientName: recipientName,
        greetingType: greetingType,
        customGreeting: customGreeting,
        dateText: dateText,
        imageUrl: imageUrl,
        messageTitle: messageTitle,
        messageText: messageText,
        buttonText: buttonText
    };

    // Store in sessionStorage for preview
    sessionStorage.setItem('previewData', JSON.stringify(greetingData));
    
    // Load preview in iframe
    const iframeSrc = `view.html?preview=true&animations=${animationsEnabled}`;
    
    if (isMobileView) {
        iframe.style.width = '600px';
        iframe.style.height = '1100px';
    } else {
        iframe.style.width = '1200px';
        iframe.style.height = '800px';
    }
    
    iframe.src = iframeSrc;
    
    iframe.onload = function() {
        setTimeout(scaleIframeContent, 100);
    };
}

// Scale iframe content
function scaleIframeContent() {
    const iframe = document.getElementById('previewIframe');
    const previewContainer = document.getElementById('greetingPreview');
    
    if (!iframe || !previewContainer) return;
    
    try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (!iframeDoc) return;
        
        const containerWidth = previewContainer.offsetWidth;
        const containerHeight = previewContainer.offsetHeight;
        
        if (containerWidth === 0 || containerHeight === 0) return;
        
        let baseWidth, baseHeight;
        if (isMobileView) {
            baseWidth = 600;
            baseHeight = 1100;
        } else {
            baseWidth = 1200;
            baseHeight = 800;
        }
        
        if (iframeDoc.documentElement) {
            iframeDoc.documentElement.style.width = baseWidth + 'px';
            iframeDoc.documentElement.style.height = baseHeight + 'px';
            iframeDoc.documentElement.style.margin = '0';
            iframeDoc.documentElement.style.padding = '0';
            iframeDoc.documentElement.style.overflow = 'hidden';
        }
        
        if (iframeDoc.body) {
            iframeDoc.body.style.width = baseWidth + 'px';
            iframeDoc.body.style.height = baseHeight + 'px';
            iframeDoc.body.style.margin = '0';
            iframeDoc.body.style.padding = '0';
            iframeDoc.body.style.overflow = 'hidden';
        }
        
        setTimeout(function() {
            const safeZonePadding = 16;
            const availableWidth = Math.max(containerWidth - safeZonePadding, baseWidth);
            const availableHeight = Math.max(containerHeight - safeZonePadding, baseHeight);
            
            const scaleX = (availableWidth * 0.95) / baseWidth;
            const scaleY = (availableHeight * 0.95) / baseHeight;
            const scale = Math.min(scaleX, scaleY);
            
            if (isNaN(scale) || scale <= 0) return;
            
            iframe.style.transform = `scale(${scale})`;
            iframe.style.transformOrigin = 'top center';
            iframe.style.width = baseWidth + 'px';
            iframe.style.height = baseHeight + 'px';
            
            previewContainer.style.display = 'flex';
            previewContainer.style.justifyContent = 'center';
            previewContainer.style.alignItems = 'flex-start';
        }, 150);
    } catch (e) {
        console.warn('Could not access iframe content:', e.name);
    }
}

// Update preview on input changes
['recipientName', 'greetingType', 'customGreeting', 'dateText', 'imageUrl', 'messageTitle', 'messageText', 'buttonText'].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('input', updatePreview);
    }
});

// Save greeting
const saveBtn = document.getElementById('saveBtn');
if (saveBtn) {
    saveBtn.addEventListener('click', async function() {
        const recipientName = document.getElementById('recipientName')?.value || 'Dear Friend';
        const greetingType = document.getElementById('greetingType')?.value || 'birthday';
        const customGreeting = document.getElementById('customGreeting')?.value || '';
        const dateText = document.getElementById('dateText')?.value || '';
        const imageUrl = document.getElementById('imageUrl')?.value || uploadedImageUrl || './assets/images/default-avatar.png';
        const messageTitle = document.getElementById('messageTitle')?.value || 'To You!';
        const messageText = document.getElementById('messageText')?.value || '';
        const buttonText = document.getElementById('buttonText')?.value || 'Click Here';

        if (!recipientName.trim()) {
            alert('Please enter a recipient name');
            return;
        }

        if (greetingType === 'custom' && !customGreeting.trim()) {
            alert('Please enter a custom greeting');
            return;
        }

        const greetingData = {
            recipientName: recipientName,
            greetingType: greetingType,
            customGreeting: customGreeting,
            dateText: dateText,
            imageUrl: imageUrl,
            messageTitle: messageTitle,
            messageText: messageText,
            buttonText: buttonText
        };

        try {
            // Save to Supabase
            const response = await fetch('/api/create-greeting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(greetingData)
            });

            if (!response.ok) {
                throw new Error('Failed to save greeting');
            }

            const data = await response.json();
            currentGreetingId = data.id;
            
            // Show share modal
            const shareLink = `${window.location.origin}/view.html?id=${data.id}`;
            document.getElementById('shareLink').value = shareLink;
            document.getElementById('shareModal').style.display = 'block';
        } catch (error) {
            console.error('Error saving greeting:', error);
            alert('Error saving greeting. Please try again.');
        }
    });
}

// Preview button
const previewBtn = document.getElementById('previewBtn');
if (previewBtn) {
    previewBtn.addEventListener('click', function() {
        updatePreview();
        const previewData = sessionStorage.getItem('previewData');
        if (previewData) {
            window.open(`view.html?preview=true`, '_blank');
        }
    });
}

// Close share modal
function closeShareModal() {
    document.getElementById('shareModal').style.display = 'none';
}

// Copy share link
function copyShareLink() {
    const shareLink = document.getElementById('shareLink');
    shareLink.select();
    document.execCommand('copy');
    alert('Link copied to clipboard!');
}

// Share functions
function shareOnWhatsApp() {
    const link = document.getElementById('shareLink').value;
    window.open(`https://wa.me/?text=${encodeURIComponent(link)}`, '_blank');
}

function shareOnFacebook() {
    const link = document.getElementById('shareLink').value;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, '_blank');
}

function shareOnTwitter() {
    const link = document.getElementById('shareLink').value;
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}`, '_blank');
}

function viewGreeting() {
    const link = document.getElementById('shareLink').value;
    window.open(link, '_blank');
}

// Tool buttons functionality
document.querySelectorAll('.toolbar-btn[data-tool]').forEach(btn => {
    btn.addEventListener('click', function() {
        const tool = this.getAttribute('data-tool');
        selectTool(tool);
    });
});

// Select tool function
function selectTool(tool) {
    // Remove active class from all buttons
    document.querySelectorAll('.toolbar-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected button
    const selectedBtn = document.querySelector(`[data-tool="${tool}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
    
    currentTool = tool;
    
    // Handle tool-specific actions
    handleToolAction(tool);
}

// Handle tool actions
function handleToolAction(tool) {
    switch(tool) {
        case 'select':
            console.log('Selection tool activated');
            break;
        case 'rectangle':
            console.log('Rectangle tool activated');
            break;
        case 'diamond':
            console.log('Diamond tool activated');
            break;
        case 'circle':
            console.log('Circle tool activated');
            break;
        case 'arrow':
            console.log('Arrow tool activated');
            break;
        case 'line':
            console.log('Line tool activated');
            break;
        case 'pen':
            console.log('Pen tool activated');
            break;
        case 'text':
            console.log('Text tool activated');
            break;
        case 'image':
            console.log('Image tool activated');
            document.getElementById('imageFile')?.click();
            break;
        case 'eraser':
            console.log('Eraser tool activated');
            break;
        case 'shapes':
            console.log('Shapes library activated');
            break;
        case 'lock':
            console.log('Lock tool activated');
            break;
        case 'hand':
            console.log('Hand tool activated');
            break;
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Don't trigger shortcuts when typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    const key = e.key.toLowerCase();
    const shortcuts = {
        '1': 'select',
        '2': 'rectangle',
        '3': 'diamond',
        '4': 'circle',
        '5': 'arrow',
        '6': 'line',
        '7': 'pen',
        '8': 'text',
        '9': 'image',
        '0': 'eraser',
        's': 'shapes',
        'h': 'hand'
    };
    
    if (shortcuts[key]) {
        e.preventDefault();
        selectTool(shortcuts[key]);
    }
});

// Initialize with select tool
selectTool('select');

// Initial preview
updatePreview();

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        scaleIframeContent();
    }, 250);
});

