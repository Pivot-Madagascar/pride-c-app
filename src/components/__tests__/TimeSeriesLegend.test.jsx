import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import TimeSeriesLegend from '@/components/TimeSeriesChart/TimeSeriesLegend'

const mockOnClick = jest.fn()
const mockOnShowPredictionChange = jest.fn()

const baseDatasets = [
    {
        year: 'Current year',
        backgroundColor: 'blue',
        hidden: false,
        prediction: true,
        data: [1, 2, 3],
    },
    {
        year: 'Year 1',
        backgroundColor: 'green',
        hidden: false,
        data: [4, 5, 6],
    },
    {
        year: 'Year 2',
        backgroundColor: 'red',
        hidden: false,
        data: [7, 8, 9],
    },
    {
        year: 'Extra',
        backgroundColor: 'gray',
        hidden: false,
        data: [10, 11, 12],
    },
    {
        label: 'Maximum',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        hidden: false,
        data: [15],
    },
    {
        label: 'Minimum',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        hidden: false,
        data: [1],
    },
]

describe('TimeSeriesLegend', () => {
    beforeEach(() => {
        mockOnClick.mockClear()
        mockOnShowPredictionChange.mockClear()
    })

    it('renders legend section only if there are more than 3 datasets', () => {
        render(
            <TimeSeriesLegend
                datasets={baseDatasets}
                onClick={mockOnClick}
                onShowPredictionChange={mockOnShowPredictionChange}
            />
        )
        expect(screen.getByText('Legendes:')).toBeInTheDocument()
    })

    it('renders the correct dataset labels', () => {
        render(
            <TimeSeriesLegend
                datasets={baseDatasets}
                onClick={mockOnClick}
                onShowPredictionChange={mockOnShowPredictionChange}
            />
        )

        // Only items from slice(0, -4), so the first 2 datasets
        expect(screen.getByText('Current year')).toBeInTheDocument()
        expect(screen.getByText('Year 1')).toBeInTheDocument()
    })

    it('renders the Prediction checkbox when Maximum and Minimum datasets have data', () => {
        render(
            <TimeSeriesLegend
                datasets={baseDatasets}
                onClick={mockOnClick}
                onShowPredictionChange={mockOnShowPredictionChange}
            />
        )

        const predictionCheckbox = screen.getByText('Prediction')
        expect(predictionCheckbox).toBeInTheDocument()
        expect(mockOnShowPredictionChange).toHaveBeenCalledWith(true)
    })

    it('toggles prediction checkbox and calls onShowPredictionChange', () => {
        render(
            <TimeSeriesLegend
                datasets={baseDatasets}
                onClick={mockOnClick}
                onShowPredictionChange={mockOnShowPredictionChange}
            />
        )

        const predictionButton = screen.getByText('Prediction').closest('div[role="button"]')
        fireEvent.click(predictionButton)

        expect(mockOnShowPredictionChange).toHaveBeenCalledWith(false)
    })

    it('calls onClick when a legend item is clicked', () => {
        render(
            <TimeSeriesLegend
                datasets={baseDatasets}
                onClick={mockOnClick}
                onShowPredictionChange={mockOnShowPredictionChange}
            />
        )

        const legendItem = screen.getByText('Current year').closest('div[role="button"]')
        fireEvent.click(legendItem)

        expect(mockOnClick).toHaveBeenCalledWith([0])
    })

    it('shows unchecked checkbox when dataset is hidden', () => {
        const hiddenDatasets = baseDatasets.map((d, i) =>
            i === 0 ? { ...d, hidden: true } : d
        )

        render(
            <TimeSeriesLegend
                datasets={hiddenDatasets}
                onClick={mockOnClick}
                onShowPredictionChange={mockOnShowPredictionChange}
            />
        )

        const checkboxes = screen.getAllByRole('checkbox')
        // The first one corresponds to the first dataset (which is hidden)
        expect(checkboxes[0]).not.toBeChecked()

        // Optionally check that the label is still rendered
        expect(screen.getByText('Current year')).toBeInTheDocument()
    })

    it('does not render anything if datasets is less than or equal to 3', () => {
        const shortDatasets = baseDatasets.slice(0, 3)

        render(
            <TimeSeriesLegend
                datasets={shortDatasets}
                onClick={mockOnClick}
                onShowPredictionChange={mockOnShowPredictionChange}
            />
        )

        expect(screen.queryByText('Legendes:')).not.toBeInTheDocument()
    })

    it('filters out hidden datasets when hideForCapture is true', () => {
        const modifiedDatasets = baseDatasets.map((d, i) =>
            i === 0 ? { ...d, hidden: true } : d
        )

        render(
            <TimeSeriesLegend
                datasets={modifiedDatasets}
                onClick={mockOnClick}
                onShowPredictionChange={mockOnShowPredictionChange}
                hideForCapture={true}
            />
        )

        expect(screen.queryByText('Current year')).not.toBeInTheDocument()
        expect(screen.getByText('Year 1')).toBeInTheDocument()
    })
})
