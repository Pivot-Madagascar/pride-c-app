import { useEffect, useState } from 'react'
import { useDataEngine } from '@dhis2/app-runtime'
import { useDispatch, useSelector } from 'react-redux'
import { setFetchedDimensions } from '../redux/appSlice'

const useOrgUnitLevels = () => {
    const engine = useDataEngine()
    const dispatch = useDispatch()

    const [orgUnitLevels, setOrgUnitLevels] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const cachedDimensions = useSelector((state) => state.app.fetchedDimensions)
    const storedOrgUnitLevels = useSelector((state) => state.orgUnit.orgUnitLevels)

    useEffect(() => {
        const fetchOrgUnitLevels = async () => {

            const query = {
                orgUnitLevels: {
                    resource: 'organisationUnitLevels',
                    params: {
                        fields: 'id,name,level',
                    }
                },
            }

            const key = JSON.stringify(query)

            const isStored = cachedDimensions.includes(key)

            if (!isStored) {
                try {
                    setLoading(true)
                    const result = await engine.query(query)
                    setOrgUnitLevels(
                        result?.orgUnitLevels?.organisationUnitLevels || []
                    )
                    setError(null)
                } catch (err) {
                    setError(err)
                    setOrgUnitLevels([])
                } finally {
                    setLoading(false)
                    dispatch(setFetchedDimensions(key))
                }
            } else {
                setLoading(false)
                setOrgUnitLevels(storedOrgUnitLevels)
                setError(null)
            }
        }
        
        fetchOrgUnitLevels()
    }, [engine])

    return {
        loading,
        error,
        orgUnitLevels,
    }
}

export default useOrgUnitLevels
