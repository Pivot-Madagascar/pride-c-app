import { render, screen } from '@testing-library/react'
import StatisticCardItem from '../index.jsx'
import '@testing-library/jest-dom'

const getByFormattedText = (formattedText) => {
    return screen.getByText((content, element) => {
        // Remove non-breaking spaces from element textContent
        const elementText = element.textContent.replace(/\u202F/g, ' ')
        // Normalize the text for comparison
        const normalizedText = formattedText.replace(/\u202F/g, ' ')
        // Compare the normalized text content with the formatted value
        return elementText === normalizedText
    })
}

describe('StatisticCardItem Component', () => {
    const mockItem = {
        title: 'malaria',
        indicators: [
            {
                name: 'incidence',
                label: 'incidence',
                value: 11111,
            },
            {
                name: 'csbCases',
                label: 'csb cases',
                value: 22222,
            },
            {
                name: 'comCases',
                label: 'com cases',
                value: 33333,
            },
            {
                name: 'csbVigilance',
                label: 'csb vigilance',
                value: 44444,
            },
        ],
        bgColor: '#ED0423',
        fontSize: 2,
        href: 'malaria',
    }

    it('renders without crashing and displays the correct values', () => {
        const { getByTestId } = render(
            <StatisticCardItem item={mockItem} />
        )

        const titleElement = getByTestId('title')
        expect(titleElement).toHaveTextContent(mockItem.title)

        const formattedIncidences = `${mockItem.indicators[0].value.toLocaleString(
            'fr-FR',
            { style: 'decimal', useGrouping: true }
        )}`
        const incidencesElement = getByFormattedText(formattedIncidences)
        expect(incidencesElement).toBeInTheDocument()

        const formattedCsbCases = `${mockItem.indicators[1].value.toLocaleString(
            'fr-FR',
            { style: 'decimal', useGrouping: true }
        )}`
        const csbCasesElement = getByFormattedText(formattedCsbCases)
        expect(csbCasesElement).toBeInTheDocument()

        const formattedComCases = `${mockItem.indicators[1].value.toLocaleString(
            'fr-FR',
            { style: 'decimal', useGrouping: true }
        )}`
        const comCasesElement = getByFormattedText(formattedComCases)
        expect(comCasesElement).toBeInTheDocument()

        const formattedCsbVigilance = `${mockItem.indicators[3].value.toLocaleString(
            'fr-FR',
            { style: 'decimal', useGrouping: true }
        )}`
        const csbVigilanceElement = getByFormattedText(formattedCsbVigilance)
        expect(csbVigilanceElement).toBeInTheDocument()
    })
})
