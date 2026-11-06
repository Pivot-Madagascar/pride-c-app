import { useMemo } from 'react'
import { useSelector } from 'react-redux'

const useMetaData = ({ storePath, sample }) => {
  const adminLevels = useSelector((state) => state.orgUnit.orgUnitLevels)

  // Only source / adminLevel are used: changing the org unit keeps the same object
  const { source: sourceId, adminLevel: adminLevelId } = storePath || {}

  return useMemo(() => {
    const foundMetric = sample.healthMetrics.find(({ value }) => value === sourceId)
    const source = foundMetric?.metaLabel ?? ''
    const disease = sample.title ?? ''
    const foundAdminLevel = adminLevels.find(({ id }) => id === adminLevelId)
    const adminLevel = foundAdminLevel?.name ?? ''
    return { source, disease, adminLevel }
  }, [sourceId, adminLevelId, adminLevels, sample])
}

export default useMetaData