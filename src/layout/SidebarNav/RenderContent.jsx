import Box from '@mui/material/Box'
import React from 'react'
import { Link } from 'react-router-dom'
import { Logo, Scrollbar } from '../../components'
import RenderMenu from './RenderMenu'
import RenderUpgrade from './RenderUpgrade'

const RenderContent = () => {
    return (
        <Scrollbar
            sx={{
                height: 1,
                '& .simplebar-content': {
                    height: 1,
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <Box
                height={150}
                sx={{
                    display: 'flex',
                    pt: 4,
                    pl: 4,
                    gap: 2,
                }}
            >
                <Link to="/">
                    <Logo height={58} width={60} sx={{ mt: 3, ml: 4 }} />
                </Link>
                <Box sx={{ fontSize: '2rem', fontWeight: 500, paddingTop: '0.5rem' }}>
                    PRIDE C
                </Box>
            </Box>

            <RenderMenu />

            <Box sx={{ flexGrow: 1 }} />

            <RenderUpgrade />
        </Scrollbar>
    )
}

export default RenderContent
