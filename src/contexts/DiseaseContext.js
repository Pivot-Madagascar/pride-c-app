import { createContext, useContext } from 'react'

const DiseaseContext = createContext()

export const DiseaseProvider = ({ children, config }) => {
    return (
        <DiseaseContext.Provider value={config}>
            {children}
        </DiseaseContext.Provider>
    )
}

export const useDiseaseConfig = () => {
    const context = useContext(DiseaseContext)
    if (!context) {
        throw new Error(
            'useDiseaseConfig must be used within a DiseaseProvider'
        )
    }
    return context
}
