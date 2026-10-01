import React from 'react'
import Button from '@/components/Button'
import styles from './ErrorPage.module.scss'

const ErrorPage = ({ error, resetError }) => {
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

export default ErrorPage