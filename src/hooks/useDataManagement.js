import { useStore } from 'react-redux'
import { storeUtils } from '@/redux/store'

export const useDataManagement = () => {
    const store = useStore()
    const persistence = store.persistence

    return {
        clearCache: () => persistence?.clear?.(),
        saveCache: () => persistence?.save?.(),
        resetStore: () => store.dispatch(storeUtils.reset()),
        clearAll: async () => {
            if (persistence?.clear) {
                await persistence.clear()
            }
            store.dispatch(storeUtils.reset())
        },
        hydrateStore: (data) => store.dispatch(storeUtils.hydrate(data)),
        isPersistenceEnabled: !!persistence?.isEnabled,
    }
}
