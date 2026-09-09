fx_version 'cerulean'
game 'gta5'

name 'a3mk_loading_screen'
author 'A3MK'
description 'Premium Glass UI loading screen with video/audio support - Framework agnostic'
version '1.0.0'

lua54 'yes'

-- Loading screen entry point
loadscreen 'html/index.html'

-- Manual shutdown prevents flicker when player spawns
loadscreen_manual_shutdown 'yes'

-- All client-side files served to NUI
files {
    'html/index.html',
    'html/css/style.css',
    'html/js/main.js',
    -- Fonts for Arabic support
    'html/fonts/*.ttf',
    'html/fonts/*.otf',
    'html/fonts/*.woff',
    'html/fonts/*.woff2',
    -- Media files
    'html/assets/*.png',
    'html/assets/*.jpg',
    'html/assets/*.jpeg',
    'html/assets/*.gif',
    'html/assets/*.webp',
    'html/assets/*.mp4',
    'html/assets/*.webm',
    'html/assets/*.mp3',
    'html/assets/*.ogg',
    'html/assets/*.wav'
}

-- Configuration file
shared_script 'config.lua'

-- Client-side logic
client_script 'client.lua'

-- Server-side (minimal, for future extensions)
server_script 'server.lua'
