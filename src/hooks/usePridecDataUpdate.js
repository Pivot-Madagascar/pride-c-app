import { useDataQuery } from '@dhis2/app-runtime'

const query = {
    pridecUpdate: {
        resource: 'dataStore/pridec/pridec_update',
    },
}

export const usePridecUpdate = () => {
    const { loading, error, data, refetch } = useDataQuery(query)

    return {
        data: data?.pridecUpdate ?? null, // already parsed JSON
        loading,
        error,
        refetch,
    }
}
