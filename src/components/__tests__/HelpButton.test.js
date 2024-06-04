import { render } from '@testing-library/react'
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
    it('renders with the correct tooltip text', async () => {
        const bgColor = 'red'
        const text = 'Help text'

        const { getByRole, findByText } = render(
            <HelpButton bgColor={bgColor} text={text} />
        )

        const button = getByRole('button')

        await act(async () => {
            await userEvent.hover(button)
        })

        const tooltip = await findByText(text)

        expect(tooltip).toBeInTheDocument()
    })

    it('applies the correct styles to the tooltip', async () => {
        const bgColor = '#616161'
        const text = 'Tooltip text'

        const { getByRole, findByText } = render(
            <HelpButton bgColor={bgColor} text={text} />
        )

        const button = getByRole('button')

        expect(button).toHaveStyle(`background-color: ${bgColor}`)
        expect(button).toHaveTextContent('?')

        await act(async () => {
            await userEvent.hover(button)
        })

        const tooltip = await findByText(text)
        const tooltipBgColor = getComputedStyle(tooltip).backgroundColor

        // Extract only the RGB part
        const rgbColor = tooltipBgColor.match(/rgba?\((\d+), (\d+), (\d+)/)
        const tooltipRgbColor = `rgb(${rgbColor[1]}, ${rgbColor[2]}, ${rgbColor[3]})`

        const expectedRgbColor = hexToRgb(bgColor).toLowerCase()

        expect(tooltipRgbColor).toBe(expectedRgbColor)
    })
})
