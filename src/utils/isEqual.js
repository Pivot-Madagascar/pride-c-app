const isEqual = (a, b) => {
    // Handle strict equality (covers primitives, same reference objects, NaN)
    if (Object.is(a, b)) {
        return true
    }

    // Handle null/undefined cases
    if (a == null || b == null) {
        return a === b
    }

    // Handle different types
    if (typeof a !== typeof b) {
        return false
    }

    // Handle primitive types that aren't strictly equal
    if (typeof a !== 'object') {
        return false
    }

    // Handle Date objects
    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
    }

    // Handle RegExp objects
    if (a instanceof RegExp && b instanceof RegExp) {
        return a.toString() === b.toString()
    }

    // Handle Error objects
    if (a instanceof Error && b instanceof Error) {
        return a.name === b.name && a.message === b.message
    }

    // Handle ArrayBuffer
    if (a instanceof ArrayBuffer && b instanceof ArrayBuffer) {
        if (a.byteLength !== b.byteLength) {
            return false
        }
        const viewA = new Uint8Array(a)
        const viewB = new Uint8Array(b)
        for (let i = 0; i < viewA.length; i++) {
            if (viewA[i] !== viewB[i]) {
                return false
            }
        }
        return true
    }

    // Handle TypedArrays
    const typedArrayTypes = [
        Int8Array,
        Uint8Array,
        Uint8ClampedArray,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array,
    ].filter(Boolean)

    for (const TypedArray of typedArrayTypes) {
        if (a instanceof TypedArray && b instanceof TypedArray) {
            if (a.length !== b.length) {
                return false
            }
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) {
                    return false
                }
            }
            return true
        }
    }

    // Handle Set objects
    if (a instanceof Set && b instanceof Set) {
        if (a.size !== b.size) {
            return false
        }
        for (const val of a) {
            let found = false
            for (const otherVal of b) {
                if (isEqual(val, otherVal)) {
                    found = true
                    break
                }
            }
            if (!found) {
                return false
            }
        }
        return true
    }

    // Handle Map objects
    if (a instanceof Map && b instanceof Map) {
        if (a.size !== b.size) {
            return false
        }
        for (const [key, val] of a) {
            let found = false
            for (const [otherKey, otherVal] of b) {
                if (isEqual(key, otherKey) && isEqual(val, otherVal)) {
                    found = true
                    break
                }
            }
            if (!found) {
                return false
            }
        }
        return true
    }

    // Handle WeakSet and WeakMap (limited comparison)
    if (
        (a instanceof WeakSet && b instanceof WeakSet) ||
        (a instanceof WeakMap && b instanceof WeakMap)
    ) {
        // WeakSet/WeakMap don't have enumerable properties, can only check if same reference
        return a === b
    }

    // Handle Arrays
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false
        }
        for (let i = 0; i < a.length; i++) {
            if (!isEqual(a[i], b[i])) {
                return false
            }
        }
        return true
    }

    // Handle different array-like status
    if (Array.isArray(a) !== Array.isArray(b)) {
        return false
    }

    // Handle plain objects and other object types
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    // Check same number of enumerable properties
    if (keysA.length !== keysB.length) {
        return false
    }

    // Check all enumerable properties
    for (const key of keysA) {
        if (!keysB.includes(key)) {
            return false
        }
        if (!isEqual(a[key], b[key])) {
            return false
        }
    }

    // Check symbol properties
    const symbolsA = Object.getOwnPropertySymbols(a)
    const symbolsB = Object.getOwnPropertySymbols(b)

    if (symbolsA.length !== symbolsB.length) {
        return false
    }

    for (const symbol of symbolsA) {
        if (!symbolsB.includes(symbol)) {
            return false
        }
        if (!isEqual(a[symbol], b[symbol])) {
            return false
        }
    }

    // Check prototype chain
    const protoA = Object.getPrototypeOf(a)
    const protoB = Object.getPrototypeOf(b)

    if (protoA !== protoB) {
        return false
    }

    return true
}

export { isEqual }
