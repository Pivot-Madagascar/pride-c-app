import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
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

const SelectionBar = ({
    themeColor,
    sourceOptions,
    onSelect
}) => {
    const [adminLevel, setAdminLevel] = useState()
    const [orgUnitOptions, setOrgUnitOptions] = useState()
    
    const groupByLevel = 4 // TODO: Dynamically set the orgUnit adminLevel based on the hierarchy level of the organization unit's parent

    const [selectors, setSelectors] = useState({
        source: undefined,
        adminLevel: undefined,
        orgUnit: undefined,
    })

    const adminLevels = useSelector((state) => state.orgUnit.orgUnitLevels)
    const parentDetails = useSelector((state) => state.orgUnit.parentDetails)
    const orgUnitsState = useSelector((state) => state.orgUnit.orgUnits)

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
            useLocalStorage: true,
        })
        setOrgUnitOptions(orgUnitList)
    }, [adminLevel])

    useEffect(() => {
        onSelect(selectors)
    }, [selectors])

    const handleSourceSelect = ({ value }) => {
        setSelectors((prevSelectors) => ({
            ...prevSelectors,
            source: value,
        }))
    }

    const handleAdminLvlSelect = ({ value, id }) => {
        setAdminLevel(id)
        const key = String(value)
        setOrgUnitOptions(orgUnitsState[key])
        setSelectors((prevSelectors) => ({
            ...prevSelectors,
            adminLevel: id,
            orgUnit: undefined
        }))
    }

    const handleOrgUnitSearch = ({ id }) => {
        setSelectors((prevSelectors) => ({
            ...prevSelectors,
            orgUnit: id,
        }))
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
            />
        </div>
    )
}

export default SelectionBar
