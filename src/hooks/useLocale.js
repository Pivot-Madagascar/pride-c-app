import { useDataQuery } from '@dhis2/app-runtime'

const query = {
    locale: {
        resource: 'userSettings/keyUiLocale',
    },
}

export const useLocale = () => {
    const { loading, error, data, refetch } = useDataQuery(query)

    const locale = data && data.locale ? data.locale : 'fr' // Default to 'fr' if no data

    return {
        locale,
        loading,
        error,
        refetch,
    }
}