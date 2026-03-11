import React from 'react'
import Button from '../Button'
import styles from './ErrorPage.module.scss'
import i18n from '../../locales'

const ErrorPage = ({ error, resetError }) => {
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

export default ErrorPage