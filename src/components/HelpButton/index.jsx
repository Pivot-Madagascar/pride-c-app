import { Tooltip, tooltipClasses, styled } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import style from './helpButton.module.scss'

const HelpButton = ({ bgColor, text, onClick }) => {
    const handleClick = () => {
        onClick({ open: true, content: text })
    }

    return (
        <div
            role="button"
            className={style.button}
            style={{ backgroundColor: bgColor }}
            onClick={handleClick}
        >
            ?
        </div>
    )
}

HelpButton.propTypes = {
    bgColor: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
}

export default HelpButton
