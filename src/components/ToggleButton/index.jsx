import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import COLORS from '../../constants/styles'
import style from './toggleButton.module.scss'

const ToggleButton = ({ options, bgColor, onSelect }) => {
    const [selectedItem, setSelectedItem] = useState(null)

    const getFirstEnabledElement = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            if (!arr[i].disabled) {
                return arr[i]
            }
        }
        return null
    }

    const handleItemClick = (item, isDisabled) => {
        if (!isDisabled && item.value !== selectedItem) {
            setSelectedItem(item.value)
            if (onSelect) {
                onSelect(item)
            }
        }
    }

    useEffect(() => {
        const nonNullFirstEl = getFirstEnabledElement(options)
        if (nonNullFirstEl) {
            setSelectedItem(nonNullFirstEl.value)
            onSelect(nonNullFirstEl)
        }
    }, [])

    return (
        <div
            className={style.toggleButton}
            style={{ backgroundColor: bgColor }}
        >
            <div className={style.buttonGroup}>
                {options.map((option) => (
                    <button
                        key={option.value}
                        data-testid={`${option.id}-btn`}
                        style={{
                            backgroundColor:
                                selectedItem === option.value &&
                                !option.disabled
                                    ? COLORS.white
                                    : 'transparent',
                            cursor: option.disabled ? 'not-allowed' : 'pointer',
                        }}
                        className={style.toggleButtonItem}
                        onClick={() =>
                            handleItemClick(option, option.disabled)
                        }
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

ToggleButton.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ]).isRequired,
        })
    ).isRequired,
    bgColor: PropTypes.string.isRequired,
    onSelect: PropTypes.func,
    disabled: PropTypes.bool,
}

export default ToggleButton
