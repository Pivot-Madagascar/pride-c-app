import { Box } from '@mui/material'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import Header from './Header'
import Main from './Main'
import Nav from './SidebarNav'

const DashboardLayout = ({ children }) => {
    const [openNav, setOpenNav] = useState(false)

    return (
        <>
            <Header onOpenNav={() => setOpenNav(true)} />

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
