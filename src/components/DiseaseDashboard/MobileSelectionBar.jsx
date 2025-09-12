import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListItemText,
} from '@mui/material'
import { useState, useEffect } from 'react'
import i18n from '../../locales'

const MobileSelectionBar = ({
    sourceOptions,
    adminLevelOptions,
    onSourceChange,
    onAdminLevelChange,
}) => {
    const [source, setSource] = useState(sourceOptions[0]?.value || '')
    const [adminLevel, setAdminLevel] = useState(
        adminLevelOptions[0]?.value || ''
    )

    useEffect(() => {
        const find = sourceOptions.find(({ value }) => value === source)
        find
            ? onSourceChange(find)
            : console.log('unknown error happen with sourceOptions')
    }, [source])

    useEffect(() => {
        const find = adminLevelOptions.find(({ value }) => value === adminLevel)
        find
            ? onAdminLevelChange(find)
            : console.log('unknown error happen with adminLevelOptions')
    }, [adminLevel])

    return (
        <>
            <FormControl fullWidth size="small">
                <InputLabel
                    id="demo-simple-select-standard-label"
                    style={{
                        backgroundColor: 'white',
                        padding: '0px 5px 0px 5px',
                    }}
                >
                    {i18n.t('Source')}
                </InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={source}
                    onChange={({ target }) => setSource(target.value)}
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'var(--color-gray-stroke)', 
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'var(--color-gray-light)', 
                        },
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                marginLeft: '-8px',
                            },
                        },
                        MenuListProps: {
                            sx: {
                                padding: 0,
                            },
                        },
                    }}
                >
                    {sourceOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            <ListItemText primary={option.label} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth size="small">
                <InputLabel
                    id="demo-simple-select-standard-label"
                    style={{
                        backgroundColor: 'white',
                        padding: '0px 5px 0px 5px',
                    }}
                >
                    {i18n.t('Administration level')}
                </InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={adminLevel}
                    onChange={({ target }) => setAdminLevel(target.value)}
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'var(--color-gray-stroke)', 
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'var(--color-gray-light)', 
                        },
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                marginLeft: '-8px',
                            },
                        },
                        MenuListProps: {
                            sx: {
                                padding: 0,
                            },
                        },
                    }}
                >
                    {adminLevelOptions.map((option) => (
                        <MenuItem key={option.id} value={option.value}>
                            <ListItemText primary={option.label} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    )
}

export default MobileSelectionBar
