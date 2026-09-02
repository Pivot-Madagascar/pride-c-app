import { useRef } from 'react'
import { isEqual } from '@/utils'

const useMemoCreator = (value) => {
    const ref = useRef(value)

    if (ref.current !== value && !isEqual(ref.current, value)) {
        ref.current = value
    }

    return ref.current
}

export default useMemoCreator
