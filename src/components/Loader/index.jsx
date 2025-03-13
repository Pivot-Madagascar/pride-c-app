import { Layer, CircularLoader, Center } from '@dhis2/ui'
import React from 'react'

const Loader = () => {
    return (
        <>
            <Layer translucent>
                <Center>
                    <CircularLoader />
                </Center>
            </Layer>
        </>
    )
}

export default Loader
