import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFetchedDimensions } from '../redux/appSlice'

const usePridecOrgUnits = (uid) => {
    const engine = useDataEngine()
    const dispatch = useDispatch()

    const [pridecOrgUnits, setPridecOrgUnits] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const cachedDimensions = useSelector((state) => state.app.fetchedDimensions)
    const storedPridecOrgUnits = useSelector((state) => state.orgUnit.pridecOrgUnits)

    useEffect(() => {
        const fetchOrgUnitLevels = async () => {
            const query = {
                dataSets: {
                    resource: `dataSets/${uid}`,
                    params: {
                        fields: 'organisationUnits[id,name,level]',
                    },
                },
            }

            const key = JSON.stringify(query)

            const isStored = cachedDimensions.includes(key)

            if (!isStored) {
                try {
                    setLoading(true)
                    const response = await engine.query(query)
                    const orgUnitsLevel5 =
                        response.dataSets.organisationUnits.filter(
                            (unit) => unit.level === 5
                        )
                    setPridecOrgUnits(orgUnitsLevel5)
                    setError(null)
                } catch (err) {
                    setError(err)
                    setPridecOrgUnits([])
                } finally {
                    setLoading(false)
                    dispatch(setFetchedDimensions(key))
                }
            } else {
                setLoading(false)
                setPridecOrgUnits(storedPridecOrgUnits)
                setError(null)
            }
        }

        fetchOrgUnitLevels()
    }, [engine])

    return {
        loading,
        error,
        pridecOrgUnits,
    }
}

export default usePridecOrgUnits
