import { render } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import ClimateStatisticCard from '@/components/ClimateStatisticCard'

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
        value: 23456.78,
    }

    test('renders the ClimateStatisticCard component with correct props and formatting', () => {
        const { getByTestId } = render(
            <ClimateStatisticCard item={mockItem} bgColor="#FFF" />
        )

        // Title
        const titleElement = getByTestId('title')
        expect(titleElement).toHaveTextContent('Temperature')

        // Main value content: should format with spaces
        const mainContentElement = getByTestId('main-content')
        expect(mainContentElement).toHaveTextContent('23 456.78')

        // Icon
        const iconElement = getByTestId('mock-icon')
        expect(iconElement).toBeInTheDocument()
        expect(iconElement).toHaveAttribute('width', '48')
        expect(iconElement).toHaveAttribute('height', '48')
        expect(iconElement).toHaveAttribute('fill', '#343B4F')
    })
})
