import React, { useState } from 'react'
import Fab from '@mui/material/Fab'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import PropTypes from 'prop-types'
import Modal from '@/components/Modal'
import style from './FloatingActionButton.module.scss'

const FloatingActionButton = ({ modalTitle, modalContent, fabLabel, fabColor = 'secondary', fabHoverColor = 'primary', fabHoverColors }) => {
    const [open, setOpen] = useState(false)

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            <Fab
                color={fabColor === 'primary' ? 'primary' : undefined}
                aria-label={fabLabel}
                className={style.fab}
                onClick={handleOpen}
                data-testid="floating-action-button"
                sx={fabColor !== 'primary' ? {
                    bgcolor: fabColor,
                    '&:hover': {
                        filter: 'brightness(0.8)',
                    },
                } : undefined}
            >
                <FileDownloadIcon />
            </Fab>
            <Modal
                open={open}
                onClose={handleClose}
                title={modalTitle}
                closeBtnLabel="Fermer"
            >
                <div className={style.modalContent}>
                    {modalContent(handleClose)}
                </div>
            </Modal>
        </>
    )
}

FloatingActionButton.propTypes = {
    modalTitle: PropTypes.string.isRequired,
    modalContent: PropTypes.func.isRequired,
    fabLabel: PropTypes.string.isRequired,
    fabColor: PropTypes.string,
    fabHoverColor: PropTypes.string,
    fabHoverColors: PropTypes.shape({
        textColor: PropTypes.string.isRequired,
        bgColor: PropTypes.string.isRequired
    }).isRequired
}

export default FloatingActionButton
