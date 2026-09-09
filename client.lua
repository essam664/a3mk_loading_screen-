-- ==========================================
-- CLIENT-SIDE LOGIC
-- ==========================================

-- 1. Initialize NUI when resource starts
AddEventHandler('onClientResourceStart', function(resourceName)
    if resourceName == GetCurrentResourceName() then
        -- Brief delay to ensure NUI is fully mounted
        Citizen.Wait(500)
        
        SendNUIMessage({
            action = 'showLoadingScreen'
        })
    end
end)

-- 2. Unified Loading & Dismissal Thread
Citizen.CreateThread(function()
    local progress = 0
    
    -- Phase 1: Simulate loading up to 90%
    while progress < 90 do
        Citizen.Wait(300)
        progress = progress + math.random(5, 12)
        
        if progress > 90 then 
            progress = 90 
        end
        
        SendNUIMessage({
            action = 'updateProgress',
            progress = progress,
            text = 'جاري تحميل الموارد...'
        })
    end
    
    -- Phase 2: Wait for player to be fully active (Framework-agnostic)
    while not NetworkIsPlayerActive(PlayerId()) do
        Citizen.Wait(100)
    end
    
    -- Additional buffer to ensure map, props, and player model are fully rendered
    -- This prevents the "black screen" or "flicker" after the loading screen closes
    Citizen.Wait(2000)
    
    -- Phase 3: Push to 100% and show completion message
    SendNUIMessage({
        action = 'updateProgress',
        progress = 100,
        text = 'اكتمل التحميل!'
    })
    
    -- Brief pause to let the player see the 100% completion
    Citizen.Wait(800)
    
    -- Phase 4: Hide NUI and shutdown cleanly
    SendNUIMessage({
        action = 'hideLoadingScreen'
    })
    
    -- Wait for the CSS fade-out animation (0.5s) to complete before killing the NUI
    Citizen.Wait(600)
    
    ShutdownLoadingScreen()
    ShutdownLoadingScreenNui()
end)
