import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import { useDataManagement } from '../../hooks'
import style from './error.module.scss'

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
                    Une erreur est survenue!! 
                    <br/>
                    Veuillez réinitialiser l'application.
                </div>
                <Button variant="outlined" onClick={handleReload} style={{ padding: 'auto'}}>
                    Reinitialiser
                </Button>
            </div>
        </div>
    )
}

export default Error
