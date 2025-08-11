import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ErrorBoundary from '../ErrorBoundary'
import ErrorPage from '../ErrorPage'

// Mock the ErrorPage component
jest.mock('../ErrorPage', () => {
  return function MockErrorPage({ error, errorInfo, onReset }) {
    return (
      <div data-testid="error-page">
        <div data-testid="error-message">{error?.message}</div>
        <div data-testid="error-info">{errorInfo?.componentStack}</div>
        <button onClick={onReset} data-testid="reset-button">
          Reset Error
        </button>
      </div>
    )
  }
})

// Test component that throws an error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div data-testid="normal-component">Normal Component</div>
}

// Test component that renders children
const TestChild = () => <div data-testid="test-child">Test Child</div>

describe('ErrorBoundary', () => {
  // Suppress console.error for tests to avoid noise
  const originalConsoleError = console.error
  beforeAll(() => {
    console.error = jest.fn()
  })

  afterAll(() => {
    console.error = originalConsoleError
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Normal rendering', () => {
    it('renders children when there is no error', () => {
      render(
        <ErrorBoundary>
          <TestChild />
        </ErrorBoundary>
      )

      expect(screen.getByTestId('test-child')).toBeInTheDocument()
      expect(screen.queryByTestId('error-page')).not.toBeInTheDocument()
    })

    it('renders multiple children when there is no error', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </ErrorBoundary>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
    })
  })

  describe('Error handling', () => {
    it('catches errors and displays ErrorPage', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByTestId('error-page')).toBeInTheDocument()
      expect(screen.getByTestId('error-message')).toHaveTextContent('Test error')
      expect(screen.queryByTestId('normal-component')).not.toBeInTheDocument()
    })

    it('logs error to console when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(console.error).toHaveBeenCalledWith(
        'Error caught by ErrorBoundary:',
        expect.any(Error),
        expect.any(Object)
      )
    })

    it('passes error and errorInfo to ErrorPage', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByTestId('error-message')).toHaveTextContent('Test error')
      expect(screen.getByTestId('error-info')).toBeInTheDocument()
    })

    it('passes resetError function to ErrorPage', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByTestId('reset-button')).toBeInTheDocument()
    })
  })

  describe('Static methods', () => {
    it('getDerivedStateFromError returns correct state', () => {
      const error = new Error('Test error')
      const newState = ErrorBoundary.getDerivedStateFromError(error)

      expect(newState).toEqual({
        hasError: true,
        error: error
      })
    })
  })

  describe('Component lifecycle', () => {
    it('has correct initial state', () => {
      let errorBoundaryInstance

      class TestErrorBoundary extends ErrorBoundary {
        constructor(props) {
          super(props)
          errorBoundaryInstance = this
        }
      }

      render(
        <TestErrorBoundary>
          <TestChild />
        </TestErrorBoundary>
      )

      expect(errorBoundaryInstance.state).toEqual({
        hasError: false,
        error: null,
        errorInfo: null
      })
    })

    it('updates errorInfo in componentDidCatch', () => {
      let errorBoundaryInstance

      class TestErrorBoundary extends ErrorBoundary {
        constructor(props) {
          super(props)
          errorBoundaryInstance = this
        }
      }

      render(
        <TestErrorBoundary>
          <ThrowError shouldThrow={true} />
        </TestErrorBoundary>
      )

      expect(errorBoundaryInstance.state.errorInfo).toBeTruthy()
      expect(errorBoundaryInstance.state.errorInfo.componentStack).toBeDefined()
    })
  })

  describe('Edge cases', () => {
    it('handles errors with no message', () => {
      const ThrowErrorWithoutMessage = () => {
        throw new Error()
      }

      render(
        <ErrorBoundary>
          <ThrowErrorWithoutMessage />
        </ErrorBoundary>
      )

      expect(screen.getByTestId('error-page')).toBeInTheDocument()
    })

    it('handles non-Error objects being thrown', () => {
      const ThrowString = () => {
        throw 'String error'
      }

      render(
        <ErrorBoundary>
          <ThrowString />
        </ErrorBoundary>
      )

      expect(screen.getByTestId('error-page')).toBeInTheDocument()
    })

    it('renders nothing when children is null', () => {
      const { container } = render(<ErrorBoundary>{null}</ErrorBoundary>)
      expect(container.firstChild).toBeNull()
    })
  })
})