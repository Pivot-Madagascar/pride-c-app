import React, { Suspense, useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import style from '@/App.module.scss'
import { Loader } from '@/components'
import Router from '@/modules/Router'
import { createStore, loadStateFromCache } from '@/redux/store'
import { fullReset } from '@/utils/dataManagement'
import { setLastDataUpdate } from '@/redux/appSlice'
import { usePridecUpdate } from '@/hooks'

const theme = createTheme({
    palette: {
        mode: 'light',
    },
})

const App = () => {
    const [store, setStore] = useState(null)

    const { data: pridecUpdateData, error } = usePridecUpdate()
    const lastUpdate = JSON.parse(pridecUpdateData)?.pridec_update

    useEffect(() => {
        const initializeStore = async () => {
            try {
                const preloadedState = await loadStateFromCache()
                const newStore = createStore(preloadedState)
                setStore(newStore)
            } catch (e) {
                console.error('Error initializing store:', e)
            }
        }

        if (!store) {
            initializeStore()
        }
    }, [store])

    useEffect(() => {
        if (!store || error) return
        const localTimestamp = store.getState().app?.lastDataUpdate

        if (lastUpdate) {
            if (localTimestamp === null) {
                store.dispatch(setLastDataUpdate(lastUpdate))
            } else {
                if (localTimestamp !== lastUpdate) {
                    fullReset()
                }
            }
        }
    }, [store, lastUpdate, error])

    if (!store) {
        return <Loader />
    }

    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div data-testid="my-app" className={style.container}>
                    <Suspense fallback={<Loader />}>
                        <Router />
                    </Suspense>
                </div>
            </ThemeProvider>
        </Provider>
    )
}

export default App