
import { faker } from '@faker-js/faker'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Popover from '@mui/material/Popover'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { set } from 'date-fns'
import PropTypes from 'prop-types'
import { useState } from 'react'
import Iconify from '../../components/Iconify'
import Bell from '../../components/Icons/Bell'
import Scrollbar from '../../components/Scrollbar'
import { fToNow } from '../../utils/format-time'

const NOTIFICATIONS = [
    {
        id: faker.string.uuid(),
        title: 'lorem ipsum',
        description: '...',
        avatar: null,
        type: 'order_placed',
        createdAt: set(new Date(), { hours: 10, minutes: 30 }),
        isUnRead: true,
    },
    {
        id: faker.string.uuid(),
        title: 'lorem ipsum',
        description: '...',
        avatar: null,
        type: 'order_placed',
        createdAt: set(new Date(), { hours: 10, minutes: 30 }),
        isUnRead: true,
    },
]

export default function NotificationsPopover() {
    const [notifications, setNotifications] = useState(NOTIFICATIONS)

    const totalUnRead = notifications.filter(
        (item) => item.isUnRead === true
    ).length

    const [open, setOpen] = useState(null)

    const handleOpen = (event) => {
        setOpen(event.currentTarget)
    }

    const handleClose = () => {
        setOpen(null)
    }

    const handleMarkAllAsRead = () => {
        setNotifications(
            notifications.map((notification) => ({
                ...notification,
                isUnRead: false,
            }))
        )
    }

    return (
        <>
            <IconButton
                color={open ? 'primary' : 'default'}
                onClick={handleOpen}
            >
                <Badge badgeContent={totalUnRead} color="error">
                    <Bell width={24} height={26} />
                </Badge>
            </IconButton>

            <Popover
                open={!!open}
                anchorEl={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        ml: 0.75,
                        width: 360,
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        py: 2,
                        px: 2.5,
                    }}
                >
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1">
                            Notifications
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                        >
                            Vous avez {totalUnRead} nouvelles notifications
                        </Typography>
                    </Box>

                    {totalUnRead > 0 && (
                        <Tooltip title=" Mark all as read">
                            <IconButton
                                color="primary"
                                onClick={handleMarkAllAsRead}
                            >
                                <Iconify icon="eva:done-all-fill" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
                    <List
                        disablePadding
                        subheader={
                            <ListSubheader
                                disableSticky
                                sx={{ py: 1, px: 2.5, typography: 'overline' }}
                            >
                                Nouvelles notifications
                            </ListSubheader>
                        }
                    >
                        {notifications.slice(0, 2).map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                            />
                        ))}
                    </List>

                </Scrollbar>
            </Popover>
        </>
    )
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
    notification: PropTypes.shape({
        createdAt: PropTypes.instanceOf(Date),
        id: PropTypes.string,
        isUnRead: PropTypes.bool,
        title: PropTypes.string,
        description: PropTypes.string,
        type: PropTypes.string,
        avatar: PropTypes.any,
    }),
}

function NotificationItem({ notification }) {
    const { avatar, title } = renderContent(notification)

    return (
        <ListItemButton
            sx={{
                py: 1.5,
                px: 2.5,
                mt: '1px',
                ...(notification.isUnRead && {
                    bgcolor: 'action.selected',
                }),
            }}
        >
            <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={title}
                secondary={
                    <Typography
                        variant="caption"
                        sx={{
                            mt: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            color: 'text.disabled',
                        }}
                    >
                        <Iconify
                            icon="eva:clock-outline"
                            sx={{ mr: 0.5, width: 16, height: 16 }}
                        />
                        {fToNow(notification.createdAt)}
                    </Typography>
                }
            />
        </ListItemButton>
    )
}

// ----------------------------------------------------------------------

function renderContent(notification) {
    const title = (
        <Typography variant="subtitle2">
            {notification.title}
            <Typography
                component="span"
                variant="body2"
                sx={{ color: 'text.secondary' }}
            >
                &nbsp; {notification.description}
            </Typography>
        </Typography>
    )

    if (notification.type === 'order_placed') {
        return {
            avatar: (
                <img
                    alt={notification.title}
                    src="/assets/icons/ic_notification_package.svg"
                />
            ),
            title,
        }
    }
    if (notification.type === 'order_shipped') {
        return {
            avatar: (
                <img
                    alt={notification.title}
                    src="/assets/icons/ic_notification_shipping.svg"
                />
            ),
            title,
        }
    }
    if (notification.type === 'mail') {
        return {
            avatar: (
                <img
                    alt={notification.title}
                    src="/assets/icons/ic_notification_mail.svg"
                />
            ),
            title,
        }
    }
    if (notification.type === 'chat_message') {
        return {
            avatar: (
                <img
                    alt={notification.title}
                    src="/assets/icons/ic_notification_chat.svg"
                />
            ),
            title,
        }
    }
    return {
        avatar: notification.avatar ? (
            <img alt={notification.title} src={notification.avatar} />
        ) : null,
        title,
    }
}
