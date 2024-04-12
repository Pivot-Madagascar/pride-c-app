import React, { createContext, useContext, useState } from 'react'

const NavIndexContext = createContext()

export const NavIndexProvider = ({ children }) => {
    const [navIndex, setNavIndex] = useState(0)

    return (
        <NavIndexContext.Provider value={{ navIndex, setNavIndex }}>
            {children}
        </NavIndexContext.Provider>
    )
}

export const useNavIndex = () => useContext(NavIndexContext)
