/* eslint-disable import/extensions, no-undef, import/no-unresolved */
import { storeUtils } from '../redux/store'

/**
 * Clear all cached data
 * @returns {Promise<void>}
 */
export const clearCache = async () => {
    try {
        await storeUtils.clearCache()
        console.log('[DataManagement] Cache cleared successfully')
    } catch (error) {
        console.error('[DataManagement] Error clearing cache:', error)
    }
}

/**
 * Reset the Redux store to its initial state
 * @returns {void}
 */
export const resetStore = () => {
    try {
        storeUtils.resetStore()
        console.log('[DataManagement] Store reset successfully')
    } catch (error) {
        console.error('[DataManagement] Error resetting store:', error)
    }
}

/**
 * Clear cache and reset store
 * @returns {Promise<void>}
 */
export const clearCacheAndResetStore = async () => {
    await clearCache()
    resetStore()
}

/**
 * Initialize (reload) the page to start fresh
 * @returns {void}
 */
export const reloadPage = () => {
    window.location.reload()
}

/**
 * Full reset: clear cache and reload page (without resetting store)
 * This avoids rendering issues with empty state before reload
 * @returns {Promise<void>}
 */
export const fullReset = async () => {
    await clearCache()
    reloadPage()
}
