import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import style from './App.module.scss'
import RouterComponent from './routes/sections'
import ThemeProvider from './theme/index'

const MyApp = () => (
    <div data-testid="my-app" className={style.container}>
        <ThemeProvider>
            <Router>
                <Routes>
                    <Route path="/*" element={<RouterComponent />} />
                </Routes>
            </Router>
        </ThemeProvider>
    </div>
)

export default MyApp
