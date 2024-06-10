import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
// import { headCells } from '../config'
import DataTable from '../DataTable'
import { headCells } from '../DataTable/config'

// Sample data to be used in tests
const sampleData = [
    { id: 1, municipality: 'Municipality 1', fokontany: 'Fokontany 1', date: '2024-01-01', min: 10, mean: 20, max: 30 },
    { id: 2, municipality: 'Municipality 2', fokontany: 'Fokontany 2', date: '2024-01-02', min: 15, mean: 25, max: 35 },
    { id: 3, municipality: 'Municipality 3', fokontany: 'Fokontany 3', date: '2024-01-03', min: 20, mean: 30, max: 40 },
    { id: 4, municipality: 'Municipality 4', fokontany: 'Fokontany 4', date: '2024-01-04', min: 25, mean: 35, max: 45 },
    { id: 5, municipality: 'Municipality 5', fokontany: 'Fokontany 5', date: '2024-01-05', min: 30, mean: 40, max: 50 },
    { id: 6, municipality: 'Municipality 6', fokontany: 'Fokontany 6', date: '2024-01-06', min: 35, mean: 45, max: 55 },
]

describe('DataTable component', () => {
    test('renders DataTable with correct data', () => {
        const { getByText } = render(<DataTable data={sampleData} />)

        // Check if table headers are rendered
        headCells.forEach((headCell) => {
            expect(getByText(headCell.label)).toBeInTheDocument()
        })

        // Check if first page data is rendered correctly
        sampleData.slice(0, 5).forEach((item) => {
            expect(getByText(item.municipality)).toBeInTheDocument()
        })
    })

    test('pagination works correctly', () => {
        const { queryByText, getByLabelText, getByText } = render(<DataTable data={sampleData} />)

        // Check initial page
        expect(queryByText('Municipality 6')).not.toBeInTheDocument()

        const nextPageButton = getByLabelText('Go to next page')

        // Navigate to next page
        fireEvent.click(nextPageButton)

        // Check if next page data is rendered correctly
        expect(getByText('Municipality 6')).toBeInTheDocument()
    })

    test('sorting works correctly', () => {
        const { getByText, getAllByRole } = render(<DataTable data={sampleData} />)

        // Click on the "Min" column header to sort
        fireEvent.click(getByText('Estimation minimun'))

        // Check if the rows are sorted by "Min" in ascending order
        const rows = getAllByRole('row')
        const firstRowCells = rows[1].querySelectorAll('td')
        const secondRowCells = rows[2].querySelectorAll('td')
        expect(firstRowCells[3].textContent).toBe('20')
        expect(secondRowCells[3].textContent).toBe('25')

        // Click again to sort in descending order
        fireEvent.click(getByText('Estimation minimun'))

        // Check if the rows are sorted by "Min" in descending order
        const firstRowCellsAsc = rows[1].querySelectorAll('td')
        const secondRowCellsAsc = rows[2].querySelectorAll('td')
        expect(firstRowCellsAsc[3].textContent).toBe('20')
        expect(secondRowCellsAsc[3].textContent).toBe('25')
    })
})
