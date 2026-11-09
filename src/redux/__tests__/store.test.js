import { createStore, mergeWithInitialState } from '@/redux/store'
import appReducer, {
    setFetchedDataElementKeys,
    setFetchedIndicatorKeys,
    setFetchedDimensions,
} from '@/redux/appSlice'

// app slice as cached by versions before fetchedDataElementKeys/fetchedIndicatorKeys existed
const legacyAppSlice = {
    fetchedDimensions: ['dim-1'],
    isOnline: true,
    lastDataUpdate: '2026-08-01',
}

describe('mergeWithInitialState', () => {
    it('adds keys missing from a legacy cached slice and keeps cached values', () => {
        const merged = mergeWithInitialState({ app: appReducer }, { app: legacyAppSlice })

        expect(merged.app).toEqual({
            fetchedDimensions: ['dim-1'],
            fetchedDataElementKeys: [],
            fetchedIndicatorKeys: [],
            isOnline: true,
            lastDataUpdate: '2026-08-01',
        })
    })

    it('resets array fields whose cached value is not an array', () => {
        const merged = mergeWithInitialState(
            { app: appReducer },
            { app: { ...legacyAppSlice, fetchedIndicatorKeys: null } }
        )

        expect(merged.app.fetchedIndicatorKeys).toEqual([])
    })

    it('skips undefined, invalid and unknown cached slices', () => {
        const merged = mergeWithInitialState(
            { app: appReducer },
            { app: 'corrupted', unknown: { a: 1 }, other: undefined }
        )

        expect(merged).toEqual({})
        expect(mergeWithInitialState({ app: appReducer }, undefined)).toBeUndefined()
    })
})

describe('createStore with a legacy cached app slice', () => {
    beforeEach(() => jest.useFakeTimers()) // never flush the cache-save debounce
    afterEach(() => jest.useRealTimers())

    it('does not throw when fetched keys are dispatched', () => {
        const store = createStore({ app: legacyAppSlice })

        expect(() => {
            store.dispatch(setFetchedDataElementKeys('DE_CODE'))
            store.dispatch(setFetchedIndicatorKeys('IND_CODE'))
            store.dispatch(setFetchedDimensions('dim-2'))
        }).not.toThrow()

        const { app } = store.getState()
        expect(app.fetchedDataElementKeys).toEqual(['DE_CODE'])
        expect(app.fetchedIndicatorKeys).toEqual(['IND_CODE'])
        expect(app.fetchedDimensions).toEqual(['dim-1', 'dim-2'])
        expect(app.lastDataUpdate).toBe('2026-08-01')
    })
})
