import { faker } from '@faker-js/faker'
import Popover from '@mui/material/Popover'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { set } from 'date-fns'
import React, { useState } from 'react'
import { Iconify, Scrollbar } from '@/components'
import { Bell } from '@/components/Icons'
import NotificationItem from './NotificationItem'

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

const NotificationsPopover = () => {
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
                data-testid="notifications-button"
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
                    data-testid="notifications-title"
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
                        data-testid="notification-list"
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

export default NotificationsPopover
