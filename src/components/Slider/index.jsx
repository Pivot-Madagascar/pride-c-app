import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import React from 'react'
import style from './Slider.module.scss'

const CustomSlider = ({ color, marks, onChange }) => {
    return (
        <Box sx={{ width: '80%', paddingTop: 0.5, margin: 'auto', textTransform: 'capitalize' }}>
            <Slider
                defaultValue={0}
                step={1}
                marks={marks}
                min={0}
                max={2}
                color={color}
                onChange={(event) => onChange(event.target.value)}
            />
        </Box>
    )
}

export default CustomSlider
