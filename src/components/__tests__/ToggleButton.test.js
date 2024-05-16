import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import COLORS from '../../constants/styles'
import ToggleButton from '../ToggleButton/index'

function rgbToHex(rgb) {
    const result = rgb.match(/\d+/g).map(Number);
    return (
      '#' +
      ((1 << 24) + (result[0] << 16) + (result[1] << 8) + result[2])
        .toString(16)
        .slice(1)
        .toUpperCase()
    );
  }

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
        const receivedColor = getComputedStyle(districtBtn).backgroundColor
        expect(rgbToHex(receivedColor)).toBe(COLORS.white)
    })

    it('changes selected item on button click and calls onSelect callback', () => {
        const mockOnSelect = jest.fn() // Mock onSelect callback function
        const { getByTestId } = render(<ToggleButton items={items} onSelect={mockOnSelect} />)

        const districtBtn = getByTestId('district-btn')
        const municipalityBtn = getByTestId('municipality-btn')
        const fokontanyBtn = getByTestId('fokontany-btn')

        let districtBtnBgColor = getComputedStyle(districtBtn).backgroundColor
        let municipalityBtnBgColor = getComputedStyle(municipalityBtn).backgroundColor
        let fokontanyBtnBgColor = getComputedStyle(fokontanyBtn).backgroundColor

        expect(rgbToHex(districtBtnBgColor)).toBe(COLORS.white)
        expect(municipalityBtnBgColor).toBe('transparent')
        expect(fokontanyBtnBgColor).toBe('transparent')

        // Click on 'Fokontany' button
        fireEvent.click(fokontanyBtn)

        districtBtnBgColor = getComputedStyle(districtBtn).backgroundColor
        municipalityBtnBgColor = getComputedStyle(municipalityBtn).backgroundColor
        fokontanyBtnBgColor = getComputedStyle(fokontanyBtn).backgroundColor

        expect(mockOnSelect).toHaveBeenCalledWith('fokontany')
        
        // Check if the background colour of the "Fokontany" and "District" buttons has changed 
        // and if the background colour of the "Commune" button has not changed
        expect(districtBtnBgColor).toBe('transparent')
        expect(municipalityBtnBgColor).toBe('transparent')
        expect(rgbToHex(fokontanyBtnBgColor)).toBe(COLORS.white)

        // Click on 'Commune' button
        fireEvent.click(municipalityBtn)

        districtBtnBgColor = getComputedStyle(districtBtn).backgroundColor
        municipalityBtnBgColor = getComputedStyle(municipalityBtn).backgroundColor
        fokontanyBtnBgColor = getComputedStyle(fokontanyBtn).backgroundColor

        // Check if onSelect callback was called with the correct value ('municipality')
        expect(mockOnSelect).toHaveBeenCalledWith('municipality')

        // Check if the background colour of the "Fokontany" and "Commune" buttons has changed 
        // and if the background colour of the "District" button has not changed
        expect(districtBtnBgColor).toBe('transparent')
        expect(rgbToHex(municipalityBtnBgColor)).toBe(COLORS.white)
        expect(fokontanyBtnBgColor).toBe('transparent')
    })
}) 