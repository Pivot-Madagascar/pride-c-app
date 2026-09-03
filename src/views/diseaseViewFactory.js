import React from 'react'

/**
 * Factory function to create disease view components
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.storeName - Redux store name for the disease
 * @param {any} options.sample - Sample data for the disease
 * @param {Function} [options.getSimulation] - Hook for simulation data (Climate views only)
 * @param {Function} [options.getHistoric] - Hook for historic data (Trend views only)
 * @param {Function} [options.getForecast] - Hook for forecast data (Trend views only)
 * @param {Function} options.reduxAction - Redux action to set disease data
 * @param {string} [options.themeColor] - Theme color (Climate views only)
 * @param {React.Component} options.DiseaseComponent - DiseaseClimate or DiseaseTrend component
 * @param {React.Component} options.ProviderComponent - DiseaseClimateProvider or DiseaseProvider
 * @returns {React.Component} A configured disease view component
 */
export const createDiseaseView = ({
    storeName,
    sample,
    getSimulation,
    getHistoric,
    getForecast,
    reduxAction,
    themeColor,
    DiseaseComponent,
    ProviderComponent
}) => {
    // Determine config based on whether it's a climate view (has themeColor) or trend view
    const isClimateView = !!themeColor
    
    // Build config object based on view type
    const config = isClimateView
        ? { 
            storeName, 
            sampleData: sample, 
            getSimulation, 
            reduxAction, 
            themeColor 
          }
        : { 
            storeName, 
            sample, 
            getHistoric, 
            getForecast, 
            getSimulation, 
            reduxAction 
          }
    
    // Create and return the disease view component
    const DiseaseView = () => (
        <ProviderComponent config={config}>
            <DiseaseComponent />
        </ProviderComponent>
    )
    
    // Set display name for React DevTools
    DiseaseView.displayName = `${storeName}DiseaseView`
    
    return DiseaseView
}