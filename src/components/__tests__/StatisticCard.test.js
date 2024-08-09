import { render, screen} from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import StatisticCard from '../StatisticCard/index'

const getByFormattedText = (formattedText) => {
    return screen.getByText((content, element) => {
        // Remove non-breaking spaces from element textContent
        const elementText = element.textContent.replace(/\u202F/g, ' ');
        // Normalize the text for comparison
        const normalizedText = formattedText.replace(/\u202F/g, ' ');
        // Compare the normalized text content with the formatted value
        return elementText === normalizedText;
    });
};

describe('StatisticCard Component', () => {
    const mockItem = {
        title: 'Incidence (par 100K)',
        value: 70000,
        percentage: 11.1,
        description: 'Par rapport à l’année dernière'
    }

    it('renders and displays the correct title, value, percentage, and description', () => {
        const { getByTestId, getByText } = render(<StatisticCard item={mockItem} bgColor='yellow' />)
        
        // Check title
        const titleElement = getByTestId('title')
        expect(titleElement).toBeInTheDocument()
        expect(titleElement).toHaveTextContent(mockItem.title)

        // Check value
        const formattedValue = mockItem.value.toLocaleString('fr-FR', { style: 'decimal', useGrouping: true })
        const valueElement = getByFormattedText(formattedValue)
        expect(valueElement).toBeInTheDocument()

        // Check percentage
        const formattedPercentage = `${mockItem.percentage.toLocaleString('fr-FR', { style: 'decimal', useGrouping: true })}%`
        const percentageElement = getByText(formattedPercentage)
        expect(percentageElement).toBeInTheDocument()

        // Check description
        const descriptionElement = getByTestId('comparison-description')
        expect(descriptionElement).toBeInTheDocument()
        expect(descriptionElement).toHaveTextContent(mockItem.description)
    })
})
