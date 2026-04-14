import { useMemo } from 'react'

const useAlertData = ({ alert, comparison }) => {
  return useMemo(() => ({
    alertData: alert ?? null,
    comparisonData: comparison ?? null,
  }), [alert, comparison])
}

export default useAlertData