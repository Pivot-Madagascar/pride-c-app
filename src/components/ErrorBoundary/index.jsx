import React, { Component } from 'react'

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error) {
        // Reset error and errorInfo for clarity
        return { hasError: true, error, errorInfo: null }
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo })

        if (process.env.NODE_ENV === 'development') {
            console.error('Error caught by ErrorBoundary:', error)
            console.error('Error details:', errorInfo)
        }
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={styles.container} role="alert">
                    <h1 style={styles.title}>Oops! Something went wrong.</h1>
                    <p style={styles.message}>
                        {process.env.NODE_ENV === 'development'
                            ? this.state.error?.message || 'Unknown error.'
                            : 'An unexpected error occurred. Please try again.'}
                    </p>
                    <button onClick={this.handleRetry} style={styles.button}>
                        Try Again
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}

const styles = {
    container: {
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'sans-serif',
        backgroundColor: '#fef2f2',
        color: '#991b1b',
        border: '1px solid #fca5a5',
        borderRadius: '0.5rem',
        maxWidth: '600px',
        margin: '5rem auto',
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    message: {
        margin: '1rem 0',
    },
    button: {
        padding: '0.5rem 1rem',
        backgroundColor: '#dc2626',
        color: '#fff',
        border: 'none',
        borderRadius: '0.375rem',
        cursor: 'pointer',
    },
}
