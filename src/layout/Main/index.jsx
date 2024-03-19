import { Box } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import { useResponsive } from '../../hooks/use-responsive'
import { NAV, HEADER } from '../config-layout'

const SPACING = 8

const Main = ({ children, sx, ...other }) => {
    const lgUp = useResponsive('up', 'lg')

    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                minHeight: 1,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#F6F8FF',
                py: `${HEADER.H_MOBILE + SPACING}px`,
                ...(lgUp && {
                    px: 2,
                    py: `${HEADER.H_DESKTOP + SPACING}px`,
                    width: `calc(100vw - ${NAV.WIDTH}px)`,
                }),
                ...sx,
            }}
            {...other}
        >
            {children}
        </Box>
    )
}

Main.propTypes = {
    children: PropTypes.node,
    sx: PropTypes.object,
}

export default Main