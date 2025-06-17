import MultiSelect from '../MultiSelect'
import { useState, useEffect } from 'react'
import {
    Select,
    MenuItem,
    ListItemText,
    InputLabel,
    FormControl,
} from '@mui/material'

const MobileSelectionBar = ({
    climateVariables,
    adminLevelOptions,
    onClimateVarChange,
    onAdminLevelChange,
}) => {
    const [activeVariables, setActiveVariables] = useState([])
    const [adminLevel, setAdminLevel] = useState(
        adminLevelOptions[0]?.value || ''
    )
    
    useEffect(() => {
        const find = adminLevelOptions.find(({ value }) => value === adminLevel)
        find 
            ? onAdminLevelChange(find)
            : console.log('unknown error happen with adminLevelOptions')
    },[adminLevel])

    useEffect(() => {
        onClimateVarChange(activeVariables)
    }, [activeVariables])

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                width: '100%',
                margin: 'auto',
            }}
        >
            <MultiSelect
                options={climateVariables}
                onSelect={(event) => setActiveVariables(event)}
                label="Variables climatique (choisir 2)"
                maxSelectable={2}
            />
            <FormControl fullWidth>
                <InputLabel
                    id="demo-simple-select-standard-label"
                    style={{
                        backgroundColor: 'white',
                        padding: '0px 5px 0px 5px',
                    }}
                >
                    Niveau d'administration
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
            
        </div>
    )
}

export default MobileSelectionBar
