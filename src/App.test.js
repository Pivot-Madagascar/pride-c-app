import { render } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import MyApp from './App'

describe('MyApp Component', () => {
    it('renders without crashing', () => {
        render(<MyApp />)
    })

    it('renders the container div with correct class', async () => {
        const { getByTestId } = render(<MyApp />)
        const myApp = getByTestId('my-app')
        expect(myApp).toBeInTheDocument()
    })
})
