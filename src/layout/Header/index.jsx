import { AppBar, Toolbar } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import PropTypes from 'prop-types'
import React from 'react'
import { useResponsive } from '../../hooks/use-responsive'
import { bgBlur } from '../../theme/css'
import { NAV, HEADER } from '../config-layout'
import RenderContent from './RenderContent'

const Header = ({ onOpenNav }) => {
    const theme = useTheme()
    const lgUp = useResponsive('up', 'lg')

    return (
        <AppBar
            sx={{
                top: 48,
                boxShadow: 'none',
                height: HEADER.H_MOBILE,
                zIndex: theme.zIndex.appBar + 1,
                ...bgBlur({
                    color: theme.palette.background.default,
                }),
                transition: theme.transitions.create(['height'], {
                    duration: theme.transitions.duration.shorter,
                }),
                ...(lgUp && {
                    width: `calc(100% - ${NAV.WIDTH + 1}px)`,
                    height: HEADER.H_DESKTOP,
                }),
            }}
        >
            <Toolbar
                sx={{
                    height: 1,
                    px: { lg: 5 },
                }}
            >
                <RenderContent onOpenNav={onOpenNav} />
            </Toolbar>
        </AppBar>
    )
}

Header.proTypes = {
    onOpenNav: PropTypes.func,
}

export default Header