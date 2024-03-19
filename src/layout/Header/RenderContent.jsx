import { Box, Stack, IconButton } from '@mui/material'
import React from 'react'
import Menu from '../../components/Icons/Menu'
import { useResponsive } from '../../hooks/use-responsive'
import AccountPopover from '../common/account-popover'
import NotificationsPopover from '../common/notifications-popover'

const RenderContent = ({ onOpenNav }) => {
    const lgUp = useResponsive('up', 'lg')
    return (
        <>
            {!lgUp && (
                <IconButton onClick={onOpenNav} sx={{ mr: 1 }}>
                    <Menu width={24} height={24} />
                </IconButton>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Stack direction="row" alignItems="center" spacing={1}>
                <NotificationsPopover />
                <AccountPopover />
            </Stack>
        </>
    )
}

export default RenderContent