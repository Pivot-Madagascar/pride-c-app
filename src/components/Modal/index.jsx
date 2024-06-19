import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material'
import DOMPurify from 'dompurify'
import PropTypes from 'prop-types'
import React from 'react'

const Modal = ({ open, handleClose, content }) => {
    // Sanitize the HTML content
    const sanitizedContent = DOMPurify.sanitize(content)

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Aide</DialogTitle>
            <DialogContent>
                <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Fermer
                </Button>
            </DialogActions>
        </Dialog>
    )
}

Modal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    content: PropTypes.string.isRequired,
}

export default Modal
