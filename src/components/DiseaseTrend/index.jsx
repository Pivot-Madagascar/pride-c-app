import React from 'react'
import { useDiseaseTrend } from '../../hooks/useDiseaseTrend'
import DataManager from '../DataManager'
import DiseaseDashboard from '../DiseaseDashboard'
import Loader from '../Loader'

const DiseaseTrend = () => {
    const { elements, allDataFetched, handleDataFetched } = useDiseaseTrend()

    return (
        <>
            {elements.map(({ dataElements, reduxAction }, index) => (
                <DataManager
                    key={index}
                    dataElements={dataElements}
                    reduxAction={reduxAction}
                    onDataFetched={handleDataFetched}
                />
            ))}
            {!allDataFetched ? (
                <Loader />
            ) : (
                <DiseaseDashboard />
            )}
        </>
    )
}

export default DiseaseTrend
