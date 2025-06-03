import React, { Suspense, useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import style from './App.module.scss'
import Loader from './components/Loader'
import Router from './modules/Router'
import createAppStore from './redux/store'

const App = () => {
    const [store, setStore] = useState(null)

    useEffect(() => {
        createAppStore().then((newStore) => {
            setStore(newStore)
        })
    }, [])

    if (!store) {
        return <Loader />
    }

    return (
        <Provider store={store}>
            <div data-testid="my-app" className={style.container}>
                <Suspense fallback={<Loader />}>
                    <Router />
                </Suspense>
            </div>
        </Provider>
    )
}

export default App
