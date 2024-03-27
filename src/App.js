import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import classes from './App.module.scss'
import RouterComponent from './routes/sections'
import ThemeProvider from './theme/index'

const MyApp = () => (
    <div className={classes.container}>
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
