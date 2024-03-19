import { ExpandLess, ExpandMore } from '@mui/icons-material'
import {
    ListItemButton,
    Collapse,
    ListItemIcon,
    ListItemText,
    InboxIcon,
    StarBorder,
    List,
    Box,
    Grid,
} from '@mui/material'
import React, { useState } from 'react'
import ExpandLessIcon from '../../components/Icons/ExpandLess'
import ExpandMoreIcon from '../../components/Icons/ExpandMore'
import RouterLink from '../../routes/components/router-link'
// import { usePathname } from '../../routes/hooks/use-pathname'

const NavItem = ({ item }) => {
    const [open, setOpen] = useState(false)
    const [onHover, setHover] = useState(false)
    // const pathname = usePathname()
    // const active = nestedItem.pathname === pathname

    const handleClick = () => {
        setOpen(!open)
    }
    return (
        <>
            <ListItemButton
                sx={{
                    minHeight: 44,
                    borderRadius: 0.75,
                    typography: 'body2',
                    color: 'text.secondary',
                    textTransform: 'capitalize',
                    fontWeight: 'fontWeightMedium',
                    ...(open && {
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
                            onHover || open ? item.colors.fontColor : '#343B4F',
                    })}
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Box component="div">{item.title}</Box>
                    {open ? (
                        <ExpandLessIcon color={item.colors.fontColor} />
                    ) : (
                        <ExpandMoreIcon />
                    )}
                </Box>
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {item.nestedMenu.map((nestedItem) => (
                        <ListItemButton
                            component={RouterLink}
                            href={nestedItem.path}
                            sx={{
                                minHeight: 44,
                                borderRadius: 0.75,
                                typography: 'body2',
                                textTransform: 'capitalize',
                                fontWeight: 'fontWeightMedium',
                                color: item.colors.fontColor,
                                bgcolor: item.colors.bgColor,
                            }}
                        >
                            <Box
                                component="span"
                                sx={{ width: 24, height: 24, mr: 2 }}
                                onMouseOver={() => setHover(true)}
                                onMouseLeave={() => setHover(false)}
                            >
                                {nestedItem.icon({
                                    width: 24,
                                    height: 24,
                                    color: item.colors.fontColor
                                })}
                            </Box>
                            <Box component="span">{nestedItem.title}</Box>
                        </ListItemButton>
                    ))}
                </List>
            </Collapse>
        </>
    )
}

export default NavItem
