import { useEffect, useState } from 'react'
import { useDataEngine } from '@dhis2/app-runtime'
import { useDispatch, useSelector } from 'react-redux'
import { setFetchedDimensions } from '../redux/appSlice'

const useOrgUnitDetails = (uid) => {
    const engine = useDataEngine()
    const dispatch = useDispatch()

    const [orgUnitDetails, setOrgUnitDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const cachedDimensions = useSelector((state) => state.app.fetchedDimensions)
    const storedParentDetails = useSelector((state) => state.orgUnit.parentDetails)

    useEffect(() => {
        const fetchOrgUnitDetails = async () => {

            const query = {
                orgUnit: {
                    resource: `organisationUnits/${uid}`,
                    params: {
                        fields: 'id,name,level',
                    },
                },
            }

            const key = JSON.stringify(query)

            const isStored = cachedDimensions.includes(key)

            if (!isStored) {
                try {
                    setLoading(true)
                    const result = await engine.query(query)
                    setOrgUnitDetails(result?.orgUnit || null)
                    setError(null)
                } catch (err) {
                    setError(err)
                    setOrgUnitDetails(null)
                } finally {
                    setLoading(false)
                    dispatch(setFetchedDimensions(key))
                }
            } else {
                setLoading(false)
                setOrgUnitDetails(storedParentDetails)
                setError(null)
            }
        }

        if (uid) {
            fetchOrgUnitDetails()
        }
    }, [engine, uid])

    return {
        loading,
        error,
        orgUnitDetails,
    }
}

export default useOrgUnitDetails
