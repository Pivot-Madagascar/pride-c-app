import { render } from '@testing-library/react'
import NotificationItem from '../NotificationItem'
import '@testing-library/jest-dom'

describe('NotificationItem', () => {
    const mockNotification = {
        id: 1,
        title: 'Sample Notification',
        avatar: 'S',
        createdAt: new Date().toISOString(),
        isUnRead: true,
        description: 'lorem ipsum ...',
        type: 'stockout_alert'
    }

    it('renders notification item correctly', () => {
        const { getByText } = render(
            <NotificationItem notification={mockNotification} />
        )

        expect(getByText(mockNotification.title)).toBeInTheDocument()
        expect(getByText(/ago$/i)).toBeInTheDocument()
    })
})
