import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { showNotification, clearNotification } from '../../redux/notificationSlice'
import { setSelectors } from '../../redux/tempSlice'
import SearchInput from '../SearchInput'
import ToggleButton from '../ToggleButton'
import style from './diseaseDashboard.module.scss'

const mapKeys = (array) => {
    return array.map(({ name, level, id }) => ({
        label: name,
        value: level,
        id: id,
    }))
}

const updateArrayWithDetails = (detailsArray, updateArray) => {
    const detailsMap = new Map(detailsArray.map((item) => [item.id, item]))
    return updateArray.map((item) => {
        const details = detailsMap.get(item.id)
        if (details) {
            return {
                ...item,
                ...details,
            }
        }
        return item
    })
}

const SelectionBar = ({ themeColor, sourceOptions }) => {
    const dispatch = useDispatch()

    const [adminLevel, setAdminLevel] = useState()
    const [orgUnitOptions, setOrgUnitOptions] = useState()
    const [filterLvl, setFilterLvl] = useState()
    const [orgUnitList, setOrgUnitList] = useState()

    const groupByLevel = 4 // TODO: Dynamically set the orgUnit adminLevel based on the hierarchy level of the organization unit's parent

    const adminLevels = useSelector((state) => state.orgUnit.orgUnitLevels)
    const parentDetails = useSelector((state) => state.orgUnit.parentDetails)
    const orgUnitsLevel5 = useSelector((state) => state.orgUnit.pridecOrgUnits)
    const storePath = useSelector((state) => state.temp.selectors)
    const orgUnits = useSelector((state) => state.orgUnit.orgUnits)

    useEffect(() => {
        if (parentDetails) {
            const { level } = parentDetails
            const { id } = adminLevels.find(({ level: lvl }) => lvl === level)
            setAdminLevel(id)
        }
    }, [parentDetails, adminLevels])

    useEffect(() => {
        if (orgUnits) {
            const payload = orgUnits[adminLevel]
            setOrgUnitList(payload)
        }
    }, [adminLevel, orgUnits])

    useEffect(() => {
        if (adminLevel && !storePath?.orgUnit) {
            const timeout = setTimeout(() => {
                if (adminLevel && !storePath?.orgUnit) {
                    dispatch(
                        showNotification({
                            message: 'Veuillez selectionner une unite organisationnelle',
                            type: 'info',
                            id: 'org-unit-warning'
                        })
                    )
                }
            }, 500)
            return () => clearTimeout(timeout)
        }
    }, [adminLevel, storePath.orgUnit, dispatch])

    useEffect(() => {
        if (storePath?.orgUnit) {
            dispatch(clearNotification('org-unit-warning'))
        }
    }, [storePath.orgUnit, dispatch])

    useEffect(() => {
        if (filterLvl === 5 && orgUnitsLevel5 && orgUnitList) {
            const result = updateArrayWithDetails(orgUnitList, orgUnitsLevel5)
            setOrgUnitOptions(result)
        } else {
            setOrgUnitOptions(orgUnitList)
        }
    }, [filterLvl, orgUnitsLevel5, orgUnitList])

    const handleSourceSelect = ({ value }) => {
        dispatch(setSelectors({ source: value }))
    }

    const handleOrgUnitSearch = (value) => {
        if (value) {
            const { id } = value
            dispatch(setSelectors({ orgUnit: id }))
        } else {
            dispatch(setSelectors({ orgUnit: undefined }))
        }
    }

    const handleAdminLvlSelect = ({ value, id }) => {
        setFilterLvl(value)
        setTimeout(() => {
            dispatch(setSelectors({ orgUnit: undefined }))
        }, 100)
        setAdminLevel(id)
        dispatch(setSelectors({ adminLevel: id }))
    }

    return (
        <div className={style.filterSection}>
            <ToggleButton
                options={sourceOptions}
                bgColor={themeColor}
                onSelect={handleSourceSelect}
            />
            <ToggleButton
                options={mapKeys(adminLevels)}
                bgColor={themeColor}
                onSelect={handleAdminLvlSelect}
            />
            <SearchInput
                borderColor={themeColor}
                options={orgUnitOptions}
                onSelect={handleOrgUnitSearch}
                groupByLevel={groupByLevel}
                width={'300px'}
                currentValue={storePath['orgUnit']}
            />
        </div>
    )
}

export default SelectionBar
