import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import ToggleButton from '../ToggleButton/index'

// Mock items data for testing
const items = [
    {
        label: 'District',
        value: 'district',
    },
    {
        label: 'Commune',
        value: 'municipality',
    },
    {
        label: 'Fokontany',
        value: 'fokontany',
    },
]

describe('ToggleButton component', () => {
    it('renders with initial selected item', () => {
        const { getByTestId } = render(<ToggleButton items={items} />)
        const districtBtn = getByTestId('district-btn')
        expect(districtBtn).toHaveClass('toggleButtonItemActive')
    })

    it('changes selected item on button click and calls onSelect callback', () => {
        const mockOnSelect = jest.fn() // Mock onSelect callback function
        const { getByTestId } = render(
            <ToggleButton items={items} onSelect={mockOnSelect} />
        )

        const fokontanyBtn = getByTestId('fokontany-btn')
        const municipalityBtn = getByTestId('municipality-btn')

        // Click on 'Fokontany' button
        fireEvent.click(fokontanyBtn)

        // Check if 'Fokontany' button is active and 'Municipality' button is not active
        expect(fokontanyBtn).toHaveClass('toggleButtonItemActive')
        expect(municipalityBtn).not.toHaveClass('toggleButtonItemActive')

        // Check if onSelect callback was called with the correct value ('fokontany')
        expect(mockOnSelect).toHaveBeenCalledWith('fokontany')

        // Click on 'Municipality' button
        fireEvent.click(municipalityBtn)

        // Check if 'Municipality' button is active and 'Fokontany' button is not active
        expect(municipalityBtn).toHaveClass('toggleButtonItemActive')
        expect(fokontanyBtn).not.toHaveClass('toggleButtonItemActive')

        // Check if onSelect callback was called with the correct value ('municipality')
        expect(mockOnSelect).toHaveBeenCalledWith('municipality')
    })
})
