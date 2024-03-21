import { render } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import RenderUpgrade from '../RenderUpgrade'

describe('RenderUpgrade Component', () => {
    it('renders without crashing', () => {
        render(<RenderUpgrade />)
    })

    it('renders the pivot logo', () => {
        const { getByAltText } = render(<RenderUpgrade />)
        const pivotLogo = getByAltText('Pivot Logo')
        expect(pivotLogo).toBeInTheDocument()
    })
})
