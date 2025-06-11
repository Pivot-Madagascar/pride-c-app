import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import React from 'react'
import Menu from '../../components/Icons/Menu'
import { useResponsive } from '../../hooks/use-responsive'
import AccountPopover from '../common/AccountPopover'
import NotificationsPopover from '../common/NotificationsPopover'

const RenderContent = ({ onOpenNav }) => {
    const lgUp = useResponsive('up', 'lg')
    return (
        <>
            {/* {!lgUp && ( */}
                <IconButton onClick={onOpenNav} sx={{ mr: 1 }}>
                    <Menu width={24} height={24} />
                </IconButton>
            {/* )} */}
            <Box sx={{ flexGrow: 1 }} />
            <Stack direction="row" alignItems="center" spacing={1}>
                {/* <NotificationsPopover />

                <Box sx={{ pl: 3, pr: 1 }} data-testid="user-details">
                    <Typography
                        variant="subtitle2"
                        sx={{ color: 'text.secondary' }}
                        data-testid="username"
                    >
                        Admin Admin
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                        data-testid="user-role"
                    >
                        Admin
                    </Typography>
                </Box> */}

                <AccountPopover />
            </Stack>
        </>
    )
}

export default RenderContent
