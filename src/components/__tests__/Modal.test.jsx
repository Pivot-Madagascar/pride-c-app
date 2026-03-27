import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
// import Modal from './Modal'
import Modal from '@/components/Modal'

describe('Modal component', () => {
    const handleClose = jest.fn()
    const title = 'Test Modal Title'
    const children = <div>Test Modal Content</div>

    beforeEach(() => {
        handleClose.mockClear()
    })

    it('renders the Modal component with provided title and children', () => {
        const { getByText } = render(
            <Modal open={true} onClose={handleClose} title={title}>
                {children}
            </Modal>
        )

        expect(getByText(title)).toBeInTheDocument()
        expect(getByText('Test Modal Content')).toBeInTheDocument()
    })

    it('calls handleClose when close button is clicked', () => {
        const { getByTestId } = render(
            <Modal open={true} onClose={handleClose} title={title}>
                {children}
            </Modal>
        )

        const closeButton = getByTestId('close-btn')

        fireEvent.click(closeButton)
        expect(handleClose).toHaveBeenCalledTimes(1)
    })

    it('calls handleClose when "Fermer" button is clicked', () => {
        const { getByTestId } = render(
            <Modal open={true} onClose={handleClose} title={title}>
                {children}
            </Modal>
        )

        const closeActionsButton = getByTestId('close-actions-btn')

        fireEvent.click(closeActionsButton)
        expect(handleClose).toHaveBeenCalledTimes(1)
    })

    it('does not render content when open is false', () => {
        const { queryByText } = render(
            <Modal open={false} onClose={handleClose} title={title}>
                {children}
            </Modal>
        )

        expect(queryByText(title)).not.toBeInTheDocument()
        expect(queryByText('Test Modal Content')).not.toBeInTheDocument()
    })
})
