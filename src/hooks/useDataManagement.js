import { useStore } from 'react-redux'
import { storeUtils } from '../redux/store'

export const useDataManagement = () => {
    const store = useStore()

    return {
        clearCache: () => store.persistence.clear(),
        saveCache: () => store.persistence.save(),
        resetStore: () => store.dispatch(storeUtils.reset()),
        clearAll: async () => {
            await store.persistence.clear()
            store.dispatch(storeUtils.reset())
        },
        hydrateStore: (data) => store.dispatch(storeUtils.hydrate(data)),
        isPersistenceEnabled: store.persistence.isEnabled,
    }
}
