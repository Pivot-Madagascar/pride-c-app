import { createContext, useContext, useMemo } from 'react'
import { useSelector } from 'react-redux'

const DiseaseClimateContext = createContext()

export const useDiseaseClimate = () => {
    const context = useContext(DiseaseClimateContext)
    if (!context) {
        throw new Error(
            'useDiseaseClimate must be used within a DiseaseClimateProvider'
        )
    }
    return context
}

const isObjectValid = (obj) => {
    if (!obj) { return false }
    return Object.values(obj).every(
        (value) => value !== null && value !== undefined
    )
}

export const DiseaseClimateProvider = ({ children, config }) => {
    const { storeName, sampleData, getSimulation, reduxAction, themeColor } =
        config

    const diseaseState = useSelector((state) => state[storeName])
    const climateState = useSelector((state) => state.climate)

    const value = useMemo(
        () => ({
            diseaseState,
            climateState,
            isObjectValid,
            storeName,
            sampleData,
            getSimulation,
            reduxAction,
            themeColor,
        }),
        [
            diseaseState,
            climateState,
            storeName,
            sampleData,
            getSimulation,
            reduxAction,
            themeColor,
        ]
    )

    return (
        <DiseaseClimateContext.Provider value={value}>
            {children}
        </DiseaseClimateContext.Provider>
    )
}
