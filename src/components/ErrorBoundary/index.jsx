import React from 'react'
import ErrorPage from '@/components/ErrorPage'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by ErrorBoundary:', error, errorInfo)
        this.setState({
            errorInfo: errorInfo
        })
    }

    resetError = () => {
        this.setState({ hasError: false, error: null, errorInfo: null })
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorPage 
                    error={this.state.error} 
                    errorInfo={this.state.errorInfo}
                    resetError={this.resetError}
                />
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary