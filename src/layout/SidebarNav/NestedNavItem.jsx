import ListItemButton from '@mui/material/ListItemButton'
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'
import Box from '@mui/material/Box'
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ExpandLessIcon from '../../components/Icons/ExpandLess'
import ExpandMoreIcon from '../../components/Icons/ExpandMore'
import RouterLink from '../../routes/components/router-link'
import { useNavIndex } from './NavIndexContext'

const NavItem = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    const [onHover, setHover] = useState(false)
    const [subOnHover, setSubHover] = useState(false)

    const { setNavIndex, navIndex } = useNavIndex()
    const location = useLocation()
    const currentUrl = location.pathname

    useEffect(() => {
        if (navIndex !== index) {
            setOpen(false)
        }
    }, [navIndex])

    const handleClick = () => {
        setOpen(!open)
        setNavIndex(index)
    }

    return (
        <Box
            sx={{
                borderRadius: 0.75,
                overflow: 'hidden',
            }}
        >
            <ListItemButton
                sx={{
                    minHeight: 44,
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
                        <ExpandMoreIcon color={item.colors.fontColor} />
                    ) : (
                        <ExpandLessIcon />
                    )}
                </Box>
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {item.nestedMenu.map((nestedItem, index) => {
                        const active = currentUrl === nestedItem.path

                        const iconColor = open
                            ? active
                                ? subOnHover
                                    ? item.colors.fontColor
                                    : '#FFF'
                                : item.colors.fontColor
                            : item.colors.fontColor

                        const bgColor = open
                            ? active
                                ? subOnHover
                                    ? item.colors.bgColor
                                    : item.colors.fontColor
                                : item.colors.bgColor
                            : item.colors.bgColor

                        return (
                            <ListItemButton
                                component={RouterLink}
                                href={nestedItem.path}
                                key={index}
                                sx={{
                                    minHeight: 44,
                                    typography: 'body2',
                                    textTransform: 'capitalize',
                                    fontWeight: 'fontWeightMedium',
                                    color: iconColor,
                                    bgcolor: bgColor,
                                }}
                                onMouseOver={() => setSubHover(true)}
                                onMouseLeave={() => setSubHover(false)}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        mr: 2,
                                    }}
                                >
                                    {nestedItem.icon({
                                        width: 24,
                                        height: 24,
                                        color: iconColor,
                                    })}
                                </Box>
                                <Box component="span">{nestedItem.title}</Box>
                            </ListItemButton>
                        )
                    })}
                </List>
            </Collapse>
        </Box>
    )
}

export default NavItem
