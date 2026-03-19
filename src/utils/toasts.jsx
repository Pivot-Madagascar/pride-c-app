import React from 'react'
import InfoIcon from '@mui/icons-material/Info'
import { toast } from 'react-hot-toast'
import CustomToast from '../components/Toast'

export const showToast = (message, type = 'default', id = null) => {
  toast.custom((t) => (
    <CustomToast t={t} message={message} type={type} />
  ), { id, duration: 2000 });
};
