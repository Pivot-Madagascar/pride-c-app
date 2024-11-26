import { Box, IconButton } from '@mui/material'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import Menu from '../components/Icons/Menu'
import Header from './Header'
import Main from './Main'
import Nav from './SidebarNav'

const DashboardLayout = ({ children }) => {
    const [openNav, setOpenNav] = useState(false)

    return (
        <>
            {/* <Header onOpenNav={() => setOpenNav(true)} /> */}
            {/* <RenderContent /> */}
            <div style={{ width: '100%' }}>
                <IconButton onClick={() => setOpenNav(true)} sx={{ marginTop: 2, left: 15, position: 'fixed', zIndex: 10000 }}>
                    <Menu width={40} height={40} />
                </IconButton>
            </div>
            

            <Box
                width={'100vw'}
                sx={{
                    minHeight: 1,
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                }}
            >
                <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

                <Main>{children}</Main>
            </Box>
        </>
    )
}

DashboardLayout.propTypes = {
    children: PropTypes.node,
}

export default DashboardLayout
