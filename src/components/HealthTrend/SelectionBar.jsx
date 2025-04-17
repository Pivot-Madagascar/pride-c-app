import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cacheUtils from '../../utils/newCache'
import SearchInput from '../SearchInput'
import ToggleButton from '../ToggleButton'
import style from './healthTrend.module.scss'

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

const SelectionBar = ({ 
    themeColor, 
    sourceOptions, 
    onSelect, 
    selectedOrgUnit,
    orgUnitAction
}) => {
    const dispatch = useDispatch()

    const [adminLevel, setAdminLevel] = useState()
    const [orgUnitOptions, setOrgUnitOptions] = useState()
    const [filterLvl, setFilterLvl] = useState()
    const [orgUnitList, setOrgUnitList] = useState()

    const groupByLevel = 4 // TODO: Dynamically set the orgUnit adminLevel based on the hierarchy level of the organization unit's parent

    const [selectors, setSelectors] = useState({
        source: undefined,
        adminLevel: undefined,
        orgUnit: undefined,
    })

    const adminLevels = useSelector((state) => state.orgUnit.orgUnitLevels)
    const parentDetails = useSelector((state) => state.orgUnit.parentDetails)
    const orgUnitsLevel5 = useSelector((state) => state.orgUnit.pridecOrgUnits)

    useEffect(() => {
        if (parentDetails) {
            const { level } = parentDetails
            const { id } = adminLevels.find(({ level: lvl }) => lvl === level)
            setAdminLevel(id)
        }
    }, [parentDetails, adminLevels])

    useEffect(() => {
        const orgUnitList = cacheUtils.get({
            path: ['orgUnits', 'details', adminLevel],
            useSessionStorage: true,
        })
        setOrgUnitList(orgUnitList)
    }, [adminLevel])

    useEffect(() => {
        onSelect(selectors)
    }, [selectors])

    useEffect(() => {
        if (filterLvl === 5 && orgUnitsLevel5 && orgUnitList) {
            const result = updateArrayWithDetails(orgUnitList, orgUnitsLevel5)
            setOrgUnitOptions(result)
        } else {
            setOrgUnitOptions(orgUnitList)
        }
    }, [filterLvl, orgUnitsLevel5, orgUnitList])

    const handleSourceSelect = ({ value }) => {
        setSelectors((prevSelectors) => ({
            ...prevSelectors,
            source: value,
        }))
    }

    const handleAdminLvlSelect = ({ value, id }) => {
        setFilterLvl(value)
        setAdminLevel(id)
        dispatch(orgUnitAction(undefined))
        setSelectors((prevSelectors) => ({
            ...prevSelectors,
            adminLevel: id,
            orgUnit: undefined,
        }))
    }

    const handleOrgUnitSearch = (value) => {
        if (value) {
            const { id } = value
            dispatch(orgUnitAction(id))
            setSelectors((prevSelectors) => ({
                ...prevSelectors,
                orgUnit: id,
            }))
        } else {
            dispatch(orgUnitAction(undefined))
            setSelectors((prevSelectors) => ({
                ...prevSelectors,
                orgUnit: undefined,
            }))
        }
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
                currentValue={selectedOrgUnit}
            />
        </div>
    )
}

export default SelectionBar
