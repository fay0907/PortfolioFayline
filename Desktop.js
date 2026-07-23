
/* ---------- Version Selector ---------- */
const video = document.getElementById("BackgroundVideo");
const button = document.getElementById("toggleVideo");


/* ---------- Video Controls ---------- */
let videoEnabled = true;

video.addEventListener("ended", () => 
{
  video.classList.add("videoHidden");

  setTimeout(() => {
    if (videoEnabled) 
    {
      video.classList.remove("videoHidden");
      video.currentTime = 0;
      video.play();
    }
  }, 3000);
});

button.addEventListener("click", () => 
{

  videoEnabled = !videoEnabled;

  if (videoEnabled) 
  {
    button.textContent = "Video uit";
    video.play();
    video.classList.remove("videoHidden");
  } 
  else 
  {
    button.textContent = "Video aan";
    video.pause();
    video.classList.add("videoHidden");
  }

});

/* ---------- Clock ---------- */

function updateClock() 
{
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}
    
    setInterval(updateClock, 1000);
    updateClock();

/* ---------- Popups ---------- */

// Array om alle open popups bij te houden
const openPopups = [];

// Sluit alle open popups
function closeAllPopups() 
{
    openPopups.forEach(popup => 
    {
        if (popup && popup.parentNode) 
        {
            popup.remove();
        }
    });
    openPopups.length = 0;
}

// Toon alle popups zodra pagina geladen is
document.addEventListener('DOMContentLoaded', () => 
{
    showAllPopups();
    showNavigationGuide();
});

// Toon alle popups automatisch
function showAllPopups() 
{
    const popups = 
    [
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
    
    popups.forEach((popup, index) =>
    {
        // Skip if popup was closed (except persistent popups)
        if (savedPopups[popup.key] === false && !popup.persistent) 
        {
            return;
        }
        
        let randomTop, randomLeft;
        const popupWidth = popup.key === 'projects' ? 400 : 400;
        const popupHeight = popup.key === 'projects' ? 300 : 200;
        
        // Use saved position or calculate new one
        if (savedPopups[popup.key] && savedPopups[popup.key].top !== undefined) 
        {
            randomTop = savedPopups[popup.key].top;
            randomLeft = savedPopups[popup.key].left;
            
            // Clamp saved position to screen bounds
            const maxTop = window.innerHeight - popupHeight - 70;
            const maxLeft = window.innerWidth - popupWidth - 20;
            
            randomTop = Math.max(10, Math.min(randomTop, maxTop));
            randomLeft = Math.max(10, Math.min(randomLeft, maxLeft));
        } 
        else 
        {
            // Calculate position based on popup index to avoid overlap
            // Desktop buttons are on the left (~200px), taskbar is at bottom (70px)
            const desktopButtonsWidth = 200;
            const taskbarHeight = 70;
            const padding = 20;
            
            // Available area: from right of desktop buttons to right edge, from top to above taskbar
            const availableTop = 20;
            const availableHeight = window.innerHeight - taskbarHeight - 40;
            const availableLeft = desktopButtonsWidth + 20;
            const availableWidth = window.innerWidth - desktopButtonsWidth - 40;
            
            // Spread 3 popups across available space without overlap
            const popupWidth = 400;
            const popupHeight = popup.key === 'projects' ? 300 : 200;
            
            // Grid positions: spread them out in 2x2 grid without overlap
            // Top row: About Me (left) + Projects (right)
            // Bottom row: Sweden (left) + Navigation (right)
            const positions = [
                { top: availableTop + 20, left: availableLeft + 20 },                                    // Top-left (About Me)
                { top: availableTop + 20, left: availableLeft + availableWidth - popupWidth - 40 },    // Top-right (Projects)
                { top: availableTop + 340, left: availableLeft + 20 }                                  // Bottom-left (Sweden)
            ];
            
            if (index < positions.length) 
            {
                randomTop = Math.max(availableTop, Math.min(
                    positions[index].top,
                    window.innerHeight - popupHeight - taskbarHeight - 20
                ));
                
                randomLeft = Math.max(availableLeft, Math.min(
                    positions[index].left,
                    window.innerWidth - popupWidth - 20
                ));
            } 
            else 
            {
                // Fallback for more than 3 popups
                randomTop = Math.max(availableTop, Math.min(
                    availableTop + (index * 100),
                    window.innerHeight - popupHeight - taskbarHeight - 20
                ));
                
                randomLeft = Math.max(availableLeft, Math.min(
                    availableLeft + (index * 150),
                    window.innerWidth - popupWidth - 20
                ));
            }
        }
        
        plannedPositions.push({
            key: popup.key,
            top: randomTop,
            left: randomLeft,
            width: popupWidth,
            height: popupHeight
        });
    });
    
    // Save current open popups
    const popupState = JSON.parse(localStorage.getItem('portfolioPopups')) || {};
    popups.forEach(popup => 
    {
        // Only set to true if not already false and not an object with position data
        if (popupState[popup.key] !== false && typeof popupState[popup.key] !== 'object') 
        {
            popupState[popup.key] = true;
        }
    });
    localStorage.setItem('portfolioPopups', JSON.stringify(popupState));


    // Now create popups with planned positions
    plannedPositions.forEach((planned, index) => 
    {
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
        if (savedPopups[popup.key] && savedPopups[popup.key].width) 
        {
            modal.style.width = savedPopups[popup.key].width + 'px';
        }
        if (savedPopups[popup.key] && savedPopups[popup.key].height) 
        {
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
        if (!document.querySelector('style[data-popup-styles]')) 
        {
            styleTag.setAttribute('data-popup-styles', 'true');
            document.head.appendChild(styleTag);
        }
        
        content.className = 'popup-content';
        
        if (popup.contentType === 'html') 
        {
            // For Projects and Sweden - create HTML content
            if (popup.key === 'projects') 
            {
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
            } 
            else if (popup.key === 'sweden')
            {
                content.innerHTML = popup.content;
            }
        } 
        else 
        {
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
        
        header.addEventListener('mousedown', (e) => 
        {
            if (e.target !== closeBtn) {
                isDragging = true;
                offsetX = e.clientX - modal.offsetLeft;
                offsetY = e.clientY - modal.offsetTop;
            }
        });
        
        document.addEventListener('mousemove', (e) => 
        {
            if (isDragging) 
            {
                let newLeft = e.clientX - offsetX;
                let newTop = e.clientY - offsetY;
                
                // Zorg dat popup niet uit beeld gaat
                newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - modal.offsetWidth));
                newTop = Math.max(0, Math.min(newTop, window.innerHeight - modal.offsetHeight));
                
                modal.style.left = newLeft + 'px';
                modal.style.top = newTop + 'px';
                
                // Save position
                const popupState = JSON.parse(localStorage.getItem('portfolioPopups')) || {};
                popupState[popup.key] = 
                {
                    top: newTop,
                    left: newLeft,
                    width: parseInt(modal.style.width),
                    height: parseInt(modal.style.minHeight)
                };
                localStorage.setItem('portfolioPopups', JSON.stringify(popupState));
            }
        });
        
        document.addEventListener('mouseup', () => 
        {
            isDragging = false;
        });
        
        // Resize functionaliteit
        let isResizing = false;
        let startX, startY, startWidth, startHeight;
        
        resizeHandle.addEventListener('mousedown', (e) => 
        {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = modal.offsetWidth;
            startHeight = modal.offsetHeight;
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) =>
        {
            if (isResizing) 
            {
                const newWidth = Math.max(300, startWidth + (e.clientX - startX));
                const newHeight = Math.max(150, startHeight + (e.clientY - startY));
                
                modal.style.width = newWidth + 'px';
                modal.style.minHeight = newHeight + 'px';
                
                // Save size
                const popupState = JSON.parse(localStorage.getItem('portfolioPopups')) || {};
                if (!popupState[popup.key] || typeof popupState[popup.key] !== 'object') 
                {
                    popupState[popup.key] = {};
                }
                popupState[popup.key].width = newWidth;
                popupState[popup.key].height = newHeight;
                localStorage.setItem('portfolioPopups', JSON.stringify(popupState));
            }
        });
        
        document.addEventListener('mouseup', () => 
        {
            isResizing = false;
        });
        
        // Sluiten knop
        closeBtn.addEventListener('click', () => 
        {
            modal.remove();
            openPopups.splice(openPopups.indexOf(modal), 1);
            
            // Save that this popup was closed (not for persistent popups)
            if (!popup.persistent) 
            {
                const popupState = JSON.parse(localStorage.getItem('portfolioPopups')) || {};
                popupState[popup.key] = false;
                localStorage.setItem('portfolioPopups', JSON.stringify(popupState));
            }
        });
    });

}

// Open project documentation
function openProjectDocs(projectName) 
{
    window.location.href = `Unity/Unity.html?project=${projectName}`;
}

// Show persistent navigation guide
function showNavigationGuide() {
    const savedPopups = JSON.parse(localStorage.getItem('portfolioPopups')) || {};
    
    // Only create if not already in openPopups
    if (openPopups.some(p => p.dataset.popupKey === 'navigation')) 
    {
        return;
    }
    
    const navigationPopup = 
    {
        title: 'Navigation Guide',
        content: '<h3>Taskbar Navigation</h3><p><strong>🏠 Home (Windows):</strong> Returns to the main portfolio page with these help popups</p><p><strong>💬 About Me (Discord):</strong> Learn more about Fayline and her background as a game developer</p><p><strong>🎮 Projects (Unity Hub):</strong> Explore game development projects including SwedenProject, OperationStarfall, and more</p><p><strong>🔗 Github:</strong> <a href="https://github.com/fay0907" target="_blank" style="color: #2196F3; text-decoration: none;">Visit my GitHub profile</a> to see my repositories and open-source contributions</p><p><strong>🗺️ International Projects (Maps):</strong> Information about "The Offline Connection" collaborative project with Sweden and other international mapping initiatives</p><p>Click on any popup\'s blue header to drag it. Use the blue handle in the bottom-right corner to resize.</p>',
        contentType: 'html',
        key: 'navigation',
        persistent: true
    };
    
    let randomTop, randomLeft;
    const popupWidth = 400;
    const popupHeight = 200;
    
    if (savedPopups['navigation'] && savedPopups['navigation'].top !== undefined) 
    {
        randomTop = savedPopups['navigation'].top;
        randomLeft = savedPopups['navigation'].left;
    } else {
        // Desktop buttons are on left (~200px), taskbar at bottom (70px)
        const desktopButtonsWidth = 200;
        const taskbarHeight = 70;
        const padding = 20;
        
        // Position Navigation in bottom-right area (matching Sweden's row)
        const availableLeft = desktopButtonsWidth + 20;
        const availableWidth = window.innerWidth - desktopButtonsWidth - 40;
        
        randomTop = Math.max(20, Math.min(
            window.innerHeight - taskbarHeight - popupHeight - 40,
            window.innerHeight - taskbarHeight - popupHeight - 20
        ));
        
        randomLeft = Math.max(availableLeft, Math.min(
            availableLeft + availableWidth - popupWidth - 40,
            window.innerWidth - popupWidth - 20
        ));
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
    
    if (savedPopups['navigation'] && savedPopups['navigation'].width) 
    {
        modal.style.width = savedPopups['navigation'].width + 'px';
    }
    if (savedPopups['navigation'] && savedPopups['navigation'].height) 
    {
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
    
    header.addEventListener('mousedown', (e) => 
    {
        if (e.target !== closeBtn) 
        {
            isDragging = true;
            offsetX = e.clientX - modal.offsetLeft;
            offsetY = e.clientY - modal.offsetTop;
        }
    });
    
    document.addEventListener('mousemove', (e) => 
    {
        if (isDragging) 
        {
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
    
    document.addEventListener('mouseup', () => 
    {
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
            if (!popupState['navigation'] || typeof popupState['navigation'] !== 'object') 
            {
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
function restorePopups() 
{
    const savedPopups = JSON.parse(localStorage.getItem('portfolioPopups')) || {};
    
    // Always show all popups (don't check version)
    showAllPopups();
    showNavigationGuide();
}

// Reset alle gesloten popups
function resetAllPopups() 
{
    const popupState = JSON.parse(localStorage.getItem('portfolioPopups')) || {};
    
    // Set all popups (except navigation) back to true
    popupState.aboutMe = true;
    popupState.projects = true;
    popupState.sweden = true;
    
    localStorage.setItem('portfolioPopups', JSON.stringify(popupState));
    
    // Close all current popups
    closeAllPopups();
    
    // Reopen them
    showAllPopups();
    showNavigationGuide();
}

// Contact popup functie
function openContactPopup() 
{
    const savedPopups = JSON.parse(localStorage.getItem('portfolioPopups')) || {};
    
    let randomTop, randomLeft;
    const popupWidth = 400;
    const popupHeight = 300;
    
    // Use saved position if available
    if (savedPopups['contact'] && savedPopups['contact'].top !== undefined) 
    {
        randomTop = savedPopups['contact'].top;
        randomLeft = savedPopups['contact'].left;
    } else {
        // Desktop buttons are on left (~200px), taskbar at bottom (70px)
        const desktopButtonsWidth = 200;
        const taskbarHeight = 70;
        
        // Position in middle area, away from desktop buttons
        randomTop = Math.max(20, Math.min(
            (window.innerHeight - taskbarHeight) / 2 - popupHeight / 2,
            window.innerHeight - popupHeight - taskbarHeight - 20
        ));
        
        randomLeft = Math.max(desktopButtonsWidth + 20, Math.min(
            window.innerWidth / 2 - popupWidth / 2,
            window.innerWidth - popupWidth - 20
        ));
    }
    
    const modal = document.createElement('div');
    modal.dataset.popupKey = 'contact';
    
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
        z-index: 2100;
        resize: both;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    `;
    
    // Restore saved size if available
    if (savedPopups['contact'] && savedPopups['contact'].width) 
    {
        modal.style.width = savedPopups['contact'].width + 'px';
    }
    if (savedPopups['contact'] && savedPopups['contact'].height) 
    {
        modal.style.minHeight = savedPopups['contact'].height + 'px';
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
    titleSpan.textContent = 'Contact';
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
    content.innerHTML = `
        <h3>Contact Informatie</h3>
        <p><strong>Email:</strong> <a href="mailto:jouw.email@example.com" style="color: #2196F3; text-decoration: none;">jouw.email@example.com</a></p>
        <p><strong>Discord:</strong> JouwDiscordNaam#0000</p>
        <p><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/jouw-profiel" target="_blank" style="color: #2196F3; text-decoration: none;">linkedin.com/in/jouw-profiel</a></p>
        <p><strong>GitHub:</strong> <a href="https://github.com/fay0907" target="_blank" style="color: #2196F3; text-decoration: none;">github.com/fay0907</a></p>
    `;
    
    modal.appendChild(header);
    modal.appendChild(content);
    document.body.appendChild(modal);
    openPopups.push(modal);
    
    // Dragging
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    
    header.addEventListener('mousedown', (e) => 
    {
        if (e.target !== closeBtn) 
        {
            isDragging = true;
            offsetX = e.clientX - modal.offsetLeft;
            offsetY = e.clientY - modal.offsetTop;
        }
    });
    
    document.addEventListener('mousemove', (e) => 
    {
        if (isDragging) 
        {
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;
            
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - modal.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - modal.offsetHeight));
            
            modal.style.left = newLeft + 'px';
            modal.style.top = newTop + 'px';
            
            const popupState = JSON.parse(localStorage.getItem('portfolioPopups')) || {};
            popupState['contact'] = {
                top: newTop,
                left: newLeft,
                width: parseInt(modal.style.width),
                height: parseInt(modal.style.minHeight)
            };
            localStorage.setItem('portfolioPopups', JSON.stringify(popupState));
        }
    });
    
    document.addEventListener('mouseup', () => 
    {
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
            if (!popupState['contact'] || typeof popupState['contact'] !== 'object') 
            {
                popupState['contact'] = {};
            }
            popupState['contact'].width = newWidth;
            popupState['contact'].height = newHeight;
            localStorage.setItem('portfolioPopups', JSON.stringify(popupState));
        }
    });
    
    document.addEventListener('mouseup', () => {
        isResizing = false;
    });
    
    // Close button
    closeBtn.addEventListener('click', () => {
        modal.remove();
        openPopups.splice(openPopups.indexOf(modal), 1);
    });
}

// Toon popups als pagina laadt
restorePopups();

// Reset knop handler
const reloadBtn = document.getElementById('reload-version-btn');
if (reloadBtn) {
    reloadBtn.addEventListener('click', () => {
        resetAllPopups();
    });
}