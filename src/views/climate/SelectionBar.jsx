import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import HelpButton from '../../components/HelpButton'
import MultiSelect from '../../components/MultiSelect'
import SearchInput from '../../components/SearchInput'
import ToggleButton from '../../components/ToggleButton'
import { CLIMATE } from '../../constants/mapping.js'
import cacheUtils from '../../utils/newCache'
import style from './ClimateChart.module.scss'

const mapKeys = (array) => {
    return array.map(({ name, level, id }) => ({
        label: name,
        value: level,
        id: id,
    }))
}

const SelectionBar = ({ 
    themeColor, 
    onOrgUnitSelected,
    onClimateVarSelected,
    onShowModal,
    helpText,
    climateVariables
}) => {
    const [adminLevel, setAdminLevel] = useState()
    const [orgUnitOptions, setOrgUnitOptions] = useState()
    const [selected, setSelected] = useState([])
    const [showModal, setShowModal] = useState({
        showModal: false,
        title: 'Aides',
        content: ''
    })
    
    const groupByLevel = 4 // TODO: Dynamically set the orgUnit adminLevel based on the hierarchy level of the organization unit's parent

    const [selectors, setSelectors] = useState({
        adminLevel: undefined,
        orgUnit: undefined,
    })

    const adminLevels = useSelector((state) => state.orgUnit.orgUnitLevels)
    const parentDetails = useSelector((state) => state.orgUnit.parentDetails)
    // const orgUnitsState = useSelector((state) => state.orgUnit.orgUnits)

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
        setOrgUnitOptions(orgUnitList)
    }, [adminLevel])

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
        setAdminLevel(id)
        // const key = String(value)
        // setOrgUnitOptions(orgUnitsState[key])
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
            content: (
                <div dangerouslySetInnerHTML={{ __html: helpText }} />
            )
        }))
    }

    return (
        <div className={style.climateHeader}>
            <div className={style.multiSelectContainer}>
                <MultiSelect
                    options={climateVariables}
                    onSelect={(event) => setSelected(event)}
                    label='Variables climatique (choisir 2)'
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
                <HelpButton
                    bgColor={themeColor}
                    text={helpText}
                    onClick={handleHelpBtnClick}
                />
            </div>
        </div>
    )
}

export default SelectionBar
