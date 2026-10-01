import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import COLORS from '@/constants/styles'
import ToggleButton from '@/components/ToggleButton/index'

function rgbToHex(rgb) {
    const result = rgb.match(/\d+/g).map(Number)
    return (
        '#' +
        ((1 << 24) + (result[0] << 16) + (result[1] << 8) + result[2])
            .toString(16)
            .slice(1)
            .toUpperCase()
    )
}

function hexToRgb(hex) {
    hex = hex.replace('#', '')
    const bigint = parseInt(hex, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgb(${r}, ${g}, ${b})`
}

const items = [
    {
        label: 'District',
        value: 'district',
        disabled: true,
        id: 'district',
    },
    {
        label: 'Commune',
        value: 'municipality',
        disabled: false,
        id: 'municipality',
    },
    {
        label: 'Fokontany',
        value: 'fokontany',
        disabled: false,
        id: 'fokontany',
    },
]

const bgColor = '#616161'

describe('ToggleButton component', () => {
    it('renders and selects the first non-disabled item by default', () => {
        const mockOnSelect = jest.fn()
        const { getByTestId } = render(
            <ToggleButton options={items} onSelect={mockOnSelect} bgColor={bgColor} />
        )

        const districtBtn = getByTestId('district-btn')
        const municipalityBtn = getByTestId('municipality-btn')
        const fokontanyBtn = getByTestId('fokontany-btn')

        expect(getComputedStyle(districtBtn).backgroundColor).toBe('transparent')
        expect(getComputedStyle(municipalityBtn).backgroundColor).toBe(hexToRgb(COLORS.white))
        expect(getComputedStyle(fokontanyBtn).backgroundColor).toBe('transparent')

        // Check if onSelect was called with the first enabled item
        expect(mockOnSelect).toHaveBeenCalledWith({
            label: 'Commune',
            value: 'municipality',
            disabled: false,
            id: 'municipality',
        })
    })

    it('changes selected item on button click and calls onSelect with full object', () => {
        const mockOnSelect = jest.fn()
        const { getByTestId } = render(
            <ToggleButton options={items} onSelect={mockOnSelect} bgColor={bgColor} />
        )

        const districtBtn = getByTestId('district-btn')
        const municipalityBtn = getByTestId('municipality-btn')
        const fokontanyBtn = getByTestId('fokontany-btn')

        // Click on 'Fokontany'
        fireEvent.click(fokontanyBtn)
        expect(mockOnSelect).toHaveBeenCalledWith({
            label: 'Fokontany',
            value: 'fokontany',
            disabled: false,
            id: 'fokontany',
        })

        expect(getComputedStyle(districtBtn).backgroundColor).toBe('transparent')
        expect(getComputedStyle(municipalityBtn).backgroundColor).toBe('transparent')
        expect(getComputedStyle(fokontanyBtn).backgroundColor).toBe(hexToRgb(COLORS.white))

        // Click on 'Commune'
        fireEvent.click(municipalityBtn)
        expect(mockOnSelect).toHaveBeenCalledWith({
            label: 'Commune',
            value: 'municipality',
            disabled: false,
            id: 'municipality',
        })

        expect(getComputedStyle(districtBtn).backgroundColor).toBe('transparent')
        expect(getComputedStyle(municipalityBtn).backgroundColor).toBe(hexToRgb(COLORS.white))
        expect(getComputedStyle(fokontanyBtn).backgroundColor).toBe('transparent')
    })

    it('does not allow clicks on disabled buttons', () => {
        const mockOnSelect = jest.fn()
        const { getByTestId } = render(
            <ToggleButton options={items} onSelect={mockOnSelect} bgColor={bgColor} />
        )

        const districtBtn = getByTestId('district-btn')
        fireEvent.click(districtBtn)

        // onSelect should not be called again with 'district'
        expect(mockOnSelect).not.toHaveBeenCalledWith(expect.objectContaining({ value: 'district' }))
    })
})
