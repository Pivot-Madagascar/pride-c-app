import { useMemo } from 'react'
import { useSelector } from 'react-redux'

const useMetaData = ({ storePath, sample }) => {
  const adminLevels = useSelector((state) => state.orgUnit.orgUnitLevels)

  return useMemo(() => {
    const foundMetric = sample.healthMetrics.find(({ value }) => value === storePath['source'])
    const source = foundMetric?.metaLabel ?? ''
    const disease = sample.title ?? ''
    const foundAdminLevel = adminLevels.find(({ id }) => id === storePath['adminLevel'])
    const adminLevel = foundAdminLevel?.name ?? ''
    return { source, disease, adminLevel }
  }, [storePath, adminLevels, sample])
}

export default useMetaData