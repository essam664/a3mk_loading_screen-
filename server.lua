-- ==========================================
-- SERVER-SIDE LOGIC
-- ==========================================

-- Framework detection and initialization
local frameworkDetected = nil

-- Detect framework on resource start
AddEventHandler('onResourceStart', function(resourceName)
    if resourceName == GetCurrentResourceName() then
        print('[SHADOW RP Loading] Resource started')
        
        -- Framework detection
        if GetResourceState('qbx_core') == 'started' then
            frameworkDetected = 'Qbox'
            print('[SHADOW RP Loading] Framework detected: Qbox')
        elseif GetResourceState('qb-core') == 'started' then
            frameworkDetected = 'QBCore'
            print('[SHADOW RP Loading] Framework detected: QBCore')
        elseif GetResourceState('es_extended') == 'started' then
            frameworkDetected = 'ESX'
            print('[SHADOW RP Loading] Framework detected: ESX')
        else
            frameworkDetected = 'Standalone'
            print('[SHADOW RP Loading] Framework detected: Standalone (no framework)')
        end
        
        print('[SHADOW RP Loading] Ready for connections')
    end
end)

-- Optional: Log player connections (for future analytics)
AddEventHandler('playerConnecting', function(playerName, setKickReason, deferrals)
    -- Basic connection logging (source is nil here, use playerName only)
    print('[SHADOW RP Loading] Player connecting: ' .. playerName)
    
    -- Deferrals are handled by the framework or server config
    -- This loading screen works independently of the framework
end)

-- Optional: Export framework detection for other resources
exports('GetDetectedFramework', function()
    -- Fallback detection if called before onResourceStart completes
    if not frameworkDetected then
        if GetResourceState('qbx_core') == 'started' then
            return 'Qbox'
        elseif GetResourceState('qb-core') == 'started' then
            return 'QBCore'
        elseif GetResourceState('es_extended') == 'started' then
            return 'ESX'
        else
            return 'Standalone'
        end
    end
    return frameworkDetected
end)
