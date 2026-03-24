import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import Iconify from '../Iconify'

describe('Iconify Component', () => {
    it('renders an Icon element with the correct props', async () => {
        const icon = 'mdi:home'
        const width = 24
        const sx = { color: 'red' }

        const { container } = render(
            <Iconify icon={icon} width={width} sx={sx} />
        )
        setTimeout(() => {
            const iconElement = container.querySelector('svg')
            expect(iconElement).toBeInTheDocument()
            expect(iconElement).toHaveAttribute('icon', icon)
            expect(iconElement).toHaveStyle('width: 24px')
            expect(iconElement).toHaveStyle('height: 24px')
            expect(iconElement).toHaveStyle('color: red')
        }, 0)
    })

    it('forwards ref correctly', async () => {
        const ref = React.createRef()

        render(<Iconify icon="mdi:home" ref={ref} />)
        setTimeout(() => {
            expect(ref.current).toBeDefined()
            expect(ref.current.tagName).toEqual('svg')
        }, 0)
    })

    it('enforces prop types correctly', () => {
        const errorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {})
        render(<Iconify icon={123} width="notANumber" sx="invalidSx" />)
        expect(errorSpy).toHaveBeenCalledTimes(3)
        errorSpy.mockRestore()
    })
})
