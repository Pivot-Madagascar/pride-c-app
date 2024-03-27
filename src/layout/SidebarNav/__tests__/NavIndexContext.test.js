import { render, act } from '@testing-library/react'
import React from 'react'
import { NavIndexProvider, useNavIndex } from '../NavIndexContext'

describe('NavIndexProvider', () => {
    test('provides navIndex state to children', () => {
        const TestComponent = () => {
            const { navIndex, setNavIndex } = useNavIndex()

            return (
                <div>
                    <span data-testid="navIndex">{navIndex}</span>
                    <button onClick={() => setNavIndex(1)}>
                        Set Nav Index
                    </button>
                </div>
            )
        }

        const { getByTestId, getByText } = render(
            <NavIndexProvider>
                <TestComponent />
            </NavIndexProvider>
        )

        expect(getByTestId('navIndex').textContent).toBe('0')

        act(() => {
            getByText('Set Nav Index').click()
        })

        expect(getByTestId('navIndex').textContent).toBe('1')
    })
})
