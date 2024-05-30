import { Search as SearchIcon } from '@mui/icons-material'
import { Paper, InputBase, IconButton, Autocomplete, TextField } from '@mui/material'
import React from 'react'
import style from './searchInput.module.scss'

const SearchInput = ({ borderColor, options, onSelect }) => {
  const setCurrentOrgUnit = (event, newValue) => {
    onSelect(newValue)
  }
  return (
    <Paper
      component="form"
      className={style.inputContainer}
      style={{ borderColor: borderColor }}
    >
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon/>
      </IconButton>
      <Autocomplete
        id="orgUnit-searchInput"
        disableClearable
        sx={{ ml: 1, flex: 1, fontSize: '12px' }}
        options={options}
        getOptionLabel={(option) => option.displayName}
        renderInput={(params) => (
          <TextField
            sx={{ border: 'none' }}
            {...params}
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
            placeholder="Unité organisationnelle"
          />
        )}
        onChange={setCurrentOrgUnit}
      />
    </Paper>
  )
}

export default SearchInput