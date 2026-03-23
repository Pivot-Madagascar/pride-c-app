import { render, screen, waitFor, act } from '@testing-library/react'
import StatisticCard from '../index.jsx'
import '@testing-library/jest-dom'

const getByFormattedText = (formattedText) => {
    return screen.getAllByText((content, element) => {
        const elementText = element.textContent.replace(/\u202F/g, ' ').trim()
        const normalizedText = formattedText.replace(/\u202F/g, ' ').trim()
        return elementText.includes(normalizedText) || normalizedText.includes(elementText)
    })
}

describe('StatisticCard Component', () => {
    const mockItem = {
        title: 'malaria',
        indicators: [
            { name: 'incidence', label: 'incidence', value: 11111 },
            { name: 'csbCases', label: 'csb cases', value: 22222 },
            { name: 'comCases', label: 'com cases', value: 33333 },
            { name: 'csbVigilance', label: 'csb vigilance', value: 44444 },
        ],
        bgColor: '#ED0423',
        fontSize: 2,
        href: 'malaria',
    }
    const mockPeriods = { start: 'January 2025', end: 'February 2025' }

    it('renders without crashing and displays the correct values', async () => {
        await act(async () => {
            render(<StatisticCard item={mockItem} periods={mockPeriods} />)
            await new Promise((resolve) => setTimeout(resolve, 1000)) // Optional: wait time
        })

        const titleElement = screen.getByTestId('main-title')
        expect(titleElement).toHaveTextContent(mockItem.title)

        const subTitleElement = screen.getByTestId('sub-title')
        expect(subTitleElement).toHaveTextContent(
            `Entre le mois de ${mockPeriods.start} et ${mockPeriods.end}`
        )

        const formattedIncidences = `${mockItem.indicators[0].value.toLocaleString(
            'fr-FR',
            { style: 'decimal', useGrouping: true }
        )}`
        const incidencesElements = getByFormattedText(formattedIncidences)
        expect(incidencesElements.length).toBeGreaterThan(0)
        incidencesElements.forEach((element) => {
            expect(element).toBeInTheDocument()
        })

        const formattedCsbCases = `${mockItem.indicators[1].value.toLocaleString(
            'fr-FR',
            { style: 'decimal', useGrouping: true }
        )}`
        const csbCasesElements = getByFormattedText(formattedCsbCases)
        expect(csbCasesElements.length).toBeGreaterThan(0)
        csbCasesElements.forEach((element) => {
            expect(element).toBeInTheDocument()
        })

        const formattedComCases = `${mockItem.indicators[2].value.toLocaleString(
            'fr-FR',
            { style: 'decimal', useGrouping: true }
        )}`
        const comCasesElements = getByFormattedText(formattedComCases)
        expect(comCasesElements.length).toBeGreaterThan(0)
        comCasesElements.forEach((element) => {
            expect(element).toBeInTheDocument()
        })

        const formattedCsbVigilance = `${mockItem.indicators[3].value.toLocaleString(
            'fr-FR',
            { style: 'decimal', useGrouping: true }
        )}`
        const csbVigilanceElements = getByFormattedText(formattedCsbVigilance)
        expect(csbVigilanceElements.length).toBeGreaterThan(0)
        csbVigilanceElements.forEach((element) => {
            expect(element).toBeInTheDocument()
        })
    })
})
