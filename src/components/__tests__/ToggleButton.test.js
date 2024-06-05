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

function hexToRgb(hex) {
    hex = hex.replace('#', '')
    const bigint = parseInt(hex, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgb(${r}, ${g}, ${b})`
}

// Mock items data for testing
const items = [
    {
        label: 'District',
        value: 'district',
        disabled: true
    },
    {
        label: 'Commune',
        value: 'municipality',
        disabled: false
    },
    {
        label: 'Fokontany',
        value: 'fokontany',
        disabled: false
    },
]

const bgColor = '#616161'

describe('ToggleButton component', () => {
    it('renders with initial selected item', () => {
        const mockOnSelect = jest.fn() // Mock onSelect callback function
        const { getByTestId } = render(<ToggleButton options={items} onSelect={mockOnSelect} bgColor={bgColor} />)

        const districtBtn = getByTestId('district-btn')
        const municipalityBtn = getByTestId('municipality-btn')
        const fokontanyBtn = getByTestId('fokontany-btn')

        let receivedColor = getComputedStyle(districtBtn).backgroundColor
        expect(receivedColor).toBe('transparent')

        receivedColor = getComputedStyle(municipalityBtn).backgroundColor
        expect(receivedColor).toBe(hexToRgb(COLORS.white))

        receivedColor = getComputedStyle(fokontanyBtn).backgroundColor
        expect(receivedColor).toBe('transparent')
    })

    it('changes selected item on button click and calls onSelect callback', () => {
        const mockOnSelect = jest.fn() // Mock onSelect callback function
        const { getByTestId } = render(<ToggleButton options={items} onSelect={mockOnSelect} bgColor={bgColor} />)

        const districtBtn = getByTestId('district-btn')
        const municipalityBtn = getByTestId('municipality-btn')
        const fokontanyBtn = getByTestId('fokontany-btn')

        let districtBtnBgColor = getComputedStyle(districtBtn).backgroundColor
        let municipalityBtnBgColor = getComputedStyle(municipalityBtn).backgroundColor
        let fokontanyBtnBgColor = getComputedStyle(fokontanyBtn).backgroundColor

        expect(districtBtnBgColor).toBe('transparent')
        expect(rgbToHex(municipalityBtnBgColor)).toBe(COLORS.white)
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