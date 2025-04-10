import { useDataQuery } from '@dhis2/app-runtime'
import { useMemo } from 'react'
const useOrgUnitDetails = (uid) => {
    const query = useMemo(
        () => ({
            orgUnit: {
                resource: 'organisationUnits',
                id: uid,
                params: {
                    fields: 'id, name, level',
                },
            },
        }),
        [uid]
    ) 
    const { loading, error, data } = useDataQuery(query)

    return {
        loading,
        error,
        orgUnitDetails: data?.orgUnit,
    }
}
export default useOrgUnitDetails
