import React, { Suspense, useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import style from './App.module.scss'
import Loader from './components/Loader'
import Router from './modules/Router'
import { createStore, loadStateFromCache, storeUtils } from './redux/store'
import { setLastDataUpdate, clearFetchedDimensions } from './redux/appSlice'
import { usePridecUpdate } from './hooks/usePridecDataUpdate'

const App = () => {
    const [store, setStore] = useState(null)

    const { data: pridecUpdateData, error, loading } = usePridecUpdate()

    useEffect(() => {
        const initializeStore = async () => {
            try {
                const preloadedState = await loadStateFromCache()
                const newStore = createStore(preloadedState)
                setStore(newStore)
                
                if (!error && pridecUpdateData) {
                    const localTimestamp = preloadedState?.app?.lastDataUpdate
                    if (String(pridecUpdateData) !== String(localTimestamp)) {
                        newStore.dispatch(clearFetchedDimensions)
                        newStore.dispatch(setLastDataUpdate(String(pridecUpdateData)))
                    }
                }
            } catch (e) {
                console.error('Error initializing store:', e)
            }
        }

        if (!store && !loading) {
            initializeStore()
        }
    }, [pridecUpdateData, error, loading])

    if (!store) {
        return <Loader />
    }

    return (
        <Provider store={store}>
            <div data-testid="my-app" className={style.container}>
                <Suspense fallback={<Loader />}>
                    { !loading && <Router /> }
                </Suspense>
            </div>
        </Provider>
    )
}

export default App