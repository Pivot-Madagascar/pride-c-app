import { render } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import ClimateStatisticCard from '../ClimateStatisticCard'

describe('ClimateStatisticCard', () => {
    const mockItem = {
        icon: jest.fn(({ width, height, color }) => (
            <svg
                width={width}
                height={height}
                fill={color}
                data-testid="mock-icon"
            />
        )),
        title: 'Temperature',
        value: 23.45,
    }

    test('renders the ClimateStatisticCard component', () => {
        const { getByTestId } = render(
            <ClimateStatisticCard item={mockItem} bgColor="#FFF" />
        )

        const titleElement = getByTestId('title')
        expect(titleElement).toHaveTextContent('Temperature')

        const mainContentElement = getByTestId('main-content')
        expect(mainContentElement).toHaveTextContent('23,45')

        const iconElement = getByTestId('mock-icon')
        expect(iconElement).toBeInTheDocument()
        expect(iconElement).toHaveAttribute('width', '48')
        expect(iconElement).toHaveAttribute('height', '48')
        expect(iconElement).toHaveAttribute('fill', '#343B4F')
    })
})
