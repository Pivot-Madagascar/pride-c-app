import React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import pivotLogoUrl from '../../assets/img/logo/pivot_logo.png'

const RenderUpgrade = () => {
    return (
        <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
            <Stack
                alignItems="center"
                spacing={3}
                sx={{ pt: 5, borderRadius: 2, position: 'relative' }}
            >
                <Box
                    component="img"
                    src={pivotLogoUrl}
                    alt="Pivot Logo"
                    sx={{
                        width: 40,
                        position: 'absolute',
                        top: -50,
                        borderRadius: 0.75,
                    }}
                />
            </Stack>
        </Box>
    )
}

export default RenderUpgrade
