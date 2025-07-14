import React, { Suspense, useEffect, useState } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import style from './App.module.scss'
import Loader from './components/Loader'
import Router from './modules/Router'
import { createStore, loadStateFromCache, storeUtils } from './redux/store'
import { setLastDataUpdate } from './redux/appSlice'
import { usePridecUpdate } from './hooks/usePridecDataUpdate'

const App = () => {
    const [store, setStore] = useState(null)

    const { data: pridecUpdateData, error } = usePridecUpdate()

    useEffect(() => {
        const initializeStore = async () => {
            const preloadedState = await loadStateFromCache()

            const newStore = createStore(preloadedState)
            setStore(newStore)

            if (!error && pridecUpdateData) {
                const localTimestamp = preloadedState?.app?.lastDataUpdate
                if (pridecUpdateData !== localTimestamp) {
                    await storeUtils.clearCache()
                    newStore.dispatch(setLastDataUpdate(pridecUpdateData))
                }
            }
        }

        initializeStore()
    }, [
        pridecUpdateData,
        error
    ])

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
