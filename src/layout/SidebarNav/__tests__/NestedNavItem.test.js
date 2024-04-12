import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import { NavIndexProvider, useNavIndex } from '../NavIndexContext'
import NavItem from '../NestedNavItem'

jest.mock('../NavIndexContext', () => ({
    ...jest.requireActual('../NavIndexContext'),
    useNavIndex: jest.fn(),
}))

describe('NavItem Component', () => {
    const mockItem = {
        title: 'Test Item',
        icon: jest.fn().mockReturnValue(<div>Mock Icon</div>),
        colors: {
            fontColor: '#FFFFFF',
            bgColor: '#000000',
        },
        nestedMenu: [
            {
                title: 'Nested Item 1',
                path: '/nested-item-1',
                icon: jest.fn().mockReturnValue(<div>Nested Mock Icon 1</div>),
            },
            {
                title: 'Nested Item 2',
                path: '/nested-item-2',
                icon: jest.fn().mockReturnValue(<div>Nested Mock Icon 2</div>),
            },
        ],
    }

    beforeEach(() => {
        useNavIndex.mockReturnValue({ navIndex: 0, setNavIndex: jest.fn() })
    })

    it('renders NavItem component correctly', () => {
        const { getByText } = render(
            <BrowserRouter>
                <NavIndexProvider>
                    <NavItem item={mockItem} index={0} />
                </NavIndexProvider>
            </BrowserRouter>
        )
        expect(getByText('Test Item')).toBeInTheDocument()
    })

    it('renders nested menu when open', () => {
        const { getByText } = render(
            <BrowserRouter>
                <NavIndexProvider>
                    <NavItem item={mockItem} index={0} />
                </NavIndexProvider>
            </BrowserRouter>
        )
        const listItemButton = getByText('Test Item')
        fireEvent.click(listItemButton)
        expect(getByText('Nested Item 1')).toBeInTheDocument()
        expect(getByText('Nested Item 2')).toBeInTheDocument()
    })
})
