import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useState } from 'react'
const useOrgUnitLevels = () => {
    const engine = useDataEngine()
    const [organisationUnitLevels, setOrganisationUnitLevels] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        const fetchOrganisationUnitLevels = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await engine.query({
                    resource: 'organisationUnitLevels',
                    params: {
                        fields: 'id,name',
                    },
                })
                setOrganisationUnitLevels(response.organisationUnitLevels)
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }
        fetchOrganisationUnitLevels()
    }, [engine])
    return { organisationUnitLevels, loading, error }
}
export default useOrgUnitLevels
