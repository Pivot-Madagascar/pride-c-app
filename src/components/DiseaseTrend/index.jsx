import React from 'react'
import { useDiseaseTrend } from '@/hooks'
import DataManager from '@/components/DataManager'
import DiseaseDashboard from '@/components/DiseaseDashboard'
import Loader from '@/components/Loader'

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
