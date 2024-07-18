import { render } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import { Line } from 'react-chartjs-2'
import ClimateLineChart from '../ClimateLineChart/index'

jest.mock('react-chartjs-2', () => ({
    Line: jest.fn(() => null),
}))

describe('ClimateLineChart', () => {
    const mockData = {
        labels: ['January', 'February', 'March', 'April'],
        datasets: [
            {
                label: 'Dataset 1',
                data: [65, 59, 80, 81],
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    }

    test('renders ClimateLineChart component', () => {
        const { getByTestId } = render(
            <ClimateLineChart
                data={mockData}
                title="Mock Title"
                xAxisText="X Axis"
                yAxisText="Y Axis"
                height="400px"
            />
        )

        const lineChart = getByTestId('line-chart')
        expect(lineChart).toBeInTheDocument()

        expect(Line).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    labels: mockData.labels,
                    datasets: mockData.datasets,
                }),
            }),
            expect.any(Object)
        )
    })

    test('updates chart width on resize', () => {
        const { getByTestId } = render(
            <ClimateLineChart
                data={mockData}
                title="Mock Title"
                xAxisText="X Axis"
                yAxisText="Y Axis"
                height="400px"
            />
        )

        const lineChart = getByTestId('line-chart')
        expect(lineChart).toBeInTheDocument()

        global.dispatchEvent(new Event('resize'))

        expect(lineChart).toBeInTheDocument()
    })
})
