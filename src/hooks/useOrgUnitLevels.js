import { useDataQuery } from '@dhis2/app-runtime'
import { useState, useEffect } from 'react'

const orgUnitLevelsQuery = {
    orgUnitLevels: {
        resource: 'organisationUnitLevels',
        params: {
            fields: 'id,name,level',
        },
    },
}

const useOrgUnitLevels = () => {
    const { loading, error, data } = useDataQuery(orgUnitLevelsQuery)
    return {
        loading,
        error,
        orgUnitLevels: data?.orgUnitLevels.organisationUnitLevels || [],
    }
}

export default useOrgUnitLevels
