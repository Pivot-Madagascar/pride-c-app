import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import React, { useState, useEffect } from 'react'
import style from '@/components/DataTable/dataTable.module.scss'

const ColumnFilter = ({
    options,
    onSelect,
    parentLabel,
}) => {
    const [checked, setChecked] = useState(() => 
        options.map((option) => option.show)
    )

    useEffect(() => {
        const updatedOptions = options.map((item, index) => ({
            ...item,
            show: checked[index],
        }))
        onSelect(updatedOptions)
    }, [checked, options, onSelect])

    const handleChangeAll = (event) => {
        const newChecked = options.map(() => event.target.checked)
        setChecked(newChecked)
    }

    const handleChildChange = (index) => (event) => {
        const newChecked = [...checked]
        newChecked[index] = event.target.checked
        setChecked(newChecked)
    }

    const allChecked = checked.every(Boolean)
    const someChecked = checked.some(Boolean)

    return (
        <div className={style.checkboxContainer}>
            <FormControlLabel
                label={parentLabel}
                control={
                    <Checkbox
                        checked={allChecked}
                        indeterminate={someChecked && !allChecked}
                        onChange={handleChangeAll}
                    />
                }
            />
            <div className={style.checkboxChildren}>
                {options.map((option, index) => (
                    <FormControlLabel
                        key={option.value}
                        label={option.label}
                        control={
                            <Checkbox
                                checked={checked[index]}
                                onChange={handleChildChange(index)}
                            />
                        }
                    />
                ))}
            </div>
        </div>
    )
}

export default ColumnFilter
