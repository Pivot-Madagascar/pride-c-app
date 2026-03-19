import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import MetricsCard from '../Metrics/index'

const getByFormattedText = (formattedText) => {
    return screen.getAllByText((content, element) => {
        const elementText = element.textContent.replace(/\u202F/g, ' ')
        const normalizedText = formattedText.replace(/\u202F/g, ' ')
        return elementText === normalizedText
    })
}

describe('MetricsCard Component', () => {
    const mockItem = {
        label: 'Incidence (par 100K)',
        value: 70000,
        comparison: 10,
        description: 'Comparé à la période précédente',
        isPercent: false,
    }

    it('renders and displays the correct title, animated value, comparison, and description', async () => {
        render(<MetricsCard item={mockItem} bgColor="yellow" />)

        // Title check
        const titleElement = screen.getByTestId('title')
        expect(titleElement).toBeInTheDocument()
        expect(titleElement).toHaveTextContent(mockItem.label)

        // Wait for animation and formatted value
        const formattedValue = mockItem.value.toLocaleString('fr-FR', {
            style: 'decimal',
            useGrouping: true,
        })

        await waitFor(() => {
            const valueElements = getByFormattedText(formattedValue)
            expect(valueElements.length).toBeGreaterThan(0)
        })

        // Comparison
        const formattedComparison = mockItem.comparison.toLocaleString('fr-FR')
        const comparisonElement = screen.getByTestId('comparison-data')
        expect(comparisonElement).toHaveTextContent(formattedComparison)
        expect(comparisonElement).toHaveTextContent('▲') // upward triangle for positive value

        // Description
        const descriptionElement = screen.getByTestId('comparison-description')
        expect(descriptionElement).toBeInTheDocument()
        expect(descriptionElement).toHaveTextContent(mockItem.description)
    })

    it('renders correctly when value is not provided', () => {
        const mockItemNoValue = {
            label: 'Cas confirmés',
            value: null,
            comparison: -5,
            description: 'Données manquantes',
            isPercent: false,
        }

        render(<MetricsCard item={mockItemNoValue} bgColor="gray" />)

        // Should show transparent placeholder
        const mainContent = screen.getByTestId('main-content')
        expect(mainContent).toHaveTextContent('--')

        // Should still render description with transparent fallback style
        const description = screen.getByTestId('comparison-description')
        expect(description).toBeInTheDocument()
        expect(description).toHaveTextContent('Données manquantes')

        // Should show overlay message
        expect(screen.getByText('Information non disponible')).toBeInTheDocument()
    })
})
