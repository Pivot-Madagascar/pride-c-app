import { Search as SearchIcon } from '@mui/icons-material'
import { Paper, Autocomplete, TextField, InputAdornment } from '@mui/material'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import style from './searchInput.module.scss'

const SearchInput = ({ options, currentValue, onSelect, adminDivisionType }) => {
    const [value, setValue] = useState(currentValue || null)
    const [inputValue, setInputValue] = useState(currentValue ? currentValue.displayName : '')

    useEffect(() => {
        if (currentValue) {
            setValue(currentValue)
            setInputValue(currentValue.displayName || '')
        }
    }, [currentValue])

    useEffect(() => {
        if (currentValue) {
            setValue(currentValue)
            setInputValue(currentValue.displayName || '')
        } else {
            setValue(null)
            setInputValue('')
        }
    }, [currentValue])

    useEffect(() => {
        onSelect(null)
        setValue(null)
        setInputValue('')
    }, [options])

    return (
        <Paper component="form" className={style.inputContainer}>
            <Autocomplete
                id="search-input-single"
                sx={{ ml: 1, flex: 1, fontSize: '12px' }}
                options={options}
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue)
                    onSelect(newValue)
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue)
                }}
                getOptionLabel={(option) => option.displayName || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                        {option.displayName}
                        { adminDivisionType === 'fokontany' && <span className={style.municipalityIndex}>  Commune {option.municipality}</span>}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        placeholder="Unité organisationnelle"
                        variant="outlined"
                        sx={{ border: 'none', borderColor: 'transparent' }}
                    />
                )}
            />
        </Paper>
    )
}

SearchInput.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            displayName: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            municipality: PropTypes.string,
            municipalityId: PropTypes.string,
            formationSanitaire: PropTypes.string,
            formationSanitaireId: PropTypes.string,
        })
    ).isRequired,
    currentValue: PropTypes.shape({
        displayName: PropTypes.string,
        id: PropTypes.string,
        municipality: PropTypes.string,
        municipalityId: PropTypes.string,
        formationSanitaire: PropTypes.string,
        formationSanitaireId: PropTypes.string,
    }),
    onSelect: PropTypes.func.isRequired,
}

export default SearchInput
