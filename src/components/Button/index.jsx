import React from 'react'
import PropTypes from 'prop-types'
import style from '@/components/Button/button.module.scss'

const Button = ({ onClick, label }) => {

    return (
        <div
            data-testid="help-btn"
            className={style.button}
            onClick={onClick}
        >
            { label || '?' }
        </div>
    )
}

Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    label: PropTypes.string,
}

export default Button
