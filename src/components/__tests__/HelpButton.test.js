import { render, fireEvent } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import HelpButton from '../HelpButton/index'

function hexToRgb(hex) {
    hex = hex.replace('#', '')
    const bigint = parseInt(hex, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgb(${r}, ${g}, ${b})`
}

describe('HelpButton Component', () => {
    const handleOnClick = jest.fn()

    it('calls handleOnClick when  button is clicked', () => {
        const bgColor = 'red'
        const text = 'Help text'

        const { getByTestId } = render(
            <HelpButton bgColor={bgColor} text={text} onClick={handleOnClick} />
        )

        const button = getByTestId('help-btn')

        fireEvent.click(button)
        expect(handleOnClick).toHaveBeenCalledTimes(1)
    })
})
