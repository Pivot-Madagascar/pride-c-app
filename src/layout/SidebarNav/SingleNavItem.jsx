import ListItemButton from '@mui/material/ListItemButton'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import RouterLink from '../../routes/components/router-link'
import { usePathname } from '../../routes/hooks/use-pathname'
import { useNavIndex } from './NavIndexContext.jsx'

const NavItem = ({ item, index }) => {
    const [onHover, setHover] = useState(false)
    const pathname = usePathname()
    const active = item.path === pathname

    const { setNavIndex } = useNavIndex()

    const handleClick = () => {
        setNavIndex(index)
    }
    return (
        <ListItemButton
            component={RouterLink}
            href={item.path}
            sx={{
                minHeight: 44,
                borderRadius: 0.75,
                typography: 'body2',
                color: 'text.secondary',
                textTransform: 'capitalize',
                fontWeight: 'fontWeightMedium',
                ...(active && {
                    color: item.colors.fontColor,
                    fontWeight: 'fontWeightSemiBold',
                    bgcolor: item.colors.bgColor,
                    '&:hover': {
                        bgcolor: item.colors.fontColor,
                        color: '#FFF',
                    },
                }),
                '&:hover': {
                    color: item.colors.fontColor,
                    bgcolor: item.colors.bgColor,
                    fontWeight: 'fontWeightSemiBold',
                },
            }}
            onClick={handleClick}
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
                {item.icon({
                    width: 24,
                    height: 24,
                    color:
                        onHover || active ? item.colors.fontColor : '#343B4F',
                })}
            </Box>
            <Box component="span">{item.title}</Box>
        </ListItemButton>
    )
}

NavItem.propTypes = {
    item: PropTypes.object,
}

export default NavItem
