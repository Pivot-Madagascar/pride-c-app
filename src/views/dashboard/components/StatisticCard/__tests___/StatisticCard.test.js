import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import StatisticCardItem from '../index'

describe('StatisticCardItem', () => {
  const mockItem = {
    bgColor: '#ffffff',
    fontSize: 1,
    title: 'Test Title',
    incidences: 100,
    totalCase: 200,
    trend: 10,
  }

  it('renders without crashing', () => {
    render(<StatisticCardItem item={mockItem} />)
  })

  it('displays the correct title', () => {
    const { getByTestId, getByText } = render(<StatisticCardItem item={mockItem} />)
    const titleSection = getByTestId('title')
    const titleText = getByText('Test Title')
    expect(titleSection).toBeVisible()
    expect(titleText).toBeInTheDocument()
  })

  it('displays the correct incidence value', () => {
    const { getByText } = render(<StatisticCardItem item={mockItem} />)
    expect(getByText('100')).toBeInTheDocument()
  })

  it('displays the correct total case value', () => {
    const { getByText } = render(<StatisticCardItem item={mockItem} />)
    expect(getByText('200')).toBeInTheDocument()
  })

  it('displays the correct trend value', () => {
    const { getByText } = render(<StatisticCardItem item={mockItem} />)
    expect(getByText('+10%')).toBeInTheDocument()
  })

  it('display the gauge chart', () => {
    const { getByTestId } = render(<StatisticCardItem item={mockItem} />)
    const gaugeChart = getByTestId('gauge-chart')
    expect(gaugeChart).toBeVisible()
  })
})
