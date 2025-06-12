import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import React, { useState } from 'react'
import style from './MultiSelect.module.scss'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
}

const MultiSelect = ({ options, onSelect, label, maxSelectable = Infinity }) => {
    const [selected, setSelected] = useState([])

    const getLabelByValue = (value) => {
        const item = options.find((option) => option.value === value)
        return item ? item.label : null
    }

    const handleChange = (event) => {
        const { target: { value } } = event
        let newValue = typeof value === 'string' ? value.split(',') : value
        if (newValue.length > maxSelectable) { 
            newValue = newValue.slice(0, maxSelectable) 
        }
        setSelected(newValue)
        onSelect(newValue)
    }

    return (
        <div >
            <FormControl sx={{ width: '100%' }}>
                <InputLabel id="demo-multiple-checkbox-label">
                    { label }
                </InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={selected}
                    onChange={handleChange}
                    input={<OutlinedInput label={label} />}
                    renderValue={(selected) => selected.map(value => getLabelByValue(value)).join(', ')}
                    MenuProps={MenuProps}
                >
                    {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            <Checkbox
                                checked={selected.indexOf(option.value) > -1}
                            />
                            <ListItemText primary={option.label} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )
}

export default MultiSelect