import { render, fireEvent } from '@testing-library/react'
import NotificationsPopover from '../index'
import '@testing-library/jest-dom'

describe('NotificationsPopover Component', () => {
    it('opens popover when bell icon is clicked', () => {
        const { queryByText, getByTestId } = render(<NotificationsPopover />)
        expect(queryByText('Notifications')).not.toBeInTheDocument()
        const notificationsButton = getByTestId('notifications-button')
        fireEvent.click(notificationsButton)
        expect(queryByText('Notifications')).toBeInTheDocument()
    })

    it('renders notifications popover correctly', () => {
        const { getByText, getByTestId } = render(<NotificationsPopover />)
        const notificationsButton = getByTestId('notifications-button')
        fireEvent.click(notificationsButton)
        const notificationsTitle = getByTestId('notifications-title')
        const notificationList = getByTestId('notification-list')
        expect(notificationsTitle).toBeInTheDocument()
        expect(getByText('Notifications')).toBeInTheDocument()
        expect(
            getByText('Vous avez 2 nouvelles notifications')
        ).toBeInTheDocument()
        expect(getByText('Nouvelles notifications')).toBeInTheDocument()
        expect(notificationList).toBeInTheDocument()
    })
})
