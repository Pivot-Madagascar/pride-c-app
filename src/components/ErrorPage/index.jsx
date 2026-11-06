import React from 'react'
import Button from '@/components/Button'
import { clearCache } from '@/utils/dataManagement'
import styles from './ErrorPage.module.scss'

const ErrorPage = ({ error, resetError }) => {
    const handleReload = () => {
        window.location.reload()
    }

    // Stay inside the app (hash router): '/' would leave a DHIS2-hosted app
    const handleGoHome = () => {
        window.location.hash = '#/'
        window.location.reload()
    }

    // Recover from a corrupted/outdated Redux cache without manual browser cleanup
    const handleResetData = async () => {
        await clearCache()
        handleGoHome()
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
                <Button onClick={handleResetData} label="Réinitialiser les données" />
            </div>
        </div>
    )
}

export default ErrorPage