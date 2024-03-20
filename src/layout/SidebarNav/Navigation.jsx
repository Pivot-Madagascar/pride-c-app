import { Stack } from '@mui/material'
import React from 'react'
import navConfig from '../../routes/config-navigation'
import NestedNavItem from './NestedNavItem'
import SingleNavItem from './SingleNavItem'

const Navigation = () => {
    return (
        <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
            {navConfig.map((item, index) => (
                <div key={index}>
                    {!item.nestedMenu && (
                        <SingleNavItem item={item} index={index} />
                    )}
                    {item.nestedMenu && (
                        <NestedNavItem item={item} index={index} />
                    )}
                </div>
            ))}
        </Stack>
    )
}

export default Navigation
