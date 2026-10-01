import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import AccountPopover from '../AccountPopover'
import '@testing-library/jest-dom'

describe('AccountPopover', () => {
    it('renders without crashing', () => {
        render(<AccountPopover />)
    })

    it('displays user information correctly', () => {
        const { getByTestId } = render(<AccountPopover />)
        const accountButton = getByTestId('avatar')
        fireEvent.click(accountButton)
        const popUsername = getByTestId('pop-username')
        const popUseremail = getByTestId('pop-user-email')
        expect(popUsername).toBeVisible()
        expect(popUseremail).toBeVisible()
    })

    it('displays menu options correctly', () => {
        const { getByText, getByTestId } = render(<AccountPopover />)
        const accountButton = getByTestId('avatar')
        fireEvent.click(accountButton)
        expect(getByText('Accueil')).toBeVisible()
        expect(getByText('Mon profil')).toBeVisible()
        expect(getByText('Configuration')).toBeVisible()
        expect(getByText('Déconnecter')).toBeVisible()
    })

    it('closes popover when clicking on menu option', () => {
        const { getByTestId, getByText } = render(<AccountPopover />)
        const accountButton = getByTestId('avatar')
        fireEvent.click(accountButton)
        const accountMenu = getByTestId('account-menu')
        const homeButton = getByText('Accueil')
        expect(accountMenu).toBeVisible()
        expect(homeButton).toBeVisible()
        fireEvent.click(homeButton)
        expect(accountMenu).not.toBeVisible()
    })
})
