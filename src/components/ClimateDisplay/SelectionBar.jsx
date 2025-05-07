import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CLIMATE } from '../../constants/mapping.js'
import HelpButton from '../HelpButton'
import MultiSelect from '../MultiSelect'
import SearchInput from '../SearchInput'
import ToggleButton from '../ToggleButton'
import style from './ClimateDisplay.module.scss'

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
    onOrgUnitSelected,
    onClimateVarSelected,
    onShowModal,
    helpText,
    climateVariables,
}) => {
    const [adminLevel, setAdminLevel] = useState()
    const [orgUnitOptions, setOrgUnitOptions] = useState()
    const [selected, setSelected] = useState([])
    const [showModal, setShowModal] = useState({
        showModal: false,
        title: 'Aides',
        content: '',
    })

    const [filterLvl, setFilterLvl] = useState()
    const [orgUnitList, setOrgUnitList] = useState()

    const groupByLevel = 4 // TODO: Dynamically set the orgUnit adminLevel based on the hierarchy level of the organization unit's parent

    const [selectors, setSelectors] = useState({
        adminLevel: undefined,
        orgUnit: undefined,
    })

    const adminLevels = useSelector((state) => state.orgUnit.orgUnitLevels)
    const parentDetails = useSelector((state) => state.orgUnit.parentDetails)
    const orgUnitsLevel5 = useSelector((state) => state.orgUnit.pridecOrgUnits)
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
        if (filterLvl === 5 && orgUnitsLevel5 && orgUnitList) {
            const result = updateArrayWithDetails(orgUnitList, orgUnitsLevel5)
            setOrgUnitOptions(result)
        } else {
            setOrgUnitOptions(orgUnitList)
        }
    }, [filterLvl, orgUnitsLevel5, orgUnitList])

    useEffect(() => {
        onOrgUnitSelected(selectors)
    }, [selectors])

    useEffect(() => {
        onClimateVarSelected(selected)
    }, [selected])

    useEffect(() => {
        onShowModal(showModal)
    }, [showModal])

    const handleAdminLvlSelect = ({ value, id }) => {
        setFilterLvl(value)
        setAdminLevel(id)
        setSelectors((prevSelectors) => ({
            ...prevSelectors,
            adminLevel: id,
            orgUnit: undefined,
        }))
    }

    const handleOrgUnitSearch = (value) => {
        if (value) {
            const { id } = value
            setSelectors((prevSelectors) => ({
                ...prevSelectors,
                orgUnit: id,
            }))
        } else {
            setSelectors((prevSelectors) => ({
                ...prevSelectors,
                orgUnit: undefined,
            }))
        }
    }

    const handleHelpBtnClick = () => {
        setShowModal((prevState) => ({
            ...prevState,
            showModal: !prevState.showModal,
            content: <div dangerouslySetInnerHTML={{ __html: helpText }} />,
        }))
    }

    return (
        <div className={style.climateHeader}>
            <div style={{ position: 'absolute', right: 0, top: '-3.6rem' }}>
                <HelpButton
                    bgColor={themeColor}
                    text={helpText}
                    onClick={handleHelpBtnClick}
                />
            </div>
            <div className={style.multiSelectContainer}>
                <MultiSelect
                    options={climateVariables}
                    onSelect={(event) => setSelected(event)}
                    label="Variables climatique (choisir 2)"
                    maxSelectable={2}
                />
            </div>
            <div className={style.buttonsContainer}>
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
        </div>
    )
}

export default SelectionBar
