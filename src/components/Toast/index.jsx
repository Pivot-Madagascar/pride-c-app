import React from 'react'
import InfoIcon from '@mui/icons-material/Info'
import SuccessIcon from '@mui/icons-material/CheckCircle'
import LoadingIcon from '@mui/icons-material/Cached'
import ErrorIcon from '@mui/icons-material/Error'
import CloseIcon from '@mui/icons-material/Close'
import toast from 'react-hot-toast'

const iconMap = {
    success: <SuccessIcon size={20} color="success" />,
    error: <ErrorIcon size={20} color="error" />,
    loading: <LoadingIcon size={20} color="secondary" />,
    info: <InfoIcon size={20} color="info" />,
    default: <InfoIcon size={20} color="info" />,
}

const CustomToast = ({ t, message, type = 'default' }) => {
    return (
        <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'}`}
            style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'white',
                padding: '12px 4px 12px 4px',
                borderRadius: '4px',
                marginTop: '50px',
                border: '1px solid grey'
            }}
        >
            <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {iconMap[type] || iconMap.default}
                <span>{message}</span>
            </div>
            <button
                onClick={() => toast.dismiss(t.id)}
                className="text-gray-500 hover:text-gray-800"
            >
                <CloseIcon size={20} />
            </button>
        </div>
    )
}

export default CustomToast
