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
    local maxProgress = 85  -- Start with conservative max
    
    -- Phase 1: Adaptive loading simulation
    while progress < 95 do
        Citizen.Wait(400)
        
        -- Check if player is becoming active
        local isPlayerActive = NetworkIsPlayerActive(PlayerId())
        
        -- Adjust max progress based on player state
        if isPlayerActive then
            maxProgress = 95  -- Player is ready, allow higher progress
        else
            maxProgress = 85  -- Still loading, keep conservative
        end
        
        -- Adaptive speed based on player state
        local increment
        if isPlayerActive then
            increment = math.random(5, 10)  -- Faster when player is ready
        else
            increment = math.random(2, 6)   -- Slower while still loading
        end
        
        progress = progress + increment
        
        -- Cap at current max
        if progress > maxProgress then 
            progress = maxProgress 
        end
        
        -- Update progress with contextual text
        local statusText
        if progress < 30 then
            statusText = 'جاري تحميل الموارد الأساسية...'
        elseif progress < 60 then
            statusText = 'جاري تحميل الخريطة...'
        elseif progress < 85 then
            statusText = 'جاري تحضير العالم...'
        else
            statusText = 'جاري الانتهاء...'
        end
        
        SendNUIMessage({
            action = 'updateProgress',
            progress = progress,
            text = statusText
        })
    end
    
    -- Phase 2: Wait for player to be fully active (if not already)
    while not NetworkIsPlayerActive(PlayerId()) do
        Citizen.Wait(100)
    end
    
    -- Additional buffer to ensure map, props, and player model are fully rendered
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
