import { Layer, CircularLoader, Center } from '@dhis2/ui'
import React from 'react'
import Logo from '../Logo'

const Loader = () => {
    return (
        <>
            <Layer translucent>
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'white',
                    }}
                >
                    <Center>
                        <Logo height={145} width={150} sx={{ mt: 3, ml: 4 }} />
                        <div
                            style={{
                                width: '150px',
                                height: '100px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <CircularLoader sx={{ p: 'auto' }} />
                        </div>
                    </Center>
                </div>
            </Layer>
        </>
    )
}

export default Loader
