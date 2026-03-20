import React from 'react'
import {
    createHashRouter,
    RouterProvider,
    createRoutesFromElements,
    Route
} from 'react-router-dom'
import { Button, ErrorBoundaryLayout, ErrorPage } from '../../components'
import styles from '../../components/ErrorPage/ErrorPage.module.scss'
import Dashboard from '../../views/dashboard/dashboard'
import DiarrheaClimate from '../../views/diarrhea/diarrheaClimate'
import DiarrheaTrend from '../../views/diarrhea/diarrheaTrend'
import HowItWork from '../../views/help'
import IraClimate from '../../views/ira/iraClimate'
import IraTrend from '../../views/ira/iraTrend'
import MalariaClimate from '../../views/malaria/malariaClimate'
import MalariaTrend from '../../views/malaria/malariaTrend'

const Error = ({ error, resetError }) => {
    const handleReload = () => {
        window.location.reload()
    }

    const handleGoHome = () => {
        window.location.href = '/'
    }

    return (
        <div className={styles.errorContainer}>
            <h1>Oups! Une erreur s'est produite.</h1>
            <p>Quelque chose s'est mal passé dans l'application.</p>
            
            {error && (
                <div className={styles.errorDetails}>
                    <h3>Détails de l'erreur:</h3>
                    <pre className={styles.errorMessage}>{error.message}</pre>
                    {error.stack && (
                        <details className={styles.stackTrace}>
                            <summary>Stack trace (développement)</summary>
                            <pre>{error.stack}</pre>
                        </details>
                    )}
                </div>
            )}
            
            <div className={styles.buttonGroup}>
                {resetError && (
                    <Button onClick={resetError} label="Réessayer" />
                )}
                <Button onClick={handleGoHome} label="Retour à l'accueil" />
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