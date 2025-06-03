import PropTypes from 'prop-types'
import style from './helpButton.module.scss'

const HelpButton = ({ bgColor, text, onClick, sx }) => {
    const handleClick = () => {
        onClick({ open: true, content: text })
    }

    return (
        <div
            data-testid="help-btn"
            className={style.button}
            style={{ backgroundColor: bgColor, ...sx }}
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
