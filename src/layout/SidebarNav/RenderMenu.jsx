import React from 'react'
import Navigation from './Navigation'
import { NavIndexProvider } from './NavIndexContext'

const RenderMenu = () => {
    return (
        <NavIndexProvider>
            <Navigation />
        </NavIndexProvider>
    )
}

export default RenderMenu
