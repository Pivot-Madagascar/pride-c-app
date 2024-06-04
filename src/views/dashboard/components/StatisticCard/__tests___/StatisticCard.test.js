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
    bgColor: '#ffffff',
    fontSize: 1,
    title: 'Test Title',
    incidences: 80000,
    totalCase: 50000,
    trend: 10,
  }

  test('renders without crashing and displays the correct values', () => {
    const { getByTestId, getByText } = render(<StatisticCardItem item={mockItem} />)

    const titleElement = getByTestId('title')
    expect(titleElement).toHaveTextContent(mockItem.title)

    const formattedIncidences = `${mockItem.incidences.toLocaleString('fr-FR', { style: 'decimal', useGrouping: true })}`
    const incidencesElement = getByFormattedText(formattedIncidences)
    expect(incidencesElement).toBeInTheDocument()

    const formattedTotalCase = `${mockItem.totalCase.toLocaleString('fr-FR', { style: 'decimal', useGrouping: true })}`
    const totalCaseElement = getByFormattedText(formattedTotalCase)
    expect(totalCaseElement).toBeInTheDocument()

    const trendElement = getByText(`+${mockItem.trend}%`)
    expect(trendElement).toBeInTheDocument()

    const gaugeChart = getByTestId('gauge-chart')
    expect(gaugeChart).toBeVisible()
  })
})
