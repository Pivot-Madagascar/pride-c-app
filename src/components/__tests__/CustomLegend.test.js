import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import CustomLegend from '../LineChart/CustomLegend'

const mockOnClick = jest.fn()
const mockOnShowPredictionChange = jest.fn()

const datasets = [
    {
        label: 'Current year',
        backgroundColor: 'blue',
        hidden: false,
        prediction: true,
    },
    {
        label: 'year 1',
        backgroundColor: 'green',
        hidden: false,
    },
    {
        label: 'year 2',
        backgroundColor: 'red',
        hidden: false,
    },
    {
        label: 'Maximum',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        hidden: false,
    },
    {
        label: 'Minimum',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        hidden: false,
    },
]

describe('CustomLegend', () => {
    it('renders correctly with datasets', () => {
        const { getByText } = render(
            <CustomLegend
                datasets={datasets}
                onClick={mockOnClick}
                onShowPredictionChange={mockOnShowPredictionChange}
            />
        )

        // const title = getByText('Legendes:')
        // expect(title).toBeInTheDocument()

        datasets.slice(0, -2).forEach((dataset) => {
            const currentLabel = getByText(dataset.label)
            expect(currentLabel).toBeInTheDocument()
        })

        const lastButtonLabel = getByText('95% intervalle de confiance')
        expect(lastButtonLabel).toBeInTheDocument()
    })

    it('calls onClick with correct index when a legend item is clicked', () => {
        const { getAllByRole, getByText } = render(
            <CustomLegend
                datasets={datasets}
                onClick={mockOnClick}
                onShowPredictionChange={mockOnShowPredictionChange}
            />
        )

        const legendItems = getAllByRole('button')
        fireEvent.click(legendItems[0])
        expect(mockOnClick).toHaveBeenCalledWith([0])

        const lastButtonLabel = getByText('95% intervalle de confiance')
        fireEvent.click(lastButtonLabel)

        expect(mockOnClick).toHaveBeenCalledWith([
            datasets.length - 2,
            datasets.length - 1,
        ])
    })

    it('renders with line-through text decoration when dataset is hidden', () => {
        const datasetsWithHidden = datasets.map((dataset, index) =>
            index === 0 ? { ...dataset, hidden: true } : dataset
        )

        const { getByText } = render(
            <CustomLegend
                datasets={datasetsWithHidden}
                onClick={mockOnClick}
                onShowPredictionChange={mockOnShowPredictionChange}
            />
        )

        const hiddenItem = getByText(datasetsWithHidden[0].label)
        expect(hiddenItem).toHaveStyle('text-decoration-line: line-through')
    })
})
