import { Search as SearchIcon } from '@mui/icons-material'
import { Box, Autocomplete, TextField, InputAdornment } from '@mui/material'
import PropTypes from 'prop-types'
import { useState, useEffect, useMemo } from 'react'
import style from './searchInput.module.scss'
const SearchInput = ({
    options,
    currentValue,
    onSelect,
    width,
    showSearchIcon,
    groupByLevel,
}) => {
    const [value, setValue] = useState(null) 
    const [inputValue, setInputValue] = useState('') 
    const [currentOptions, setCurrentOptions] = useState([])
    const [disable, setDisable] = useState(false)

    const memoizedOptions = useMemo(() => options, [options])

    useEffect(() => {
        if (!memoizedOptions || memoizedOptions.length === 0) {
            return
        }
        setDisable(true)
        setValue(null)
        setInputValue('')
        setCurrentOptions(memoizedOptions)
        if (memoizedOptions.length === 1) {
            onSelect(memoizedOptions[0])
            setValue(memoizedOptions[0])
        }
        setDisable(false)
    }, [memoizedOptions])

    useEffect(() => {
        if (currentValue && memoizedOptions && memoizedOptions.length) {
            const found = memoizedOptions.find(
                ({ id }) => id === currentValue
            )
            setValue(found || null) 
            setInputValue(found ? found.name : '')
        } else {
            if (!currentValue && memoizedOptions && memoizedOptions.length === 1) {
                onSelect(memoizedOptions[0])
                setValue(memoizedOptions[0])
            } else {
                setValue(null)
                setInputValue('')
            }
        }
    }, [currentValue, memoizedOptions])

    const sortedOptions = useMemo(() => {
        return [...currentOptions].sort((a, b) => {
            const parentA =
                a.parents?.find((p) => Number(p.level) === groupByLevel)
                    ?.name || ''
            const parentB =
                b.parents?.find((p) => Number(p.level) === groupByLevel)
                    ?.name || ''
            return (
                parentA.localeCompare(parentB) || a.name.localeCompare(b.name)
            )
        })
    }, [currentOptions, groupByLevel])
    return (
        <Box
            component="form"
            className={style.inputContainer}
            sx={{ backgroundColor: 'transparent', width: width }}
        >
            <Autocomplete
                id="search-input-single"
                disabled={disable}
                sx={{
                    width: '100%',
                    fontSize: '12px',
                    backgroundColor: 'transparent',
                }}
                options={sortedOptions}
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue)
                    onSelect(newValue)
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue)
                }}
                groupBy={(option) => {
                    const parent = option.parents?.find(
                        (p) => Number(p.level) === groupByLevel
                    )
                    return parent
                        ? `${parent.adminLevelName} ${parent.name}`
                        : ''
                }}
                getOptionLabel={(option) => option.name || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                        {option.name}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                    {showSearchIcon && (
                                        <SearchIcon
                                            sx={{ marginLeft: '0.75rem' }}
                                        />
                                    )}
                                </InputAdornment>
                            ),
                        }}
                        placeholder="Unité organisationnelle"
                        variant="outlined"
                        sx={{ border: 'none', borderColor: 'transparent' }}
                        disabled={disable}
                    />
                )}
            />
        </Box>
    )
}
SearchInput.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            id: PropTypes.string,
            level: PropTypes.string,
        })
    ),
    currentValue: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    adminDivisionType: PropTypes.string,
    width: PropTypes.string,
    disabled: PropTypes.bool,
}
SearchInput.defaultProps = {
    width: '30%',
    disabled: false,
    showSearchIcon: true,
}
export default SearchInput
