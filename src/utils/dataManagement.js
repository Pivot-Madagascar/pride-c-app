import { storeUtils } from '@/redux/store'

export const clearCache = async () => {
    try {
        await storeUtils.clearCache()
        console.log('[DataManagement] Cache cleared successfully')
    } catch (error) {
        console.error('[DataManagement] Error clearing cache:', error)
    }
}

export const resetStore = () => {
    try {
        storeUtils.resetStore()
        console.log('[DataManagement] Store reset successfully')
    } catch (error) {
        console.error('[DataManagement] Error resetting store:', error)
    }
}

export const clearCacheAndResetStore = async () => {
    await clearCache()
    resetStore()
}

export const reloadPage = () => {
    window.location.reload()
}

export const clearCacheAndNavigate = async () => {
    await clearCache()
}

export const fullReset = async () => {
    await clearCache()
    reloadPage()
}
