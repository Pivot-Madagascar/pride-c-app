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
import React from 'react'
import style from './Modal.module.scss'

const Modal = ({ open, handleClose, title, children }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <div className={style.header}>
                <DialogTitle>{title}</DialogTitle>
                <IconButton 
                    onClick={handleClose} 
                    sx={{ paddingRight: '20px' }}
                    data-testid="close-btn"
                >
                    <CloseIcon />
                </IconButton>
            </div>

            <DialogContent>{children}</DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" data-testid="close-actions-btn">
                    Fermer
                </Button>
            </DialogActions>
        </Dialog>
    )
}

Modal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
}

export default Modal
