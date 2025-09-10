import React from 'react'
import {
    createHashRouter,
    RouterProvider,
    createRoutesFromElements,
    Route
} from 'react-router-dom'
import Button from '../../components/Button'
import ErrorBoundaryLayout from '../../components/ErrorBoundaryLayout'
import ErrorPage from '../../components/ErrorPage'
import styles from '../../components/ErrorPage/ErrorPage.module.scss'
import Dashboard from '../../views/dashboard/dashboard'
import DiarrheaClimate from '../../views/diarrhea/diarrheaClimate'
import DiarrheaTrend from '../../views/diarrhea/diarrheaTrend'
import HowItWork from '../../views/help'
import IraClimate from '../../views/ira/iraClimate'
import IraTrend from '../../views/ira/iraTrend'
import MalariaClimate from '../../views/malaria/malariaClimate'
import MalariaTrend from '../../views/malaria/malariaTrend'
import i18n from '../../locales'

const Error = ({ error, resetError }) => {
    const handleReload = () => {
        window.location.reload()
    }

    const handleGoHome = () => {
        window.location.href = '/'
    }

    return (
        <div className={styles.errorContainer}>
            <h1>{i18n.t('Oops! An error occurred.')}</h1>
            <p>{i18n.t('Something went wrong in the application.')}</p>

            {error && (
                <div className={styles.errorDetails}>
                    <h3>{i18n.t('Error details:')}</h3>
                    <pre className={styles.errorMessage}>{error.message}</pre>
                    {error.stack && (
                        <details className={styles.stackTrace}>
                            <summary>{i18n.t('Stack trace (development)')}</summary>
                            <pre>{error.stack}</pre>
                        </details>
                    )}
                </div>
            )}

            <div className={styles.buttonGroup}>
                {resetError && (
                    <Button onClick={resetError} label={i18n.t('Retry')} />
                )}
                <Button onClick={handleGoHome} label={i18n.t('Back to home')} />
            </div>
        </div>
    )
}

const routes = createHashRouter([
    {
        path: '/',
        element: <ErrorBoundaryLayout />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'malaria-trend', element: <MalariaTrend /> },
            { path: 'malaria-climate', element: <MalariaClimate /> },
            { path: 'diarrhea-climate', element: <DiarrheaClimate /> },
            { path: 'diarrhea-trend', element: <DiarrheaTrend /> },
            { path: 'ira-climate', element: <IraClimate /> },
            { path: 'ira-trend', element: <IraTrend /> },
            { path: 'help', element: <HowItWork /> },
            { path: '*', element: <Error /> }
        ]
    }
])

const Router = () => {
    return <RouterProvider router={routes} />
}

export default Router