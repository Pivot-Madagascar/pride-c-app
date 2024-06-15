import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import style from './App.module.scss'
import store from './redux/store'
import RouterComponent from './routes/sections'

const MyApp = () => (
    <Provider store={store}>
        <div data-testid="my-app" className={style.container}>
            <Router>
                <Routes>
                    <Route path="/*" element={<RouterComponent />} />
                </Routes>
            </Router>
        </div>
    </Provider>
)

export default MyApp
