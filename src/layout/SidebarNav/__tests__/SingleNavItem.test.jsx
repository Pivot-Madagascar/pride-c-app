import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import '@testing-library/jest-dom'
import { NavIndexProvider } from '../NavIndexContext.jsx'
import NavItem from '../SingleNavItem'

describe('NavItem Component', () => {
    const mockItem = {
        path: '/test',
        title: 'Test Item',
        icon: jest.fn().mockReturnValue(<svg />),
        colors: {
            fontColor: '#FFFFFF',
            bgColor: '#000000',
        },
    }

    it('renders NavItem component correctly', () => {
        const { getByText } = render(
            <Router>
                <NavIndexProvider>
                    <NavItem item={mockItem} />
                </NavIndexProvider>
            </Router>
        )
        expect(getByText('Test Item')).toBeInTheDocument()
    })
})
