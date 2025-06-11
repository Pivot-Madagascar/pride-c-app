import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import FadeWrapper from '../components/FadeWrapper'
import Menu from '../components/Icons/Menu'
import Loader from '../components/Loader'
import NotificationListener from '../components/NotificationListener'
import Main from './Main'
import Nav from './SidebarNav'

const DefaultLayout = ({ children }) => {
    const [openNav, setOpenNav] = useState(false)
    const isLoading = false

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <div style={{ width: '100dvw' }}>
                        <IconButton
                            onClick={() => setOpenNav(true)}
                            sx={{
                                marginTop: 1,
                                left: 15,
                                position: 'fixed',
                                zIndex: 10000,
                            }}
                        >
                            <Menu width={40} height={40} />
                        </IconButton>
                    </div>
                    <Box
                        width={'100dvw'}
                        sx={{
                            minHeight: 1,
                            display: 'flex',
                            flexDirection: { xs: 'column', lg: 'row' },
                            maxWidth: '1600px',
                        }}
                    >
                        <Nav
                            openNav={openNav}
                            onCloseNav={() => setOpenNav(false)}
                        />

                        <Main
                            sx={{
                                marginLeft: '0.5rem',
                                marginRight: '0.5rem',
                            }}
                        >
                            <FadeWrapper>{children}</FadeWrapper>
                            <NotificationListener />
                            <Toaster position="top-center" />
                        </Main>
                    </Box>
                </>
            )}
        </>
    )
}

DefaultLayout.propTypes = {
    children: PropTypes.node,
}

export default DefaultLayout
