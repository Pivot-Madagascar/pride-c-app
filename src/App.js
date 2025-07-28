import React, { Suspense, useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import style from './App.module.scss'
import Loader from './components/Loader'
import Router from './modules/Router'
import { createStore, loadStateFromCache, storeUtils } from './redux/store'
import { setLastDataUpdate } from './redux/appSlice'
import { usePridecUpdate } from './hooks/usePridecDataUpdate'
import { ErrorBoundary } from './components/ErrorBoundary'

const App = () => {
    const [store, setStore] = useState(null)

    const { data: pridecUpdateData, error } = usePridecUpdate()

    useEffect(() => {
        const initializeStore = async () => {
            try {
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
            } catch (e) {
                // Optionally, you could set an error state here to show a fallback UI
                // For now, just log
                console.error('Error initializing store:', e)
            }
        }

        // Only initialize store if not already set
        if (!store) {
            initializeStore()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pridecUpdateData, error])

    if (!store) {
        return <Loader />
    }

    return (
        <Provider store={store}>
            <ErrorBoundary>
                <div data-testid="my-app" className={style.container}>
                    <Suspense fallback={<Loader />}>
                        <Router />
                    </Suspense>
                </div>
            </ErrorBoundary>
        </Provider>
    )
}

export default App