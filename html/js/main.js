// ==========================================
// MAIN LOADING SCREEN LOGIC
// ==========================================

(function() {
    'use strict';

    // DOM Elements
    const elements = {
        bgVideo: document.getElementById('bg-video'),
        videoSourceMp4: document.getElementById('video-source-mp4'),
        videoSourceWebm: document.getElementById('video-source-webm'),
        serverLogo: document.getElementById('server-logo'),
        serverName: document.querySelector('.server-name'),
        serverTagline: document.querySelector('.server-tagline'),
        rulesContent: document.getElementById('rules-content'),
        loadingProgress: document.querySelector('.loading-progress'),
        loadingText: document.querySelector('.loading-text'),
        currentTip: document.getElementById('current-tip'),
        discordLink: document.getElementById('discord-link'),
        bgAudio: document.getElementById('bg-audio'),
        audioSourceOgg: document.getElementById('audio-source-ogg'),
        audioSourceMp3: document.getElementById('audio-source-mp3'),
        logoContainer: document.querySelector('.logo-container'),
        rulesContainer: document.querySelector('.rules-container'),
        tipsSection: document.querySelector('.tips-section'),
        discordSection: document.querySelector('.discord-section')
    };

    // State
    let currentTipIndex = 0;
    let tipRotationInterval = null;
    let tipFadeTimeout = null;

    // ==========================================
    // INITIALIZATION
    // ==========================================
    function init() {
        console.log('[LoadingScreen] Initializing...');
        
        if (!window.Config) {
            console.error('[LoadingScreen] Config not found!');
            return;
        }

        setupMedia();
        setupServerInfo();
        setupRules();
        setupTips();
        setupDiscord();
        setupUIVisibility();
        setupNUIListener();
        
        console.log('[LoadingScreen] Initialization complete');
    }

    // ==========================================
    // MEDIA SETUP
    // ==========================================
    function setupMedia() {
        const config = window.Config.Media;
        const uiConfig = window.Config.UI;

        // Dynamic Video Blur
        const blurIntensity = uiConfig.BlurIntensity !== undefined ? uiConfig.BlurIntensity : 5;
        elements.bgVideo.style.filter = `blur(${blurIntensity}px) brightness(0.7)`;

        // Video
        if (config.VideoPath) {
            const pathLower = config.VideoPath.toLowerCase();
            if (pathLower.endsWith('.webm')) {
                elements.videoSourceWebm.src = config.VideoPath;
            } else {
                elements.videoSourceMp4.src = config.VideoPath;
            }
            elements.bgVideo.load();
            elements.bgVideo.play().catch(err => {
                console.warn('[LoadingScreen] Video autoplay failed:', err);
            });
            console.log('[LoadingScreen] Video loaded:', config.VideoPath);
        }

        // Logo
        if (config.LogoPath) {
            elements.serverLogo.src = config.LogoPath;
            elements.serverLogo.onerror = () => {
                console.warn('[LoadingScreen] Logo not found, hiding logo container');
                elements.logoContainer.style.display = 'none';
            };
            console.log('[LoadingScreen] Logo loaded:', config.LogoPath);
        }

        // Audio
        if (config.AudioPath) {
            const pathLower = config.AudioPath.toLowerCase();
            if (pathLower.endsWith('.ogg')) {
                elements.audioSourceOgg.src = config.AudioPath;
            } else {
                elements.audioSourceMp3.src = config.AudioPath;
            }
            elements.bgAudio.volume = config.AudioVolume !== undefined ? config.AudioVolume : 0.5;
            elements.bgAudio.loop = config.LoopAudio !== false;
            elements.bgAudio.load();
            console.log('[LoadingScreen] Audio loaded:', config.AudioPath);
        }
    }

    // ==========================================
    // SERVER INFO
    // ==========================================
    function setupServerInfo() {
        const config = window.Config;

        if (config.ServerName) {
            elements.serverName.textContent = config.ServerName;
            document.title = config.ServerName + ' - Loading';
        }

        if (config.ServerTagline) {
            elements.serverTagline.textContent = config.ServerTagline;
        }
    }

    // ==========================================
    // RULES DISPLAY
    // ==========================================
    function setupRules() {
        const rules = window.Config.Rules;
        
        if (!rules || rules.length === 0) {
            elements.rulesContainer.style.display = 'none';
            return;
        }

        elements.rulesContent.innerHTML = '';

        rules.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'rule-category';

            const title = document.createElement('h3');
            title.textContent = category.title;
            categoryDiv.appendChild(title);

            const list = document.createElement('ul');
            category.items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                list.appendChild(li);
            });
            categoryDiv.appendChild(list);

            elements.rulesContent.appendChild(categoryDiv);
        });

        console.log('[LoadingScreen] Rules loaded:', rules.length, 'categories');
    }

    // ==========================================
    // TIPS ROTATION (Optimized)
    // ==========================================
    function setupTips() {
        const tips = window.Config.Tips;
        const uiConfig = window.Config.UI;

        if (!tips || tips.length === 0) {
            elements.tipsSection.style.display = 'none';
            return;
        }

        // Show first tip immediately
        showTip(0);

        // Rotate tips
        const rotationSpeed = uiConfig.TipRotationSpeed || 8000;
        tipRotationInterval = setInterval(() => {
            currentTipIndex = (currentTipIndex + 1) % tips.length;
            showTip(currentTipIndex);
        }, rotationSpeed);

        console.log('[LoadingScreen] Tips rotation started');
    }

    function showTip(index) {
        const tips = window.Config.Tips;
        
        // Clear any pending timeout to prevent overlap
        if (tipFadeTimeout) {
            clearTimeout(tipFadeTimeout);
        }

        // Fade out
        elements.currentTip.style.opacity = '0';
        
        // Wait for CSS transition (0.5s), then change text and fade in
        tipFadeTimeout = setTimeout(() => {
            elements.currentTip.textContent = tips[index];
            elements.currentTip.style.opacity = '1';
        }, 500);
    }

    // ==========================================
    // DISCORD LINK
    // ==========================================
    function setupDiscord() {
        const config = window.Config;

        if (config.DiscordLink) {
            // Ensure proper URL formatting
            const link = config.DiscordLink.startsWith('http') 
                ? config.DiscordLink 
                : 'https://' + config.DiscordLink;
            elements.discordLink.href = link;
        } else {
            elements.discordSection.style.display = 'none';
        }
    }

    // ==========================================
    // UI VISIBILITY
    // ==========================================
    function setupUIVisibility() {
        const uiConfig = window.Config.UI;

        if (!uiConfig.ShowLogo) elements.logoContainer.style.display = 'none';
        if (!uiConfig.ShowRules) elements.rulesContainer.style.display = 'none';
        if (!uiConfig.ShowTips) elements.tipsSection.style.display = 'none';
        if (!uiConfig.ShowDiscord) elements.discordSection.style.display = 'none';
    }

    // ==========================================
    // NUI MESSAGE LISTENER
    // ==========================================
    function setupNUIListener() {
        window.addEventListener('message', function(event) {
            const data = event.data;

            if (!data || !data.action) {
                return;
            }

            console.log('[LoadingScreen] NUI message received:', data.action);

            switch(data.action) {
                case 'showLoadingScreen':
                    handleShowLoadingScreen();
                    break;

                case 'updateProgress':
                    handleUpdateProgress(data.progress, data.text);
                    break;

                case 'hideLoadingScreen':
                    handleHideLoadingScreen();
                    break;

                default:
                    console.warn('[LoadingScreen] Unknown action:', data.action);
            }
        });
    }

    // ==========================================
    // NUI MESSAGE HANDLERS
    // ==========================================
    function handleShowLoadingScreen() {
        console.log('[LoadingScreen] Showing loading screen');
        
        if (elements.bgAudio && elements.bgAudio.src) {
            elements.bgAudio.play().then(() => {
                console.log('[LoadingScreen] Audio started');
            }).catch(err => {
                console.warn('[LoadingScreen] Audio play failed (user interaction may be required):', err);
            });
        }
    }

    function handleUpdateProgress(progress, text) {
        if (typeof progress === 'number') {
            elements.loadingProgress.style.width = Math.min(100, Math.max(0, progress)) + '%';
        }

        if (text) {
            elements.loadingText.textContent = text;
        }
    }

    function handleHideLoadingScreen() {
        console.log('[LoadingScreen] Hiding loading screen');
        
        // Stop audio
        if (elements.bgAudio) {
            elements.bgAudio.pause();
            elements.bgAudio.currentTime = 0;
        }

        // Stop tip rotation
        if (tipRotationInterval) {
            clearInterval(tipRotationInterval);
        }
        if (tipFadeTimeout) {
            clearTimeout(tipFadeTimeout);
        }

        // Fade out
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '0';

        setTimeout(() => {
            document.body.style.display = 'none';
        }, 500);
    }

    // ==========================================
    // START INITIALIZATION
    // ==========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
