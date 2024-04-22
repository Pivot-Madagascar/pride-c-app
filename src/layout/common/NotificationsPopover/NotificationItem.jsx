import {
    ListItemAvatar,
    ListItemButton,
    Avatar,
    Typography,
    Box
} from '@mui/material'
import React from 'react'
import Iconify from '../../../components/Iconify'
import { fToNow } from '../../../utils/format-time'
import RenderContent from './RenderContent'

const NotificationItem = ({ notification }) => {
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
            data-testid="notification-item"
        >
            <ListItemAvatar>
                <RenderContent notification={notification} />
            </ListItemAvatar>
            <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">{notification.title}</Typography>
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
            </Box>
        </ListItemButton>
    )
}

export default NotificationItem
