import {
    OutlinedInput,
    InputLabel,
    MenuItem,
    FormControl,
    ListItemText,
    Select,
    Checkbox,
} from '@mui/material'
import React, { useState, useEffect } from 'react'
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

const MultiSelect = ({ options, onSelect }) => {
    const [selected, setSelected] = useState([])
    const [selectedLabel, setSelectedLabel] = useState([])

    const getLabelByValue = (value) => {
        const item = options.find((option) => option.value === value)
        return item ? item.label : null
    }

    const handleChange = (event) => {
        const {
            target: { value },
        } = event

        let newValue = typeof value === 'string' ? value.split(',') : value

        // Limit the number of selected items to 2
        if (newValue.length > 2) {
            newValue = newValue.slice(0, 2)
        }

        setSelected(newValue)
        onSelect(newValue)
    }

    useEffect(() => {
        const label = selected.map(element => getLabelByValue(element))
        setSelectedLabel(label)
    }, [selected])

    return (
        <div>
            <FormControl sx={{ width: '100%' }}>
                <InputLabel id="demo-multiple-checkbox-label">
                    Variables climatique (choisir 2)
                </InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={selected}
                    onChange={handleChange}
                    input={<OutlinedInput label="Variables climatique (choisir 2)" />}
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
