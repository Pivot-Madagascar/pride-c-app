import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import MetricsCard from '../Metrics/index'

const getByFormattedText = (formattedText) => {
    return screen.getAllByText((content, element) => {
        // Remove non-breaking spaces from element textContent
        const elementText = element.textContent.replace(/\u202F/g, ' ')
        // Normalize the text for comparison
        const normalizedText = formattedText.replace(/\u202F/g, ' ')
        // Compare the normalized text content with the formatted value
        return elementText === normalizedText
    })
}

describe('MetricsCard Component', () => {
    const mockItem = {
        label: 'Incidence (par 100K)',
        value: 70000,
        comparison: 10,
        periods: {
            current: {
                start: 'Févr. 2025',
                end: 'Avr. 2025',
            },
            comparison: {
                start: 'Févr. 2024',
                end: 'Avr. 2024',
            },
        },
        isPercent: false,
    }

    it('renders and displays the correct title, animated value, percentage, and description', async () => {
        const { getByTestId, getByText } = render(
            <MetricsCard item={mockItem} bgColor="yellow" />
        )

        const titleElement = getByTestId('title')
        expect(titleElement).toBeInTheDocument()
        expect(titleElement).toHaveTextContent(mockItem.label)

        const formattedValue = mockItem.value.toLocaleString('fr-FR', {
            style: 'decimal',
            useGrouping: true,
        })

        await waitFor(() => {
            const valueElements = getByFormattedText(formattedValue)
            expect(valueElements.length).toBeGreaterThan(0)
            expect(valueElements[0]).toBeInTheDocument()
        })

        const formattedComparison = `${mockItem.comparison.toLocaleString(
            'fr-FR',
            { style: 'decimal', useGrouping: true }
        )}`
        const percentageElement = getByText(formattedComparison)
        expect(percentageElement).toBeInTheDocument()

        const descriptionElement = getByTestId('comparison-description')
        expect(descriptionElement).toBeInTheDocument()
        expect(descriptionElement).toHaveTextContent('Entre Févr. 2025 et Avr. 2025,par rapport à Févr. 2024 et Avr. 2024')
    })
})
