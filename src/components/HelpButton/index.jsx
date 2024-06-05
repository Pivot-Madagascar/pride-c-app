import { Tooltip, tooltipClasses, styled } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import style from './helpButton.module.scss'

const HelpButton = ({ bgColor, text }) => {
    const LightTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(() => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: bgColor,
            color: 'inherit',
            fontSize: 11,
        },
    }))

    return (
        <LightTooltip title={text} placement="left-start" data-testid="tooltip">
            <div
                role="button"
                className={style.button}
                style={{ backgroundColor: bgColor }}
            >
                ?
            </div>
        </LightTooltip>
    )
}

HelpButton.propTypes = {
    bgColor: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
}

export default HelpButton