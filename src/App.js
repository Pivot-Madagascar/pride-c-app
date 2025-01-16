import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import style from './App.module.scss'
import CustomLoading from './components/Loading'
import Router from './modules/Router'
import store from './redux/store'

const MyApp = () => (
    <Provider store={store}>
        <div data-testid="my-app" className={style.container}>
            <Suspense fallback={<CustomLoading />}>
                <Router />
            </Suspense>
        </div>
    </Provider>
)

export default MyApp
