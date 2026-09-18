import React from 'react'

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