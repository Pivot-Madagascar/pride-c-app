import { Typography } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'


const RenderContent = (notification) => {
    let avatar = null;
    if (notification.type === 'resurgence_alert') {
        avatar = (
            <img
                alt={notification.title}
                src="/assets/icons/ic_notification_mail.svg"
            />
        );
    } else if (notification.type === 'stockout_alert') {
        avatar = (
            <img
                alt={notification.title}
                src="/assets/icons/ic_notification_chat.svg"
            />
        );
    } else {
        avatar = notification.avatar ? (
            <img alt={notification.title} src={notification.avatar} />
        ) : null;
    }
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
    return (
        <div data-testid="render-content">
            {avatar}
            {title}
        </div>
    )   
}

RenderContent.prototype = {
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

export default RenderContent