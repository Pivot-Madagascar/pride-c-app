import { Stack } from '@mui/material'
import React from 'react'
import navConfig from '../../routes/config-navigation'
import NestedNavItem from './NestedNavItem'
import SingleNavItem from './SingleNavItem'

const RenderMenu = () => {
    return (
        <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
            {navConfig.map((item) => (
                <div key={item.title}>
                    {!item.nestedMenu && <SingleNavItem item={item} />}
                    {item.nestedMenu && <NestedNavItem item={item} />}
                </div>
            ))}
        </Stack>
    )
}

export default RenderMenu