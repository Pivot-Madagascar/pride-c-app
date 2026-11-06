import { CACHE_VERSION, loadStateFromCache } from '@/redux/store'

// Minimal in-memory Cache Storage API
const setupCaches = (initialEntries = {}) => {
    const stores = new Map()
    const open = (name) => {
        if (!stores.has(name)) {
            stores.set(name, new Map())
        }
        const store = stores.get(name)
        return {
            match: async (key) =>
                store.has(key) ? { json: async () => JSON.parse(store.get(key)) } : undefined,
            put: async (key, response) => store.set(key, response.body),
            keys: async () => [...store.keys()].map((url) => ({ url })),
        }
    }
    const initial = new Map(Object.entries(initialEntries).map(([k, v]) => [k, JSON.stringify(v)]))
    stores.set('redux-cache', initial)

    global.caches = {
        open: async (name) => open(name),
        delete: async (name) => stores.delete(name),
    }
    global.Response = class {
        constructor(body) {
            this.body = body
        }
    }
    return { entries: () => Object.fromEntries(stores.get('redux-cache') ?? []) }
}

const legacyApp = { fetchedDimensions: ['dim-1'], isOnline: true, lastDataUpdate: '2026-08-01' }

describe('loadStateFromCache version check', () => {
    afterEach(() => {
        delete global.caches
    })

    it('drops a cache written without version (pre-versioning app) and stamps the current version', async () => {
        const cache = setupCaches({ '/redux-state/app': legacyApp, '/redux-state/malaria': { old: 1 } })

        const state = await loadStateFromCache()

        expect(state).toEqual({})
        expect(cache.entries()).toEqual({
            '/redux-state/__cache_version': JSON.stringify(CACHE_VERSION),
        })
    })

    it('drops a cache written by another version', async () => {
        setupCaches({ '/redux-state/__cache_version': '1.0.0#1', '/redux-state/app': legacyApp })

        expect(await loadStateFromCache()).toEqual({})
    })

    it('loads slices when the cache version matches', async () => {
        setupCaches({ '/redux-state/__cache_version': CACHE_VERSION, '/redux-state/app': legacyApp })

        const state = await loadStateFromCache()

        expect(state.app).toEqual(legacyApp)
        expect(state.malaria).toBeUndefined()
    })
})
