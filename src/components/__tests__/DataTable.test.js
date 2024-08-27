import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import DataTable from '../DataTable'

jest.mock('jspdf', () => {
    return {
        jsPDF: jest.fn(() => ({
            save: jest.fn(),
        })),
    }
})

jest.mock('jspdf-autotable', () => jest.fn())

// Sample data to be used in tests
const sampleData = [
    {
        id: 1,
        municipality: 'Municipality 1',
        orgUnitName: 'Fokontany 1',
        periodName: 'July 2016',
        min: 10,
        mean: 20,
        max: 30,
        period: '201607',
    },
    {
        id: 2,
        municipality: 'Municipality 2',
        orgUnitName: 'Fokontany 2',
        periodName: 'July 2016',
        min: 15,
        mean: 25,
        max: 35,
        period: '201607',
    },
    {
        id: 3,
        municipality: 'Municipality 3',
        orgUnitName: 'Fokontany 3',
        periodName: 'July 2016',
        min: 20,
        mean: 30,
        max: 40,
        period: '201607',
    },
    {
        id: 4,
        municipality: 'Municipality 4',
        orgUnitName: 'Fokontany 4',
        periodName: 'July 2016',
        min: 25,
        mean: 35,
        max: 45,
        period: '201607',
    },
    {
        id: 5,
        municipality: 'Municipality 5',
        orgUnitName: 'Fokontany 5',
        periodName: 'July 2016',
        min: 30,
        mean: 40,
        max: 50,
        period: '201607',
    },
    {
        id: 6,
        municipality: 'Municipality 6',
        orgUnitName: 'Fokontany 6',
        periodName: 'July 2016',
        min: 35,
        mean: 45,
        max: 55,
        period: '201607',
    },
]

describe('DataTable component', () => {
    it('renders DataTable with correct data', () => {
        render(<DataTable data={sampleData} />)

        expect(screen.getByText('Commune')).toBeInTheDocument()
        expect(screen.getByText('Fokontany')).toBeInTheDocument()
        expect(screen.getByText('Mois')).toBeInTheDocument()
        expect(screen.getByText('Estimation min.')).toBeInTheDocument()
        expect(screen.getByText('Estimation moyenne')).toBeInTheDocument()
        expect(screen.getByText('Estimation max.')).toBeInTheDocument()

        sampleData.slice(0, 5).forEach((item) => {
            expect(screen.getByText(item.municipality)).toBeInTheDocument()
        })
    })

    it('sorting works correctly', () => {
        render(<DataTable data={sampleData} />)

        fireEvent.click(screen.getByText('Estimation min.'))
        const firstRow = screen.getAllByRole('row')[1]
        const secondRow = screen.getAllByRole('row')[2]
        expect(firstRow).toHaveTextContent('Municipality 6')
        expect(secondRow).toHaveTextContent('Municipality 5')

        fireEvent.click(screen.getByText('Estimation min.'))
        const firstRowDesc = screen.getAllByRole('row')[1]
        const secondRowDesc = screen.getAllByRole('row')[2]
        expect(firstRowDesc).toHaveTextContent('Municipality 1')
        expect(secondRowDesc).toHaveTextContent('Municipality 2')
    })
})
