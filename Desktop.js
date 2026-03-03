/* ---------- Clock ---------- */

function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    setInterval(updateClock, 1000);
    updateClock();


// Array om alle open popups bij te houden
const openPopups = [];

// Sluit alle open popups
function closeAllPopups() {
    openPopups.forEach(popup => {
        if (popup && popup.parentNode) {
            popup.remove();
        }
    });
    openPopups.length = 0;
}

// Toon extra popups voor korte versie - allemaal tegelijk
document.addEventListener('DOMContentLoaded', () => {
    showAllPopups();
    showNavigationGuide();
});

// Toon alle popups automatisch
function showAllPopups() {
    const popups = [
        {
            title: 'About Me',
            content: 'Hi, I\'m Fayline, a passionate junior Game Software Developer with a love for rich single-player experiences and action-packed gameplay. I combine technical curiosity with strong planning skills and the ability to motivate teams and connect socially. Looking for opportunities to gain experience in Unity projects and contribute to memorable game experiences.',
            key: 'aboutMe'
        },
        {
            title: 'Projects',
            content: 'Loading projects...',
            contentType: 'html',
            key: 'projects'
        },
        {
            title: 'Sweden',
            content: '<img src="Maps/Zweden/GroepsFotoZweden.png" alt="Sweden Project" style="width:100%; height: auto; border-radius:5px; margin-bottom: 15px;"><h3>The Offline Connection</h3><p>A collaborative project where students from Sweden and Amsterdam work together to build a game. This international partnership focuses on creating innovative gaming experiences through cultural exchange and shared development practices.</p>',
            contentType: 'html',
            key: 'sweden'
        }
    ];
    
    // Load saved popup states
    const savedPopups = JSON.parse(localStorage.getItem('portfolioPopups')) || {};
    
    // Plan all positions first before creating popups
    const plannedPositions = [];
    
    popups.forEach((popup, index) => {
        // Skip if popup was closed (except persistent popups)
        if (savedPopups[popup.key] === false && !popup.persistent) {
            return;
        }
        
        let randomTop, randomLeft;
        const popupWidth = popup.key === 'projects' ? 400 : 400;
        const popupHeight = popup.key === 'projects' ? 300 : 200;
        
        // Use saved position or calculate new one
        if (savedPopups[popup.key] && savedPopups[popup.key].top !== undefined) {
            randomTop = savedPopups[popup.key].top;
            randomLeft = savedPopups[popup.key].left;
            
            // Clamp saved position to screen bounds
            const maxTop = window.innerHeight - popupHeight - 70;
            const maxLeft = window.innerWidth - popupWidth - 20;
            
            randomTop = Math.max(10, Math.min(randomTop, maxTop));
            randomLeft = Math.max(10, Math.min(randomLeft, maxLeft));
        } else {
            // Calculate position based on popup index to avoid overlap
            const padding = 20;
            const availableHeight = window.innerHeight - popupHeight - 100;
            const availableWidth = window.innerWidth - popupWidth - 50;
            
            // Position popups in different areas with more spread
            const positions = [
                { top: 50, left: 50 },                                          // Top-left (About Me)
                { top: 50, left: availableWidth - 50 },                         // Top-right (Projects)
                { top: availableHeight / 2 + 50, left: availableWidth / 3 },   // Middle-left (Sweden)
                { top: availableHeight / 2 + 50, left: availableWidth * 2 / 3 } // Middle-right (Navigation)
            ];
            
            if (index < positions.length) {
                randomTop = Math.max(10, Math.min(
                    positions[index].top,
                    window.innerHeight - popupHeight - 70
                ));
                
                randomLeft = Math.max(10, Math.min(
                    positions[index].left,
                    window.innerWidth - popupWidth - 20
                ));
            } else {
                // Fallback for more than 4 popups
                randomTop = Math.max(10, Math.min(
                    50 + (index * 100),
                    window.innerHeight - popupHeight - 70
                ));
                
                randomLeft = Math.max(10, Math.min(
                    50 + (index * 150),
                    window.innerWidth - popupWidth - 20
                ));
            }
            
            // Add some randomness
            randomTop += Math.random() * 20 - 10;
            randomLeft += Math.random() * 20 - 10;
            
            randomTop = Math.max(10, Math.min(randomTop, window.innerHeight - popupHeight - 70));
            randomLeft = Math.max(10, Math.min(randomLeft, window.innerWidth - popupWidth - 20));
        }
        
        plannedPositions.push({
            key: popup.key,
            top: randomTop,
            left: randomLeft,
            width: popupWidth,
            height: popupHeight
        });
    });
    
    // Now create popups with planned positions
    plannedPositions.forEach((planned, index) => {
        const popup = popups.find(p => p.key === planned.key);
        
        const modal = document.createElement('div');
        
        modal.style.cssText = `
            position: fixed;
            top: ${planned.top}px;
            left: ${planned.left}px;
            width: ${planned.width}px;
            min-height: ${planned.height}px;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            z-index: ${2001 + index};
            resize: both;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;
        
        // Restore saved size if available
        if (savedPopups[popup.key] && savedPopups[popup.key].width) {
            modal.style.width = savedPopups[popup.key].width + 'px';
        }
        if (savedPopups[popup.key] && savedPopups[popup.key].height) {
            modal.style.minHeight = savedPopups[popup.key].height + 'px';
        }
        
        // Header voor dragging
        const header = document.createElement('div');
        header.style.cssText = `
            background: #2196F3;
            color: white;
            padding: 10px;
            margin: -20px -20px 15px -20px;
            border-radius: 10px 10px 0 0;
            cursor: move;
            user-select: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
        `;
        
        // Titel
        const titleSpan = document.createElement('span');
        titleSpan.textContent = popup.title;
        header.appendChild(titleSpan);
        
        // Sluit knop
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
            background: transparent;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        header.appendChild(closeBtn);
        
        // Resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.style.cssText = `
            position: absolute;
            bottom: 0;
            right: 0;
            width: 20px;
            height: 20px;
            background: #2196F3;
            cursor: nwse-resize;
            border-radius: 0 0 10px 0;
        `;
        modal.appendChild(resizeHandle);
        
        // Content
        const content = document.createElement('div');
        content.style.cssText = `
            padding: 15px;
            line-height: 1.6;
            color: black;
            overflow-y: auto;
            flex: 1;
            min-height: 0;
            word-wrap: break-word;
        `;
        
        // Add styles for responsive content
        const styleTag = document.createElement('style');
        styleTag.textContent = `
            .popup-content h3 {
                font-size: clamp(14px, 2vw, 18px);
                margin: 15px 0 10px 0;
            }
            .popup-content p {
                font-size: clamp(12px, 1.8vw, 14px);
                margin: 10px 0;
            }
            .popup-content img {
                width: 100%;
                height: auto;
                border-radius: 5px;
                margin: 10px 0;
            }
            .popup-content button {
                font-size: clamp(11px, 1.5vw, 13px);
            }
        `;
        if (!document.querySelector('style[data-popup-styles]')) {
            styleTag.setAttribute('data-popup-styles', 'true');
            document.head.appendChild(styleTag);
        }
        
        content.className = 'popup-content';
        
        if (popup.contentType === 'html') {
            // For Projects and Sweden - create HTML content
            if (popup.key === 'projects') {
                const projectsHTML = `
                    <h3>SwedenProject</h3>
                    <p>A local multiplayer party game set in the 1600s during Dutch-Swedish tensions. Players gather resources, trade locally, and complete minigames.</p>
                    <img src="DubleAlliance/DubbleAlliance.png" alt="SwedenProject" style="width:100%; border-radius:5px; margin:10px 0;">
                    <button onclick="openProjectDocs('SwedenProject')" style="color: #2196F3; background: none; border: none; cursor: pointer; text-decoration: underline; font-weight: bold;">View Full Project →</button>
                    
                    <h3 style="margin-top: 15px;">OperationStarfall</h3>
                    <p>Developed with professional Agile practices. A fast-paced action game with dynamic gameplay mechanics.</p>
                    <img src="NeonFendingmachine/NEON.png" alt="OperationStarfall" style="width:100%; border-radius:5px; margin:10px 0;">
                    <button onclick="openProjectDocs('OperationStarfall')" style="color: #2196F3; background: none; border: none; cursor: pointer; text-decoration: underline; font-weight: bold;">View Full Project →</button>
                    
                    <h3 style="margin-top: 15px;">MyProjects</h3>
                    <p>Personal game development projects showcasing various mechanics and gameplay systems.</p>
                    <button onclick="openProjectDocs('MyProjects')" style="color: #2196F3; background: none; border: none; cursor: pointer; text-decoration: underline; font-weight: bold;">View Full Project →</button>
                `;
                content.innerHTML = projectsHTML;
            } else if (popup.key === 'sweden') {
                content.innerHTML = popup.content;
            }
        } else {
            content.textContent = popup.content;
        }
        
        modal.appendChild(header);
        modal.appendChild(content);
        document.body.appendChild(modal);
        openPopups.push(modal);
        
        // Draggable functionaliteit
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        
        header.addEventListener('mousedown', (e) => {
            if (e.target !== closeBtn) {
                isDragging = true;
                offsetX = e.clientX - modal.offsetLeft;
                offsetY = e.clientY - modal.offsetTop;
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                let newLeft = e.clientX - offsetX;
                let newTop = e.clientY - offsetY;
                
                // Zorg dat popup niet uit beeld gaat
                newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - modal.offsetWidth));
                newTop = Math.max(0, Math.min(newTop, window.innerHeight - modal.offsetHeight));
                
                modal.style.left = newLeft + 'px';
                modal.style.top = newTop + 'px';
                
                // Save position
                const popupState = JSON.parse(localStorage.getItem('portfolioPopups')) || {};
                popupState[popup.key] = {
                    top: newTop,
                    left: newLeft,
                    width: parseInt(modal.style.width),
                    height: parseInt(modal.style.minHeight)
                };
                localStorage.setItem('portfolioPopups', JSON.stringify(popupState));
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // Resize functionaliteit
        let isResizing = false;
        let startX, startY, startWidth, startHeight;
        
        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = modal.offsetWidth;
            startHeight = modal.offsetHeight;
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isResizing) {
                const newWidth = Math.max(300, startWidth + (e.clientX - startX));
                const newHeight = Math.max(150, startHeight + (e.clientY - startY));
                
                modal.style.width = newWidth + 'px';
                modal.style.minHeight = newHeight + 'px';
                
                // Save size
                const popupState = JSON.parse(localStorage.getItem('portfolioPopups')) || {};
                if (!popupState[popup.key] || typeof popupState[popup.key] !== 'object') {
                    popupState[popup.key] = {};
                }
                popupState[popup.key].width = newWidth;
                popupState[popup.key].height = newHeight;
                localStorage.setItem('portfolioPopups', JSON.stringify(popupState));
            }
        });
        
        document.addEventListener('mouseup', () => {
            isResizing = false;
        });
        
        // Sluiten knop
        closeBtn.addEventListener('click', () => {
            modal.remove();
            openPopups.splice(openPopups.indexOf(modal), 1);
            
            // Save that this popup was closed (not for persistent popups)
            if (!popup.persistent) {
                const popupState = JSON.parse(localStorage.getItem('portfolioPopups')) || {};
                popupState[popup.key] = false;
                localStorage.setItem('portfolioPopups', JSON.stringify(popupState));
            }
        });
    });
    
    // Save current open popups
    const popupState = JSON.parse(localStorage.getItem('portfolioPopups')) || {};
    popups.forEach(popup => {
        // Only set to true if not already false and not an object with position data
        if (popupState[popup.key] !== false && typeof popupState[popup.key] !== 'object') {
            popupState[popup.key] = true;
        }
    });
    localStorage.setItem('portfolioPopups', JSON.stringify(popupState));
}

// Open project documentation
function openProjectDocs(projectName) {
    window.location.href = `Unity/Unity.html?project=${projectName}`;
}

// Show persistent navigation guide
function showNavigationGuide() {
    const savedPopups = JSON.parse(localStorage.getItem('portfolioPopups')) || {};
    
    // Only create if not already in openPopups
    if (openPopups.some(p => p.dataset.popupKey === 'navigation')) {
        return;
    }
    
    const navigationPopup = {
        title: 'Navigation Guide',
        content: '<h3>Taskbar Navigation</h3><p><strong>🏠 Home (Windows):</strong> Returns to the main portfolio page with these help popups</p><p><strong>💬 About Me (Discord):</strong> Learn more about Fayline and her background as a game developer</p><p><strong>🎮 Projects (Unity Hub):</strong> Explore game development projects including SwedenProject, OperationStarfall, and more</p><p><strong>🔗 Github:</strong> <a href="https://github.com/fay0907" target="_blank" style="color: #2196F3; text-decoration: none;">Visit my GitHub profile</a> to see my repositories and open-source contributions</p><p><strong>🗺️ International Projects (Maps):</strong> Information about "The Offline Connection" collaborative project with Sweden and other international mapping initiatives</p><p>Click on any popup\'s blue header to drag it. Use the blue handle in the bottom-right corner to resize.</p>',
        contentType: 'html',
        key: 'navigation',
        persistent: true
    };
    
    let randomTop, randomLeft;
    const popupWidth = 400;
    const popupHeight = 200;
    
    if (savedPopups['navigation'] && savedPopups['navigation'].top !== undefined) {
        randomTop = savedPopups['navigation'].top;
        randomLeft = savedPopups['navigation'].left;
    } else {
        const availableHeight = window.innerHeight - popupHeight - 100;
        const availableWidth = window.innerWidth - popupWidth - 50;
        
        randomTop = Math.max(10, Math.min(
            availableHeight / 2 + 50,
            window.innerHeight - popupHeight - 70
        ));
        
        randomLeft = Math.max(10, Math.min(
            availableWidth * 2 / 3,
            window.innerWidth - popupWidth - 20
        ));
        
        randomTop += Math.random() * 20 - 10;
        randomLeft += Math.random() * 20 - 10;
        
        randomTop = Math.max(10, Math.min(randomTop, window.innerHeight - popupHeight - 70));
        randomLeft = Math.max(10, Math.min(randomLeft, window.innerWidth - popupWidth - 20));
    }
    
    const modal = document.createElement('div');
    modal.dataset.popupKey = 'navigation';
    
    modal.style.cssText = `
        position: fixed;
        top: ${randomTop}px;
        left: ${randomLeft}px;
        width: ${popupWidth}px;
        min-height: ${popupHeight}px;
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        z-index: 2050;
        resize: both;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    `;
    
    if (savedPopups['navigation'] && savedPopups['navigation'].width) {
        modal.style.width = savedPopups['navigation'].width + 'px';
    }
    if (savedPopups['navigation'] && savedPopups['navigation'].height) {
        modal.style.minHeight = savedPopups['navigation'].height + 'px';
    }
    
    // Header
    const header = document.createElement('div');
    header.style.cssText = `
        background: #2196F3;
        color: white;
        padding: 10px;
        margin: -20px -20px 15px -20px;
        border-radius: 10px 10px 0 0;
        cursor: move;
        user-select: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
    `;
    
    const titleSpan = document.createElement('span');
    titleSpan.textContent = navigationPopup.title;
    header.appendChild(titleSpan);
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
        background: transparent;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    header.appendChild(closeBtn);
    
    // Content
    const content = document.createElement('div');
    content.style.cssText = `
        padding: 15px;
        line-height: 1.6;
        color: black;
        overflow-y: auto;
        flex: 1;
        min-height: 0;
        word-wrap: break-word;
    `;
    content.className = 'popup-content';
    content.innerHTML = navigationPopup.content;
    
    modal.appendChild(header);
    modal.appendChild(content);
    document.body.appendChild(modal);
    openPopups.push(modal);
    
    // Dragging
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    
    header.addEventListener('mousedown', (e) => {
        if (e.target !== closeBtn) {
            isDragging = true;
            offsetX = e.clientX - modal.offsetLeft;
            offsetY = e.clientY - modal.offsetTop;
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;
            
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - modal.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - modal.offsetHeight));
            
            modal.style.left = newLeft + 'px';
            modal.style.top = newTop + 'px';
            
            const popupState = JSON.parse(localStorage.getItem('portfolioPopups')) || {};
            popupState['navigation'] = {
                top: newTop,
                left: newLeft,
                width: parseInt(modal.style.width),
                height: parseInt(modal.style.minHeight)
            };
            localStorage.setItem('portfolioPopups', JSON.stringify(popupState));
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.style.cssText = `
        position: absolute;
        bottom: 0;
        right: 0;
        width: 20px;
        height: 20px;
        background: #2196F3;
        cursor: nwse-resize;
        border-radius: 0 0 10px 0;
    `;
    modal.appendChild(resizeHandle);
    
    // Resize
    let isResizing = false;
    let startX, startY, startWidth, startHeight;
    
    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = modal.offsetWidth;
        startHeight = modal.offsetHeight;
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isResizing) {
            const newWidth = Math.max(300, startWidth + (e.clientX - startX));
            const newHeight = Math.max(150, startHeight + (e.clientY - startY));
            
            modal.style.width = newWidth + 'px';
            modal.style.minHeight = newHeight + 'px';
            
            const popupState = JSON.parse(localStorage.getItem('portfolioPopups')) || {};
            if (!popupState['navigation'] || typeof popupState['navigation'] !== 'object') {
                popupState['navigation'] = {};
            }
            popupState['navigation'].width = newWidth;
            popupState['navigation'].height = newHeight;
            localStorage.setItem('portfolioPopups', JSON.stringify(popupState));
        }
    });
    
    document.addEventListener('mouseup', () => {
        isResizing = false;
    });
    
    // Close button (won't save closed state for persistent popup)
    closeBtn.addEventListener('click', () => {
        modal.remove();
        openPopups.splice(openPopups.indexOf(modal), 1);
    });
}

// Restore popups from localStorage when returning to the page
function restorePopups() {
    const version = localStorage.getItem('portfolioVersion');
    const savedPopups = JSON.parse(localStorage.getItem('portfolioPopups')) || {};
    
    // If short or long version was selected, restore the popups
    if (version === 'short' || version === 'long') {
        // Check if any popups were open and not closed (navigation is always shown)
        const hasOpenPopups = Object.entries(savedPopups).some(([key, state]) => {
            // Navigation Guide is always shown (persistent)
            if (key === 'navigation') return true;
            // Other popups are shown if they're true or have position data
            return state === true || (typeof state === 'object' && state.top !== undefined);
        });
        
        if (hasOpenPopups) {
            // Show the popups without displaying the version selector again
            showLongVersionModals();
            showNavigationGuide();
        }
    }
}

// Controleer of versie al gekozen is, zo niet toon selector
if (!localStorage.getItem('portfolioVersion')) {
    showVersionSelector();
} else {
    // Restore popups if user returns to the page
    restorePopups();
}

// Herlaad versie knop
document.getElementById('reload-version-btn').addEventListener('click', () => {
    closeAllPopups();
    localStorage.removeItem('portfolioVersion');
    showVersionSelector();
});


