import { Close as CloseIcon } from '@mui/icons-material'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
} from '@mui/material'
import PropTypes from 'prop-types'
import style from './Modal.module.scss'

const Modal = ({ open, onClose, title, children, closeBtnLabel }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth={true}>
            <div className={style.header}>
                <DialogTitle>{title}</DialogTitle>
                <IconButton
                    onClick={onClose}
                    sx={{ paddingRight: '20px' }}
                    data-testid="close-btn"
                >
                    <CloseIcon />
                </IconButton>
            </div>

            <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
                {children}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    color="primary"
                    data-testid="close-actions-btn"
                >
                    {closeBtnLabel}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

Modal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    closeBtnLabel: PropTypes.string,
}

Modal.defaultProps = {
    closeBtnLabel: 'Fermer',
}

export default Modal
