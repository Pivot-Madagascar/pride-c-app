import { Box, Drawer } from '@mui/material'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useResponsive } from '../../hooks/use-responsive'
import { usePathname } from '../../routes/hooks/use-pathname'
import { NAV } from '../config-layout'
import RenderContent from './RenderContent'

const Nav = ({ openNav, onCloseNav }) => {
    const pathname = usePathname()

    const upLg = useResponsive('up', 'lg')

    useEffect(() => {
        if (openNav) {
            onCloseNav()
        }
    }, [pathname])

    return (
        <Box
            sx={{
                flexShrink: { lg: 0 },
                width: { lg: 0 },
            }}
        >
            {/* {upLg ? (
                <Box
                    sx={{
                        height: 1,
                        position: 'fixed',
                        width: NAV.WIDTH,
                        borderRight: (theme) =>
                            `dashed 1px ${theme.palette.divider}`,
                    }}
                >
                    <RenderContent />
                </Box>
            ) : ( */}
                <Drawer
                    open={openNav}
                    onClose={onCloseNav}
                    PaperProps={{
                        sx: {
                            width: 300,
                        },
                    }}
                >
                    <RenderContent />
                </Drawer>
            {/* )}  */}
        </Box>
    )
}

Nav.propTypes = {
    openNav: PropTypes.bool,
    onCloseNav: PropTypes.func,
}

export default Nav
