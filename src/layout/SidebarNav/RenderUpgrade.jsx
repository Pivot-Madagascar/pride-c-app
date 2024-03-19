import React from 'react'
import { Box, Stack } from '@mui/material'
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