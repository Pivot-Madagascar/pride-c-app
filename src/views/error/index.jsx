import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import { useDataManagement } from '../../hooks/useDataManagement'
import style from './error.module.scss'
import i18n from '../../locales'

const Error = () => {
    const navigate = useNavigate()
    const { clearCache, resetStore } = useDataManagement()
    const handleReload = () => {
        clearCache()
        resetStore()
        navigate('/')
    }
    return (
        <div className={style.container}>
            <div className={style.content}>
                <div className={style.image}>{`:(`}</div>
                <div className={style.message}>
                    {i18n.t('An error occurred!! Please reset the application.')}
                </div>
                <Button variant="outlined" onClick={handleReload} style={{ padding: 'auto'}}>
                    {i18n.t('Reset')}
                </Button>
            </div>
        </div>
    )
}

export default Error
