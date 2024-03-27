import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'
import { alpha } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'

const MENU_OPTIONS = [
    {
        label: 'Accueil',
    },
    {
        label: 'Mon profil',
    },
    {
        label: 'Configuration',
    },
]
const AccountPopover = () => {
    const [open, setOpen] = useState(null)

    const handleOpen = (event) => {
        setOpen(event.currentTarget)
    }

    const handleClose = () => {
        setOpen(null)
    }

    return (
        <>
            <IconButton
                onClick={handleOpen}
                sx={{
                    width: 40,
                    height: 40,
                    background: (theme) => alpha(theme.palette.grey[500], 0.08),
                    ...(open && {
                        background: (theme) =>
                            `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                    }),
                }}
            >
                <Avatar alt="Admin admin" data-testid="avatar" />
            </IconButton>

            <Popover
                open={!!open}
                anchorEl={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                    p: 0,
                    mt: 1,
                    ml: 0.75,
                    width: 200,
                }}
            >
                <Box data-testid="account-menu">
                    <Box sx={{ my: 1.5, px: 2 }}>
                        <Typography
                            variant="subtitle2"
                            noWrap
                            data-testid="pop-username"
                        >
                            Admin Admin
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                            noWrap
                            data-testid="pop-user-email"
                        >
                            admin@dhis2.org
                        </Typography>
                    </Box>

                    <Divider sx={{ borderStyle: 'dashed' }} />

                    {MENU_OPTIONS.map((option) => (
                        <MenuItem key={option.label} onClick={handleClose}>
                            {option.label}
                        </MenuItem>
                    ))}

                    <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

                    <MenuItem
                        disableRipple
                        disableTouchRipple
                        onClick={handleClose}
                        sx={{
                            typography: 'body2',
                            color: 'error.main',
                            py: 1.5,
                        }}
                    >
                        Déconnecter
                    </MenuItem>
                </Box>
            </Popover>
        </>
    )
}

export default AccountPopover
