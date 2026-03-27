import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import PropTypes from 'prop-types'
import style from '@/components/Modal/Modal.module.scss'

const Modal = ({ open, onClose, title, children, closeBtnLabel = 'Fermer' }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth={true}>
            <div className={style.header}>
                <span style={{ fontSize: '18px', display: 'block', padding: '12px 0px 0px 12px', fontWeight: 'bold' }}>{title}</span>
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

export default Modal
