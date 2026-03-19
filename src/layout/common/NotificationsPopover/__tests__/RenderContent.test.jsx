import { render } from '@testing-library/react'
import RenderContent from '../RenderContent'
import '@testing-library/jest-dom'

describe('RenderContent', () => {
    const notifications = [
        {
            type: 'resurgence_alert',
            title: 'Resurgence Alert',
            description: 'There is a resurgence in activity.',
            expectedAvatarSrc: '/assets/icons/ic_notification_mail.svg',
        },
        {
            type: 'stockout_alert',
            title: 'Stockout Alert',
            description: 'There is a stockout in inventory.',
            expectedAvatarSrc: '/assets/icons/ic_notification_chat.svg',
        },
    ]
    notifications.forEach((notification) => {
        it(`renders with ${notification.type} notification type`, () => {
            const { getByAltText, getByText } = render(
                <RenderContent {...notification} />
            )
            const avatarImage = getByAltText(notification.title)
            expect(avatarImage).toBeInTheDocument()
            expect(avatarImage).toHaveAttribute(
                'src',
                notification.expectedAvatarSrc
            )
            expect(getByText(notification.title)).toBeInTheDocument()
            expect(getByText(notification.description)).toBeInTheDocument()
        })
    })

    it('renders with notification without avatar', () => {
        const notification = {
            type: 'other_type',
            title: 'Notification without avatar',
            description: 'This notification has no avatar.',
        }
        const { queryByAltText, getByText } = render(
            <RenderContent {...notification} />
        )
        expect(queryByAltText(notification.title)).toBeNull()
        expect(getByText(notification.title)).toBeInTheDocument()
        expect(getByText(notification.description)).toBeInTheDocument()
    })

    it('renders with empty notification', () => {
        const notification = {
            type: '',
            title: '',
            description: '',
        }
        const { queryByAltText } = render(<RenderContent {...notification} />)
        expect(queryByAltText(notification.title)).toBeNull()
    })
})
