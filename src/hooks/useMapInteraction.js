import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setSelectors } from '@/redux/tempSlice'

const useMapInteraction = () => {
  const dispatch = useDispatch()
  const [mapPeriodId, setMapPeriodId] = useState(0)

  const handleMapClick = useCallback(
    ({ orgUnitId }) => {
      dispatch(setSelectors({ orgUnit: orgUnitId }))
    },
    [dispatch]
  )

  return { mapPeriodId, setMapPeriodId, handleMapClick }
}

export default useMapInteraction