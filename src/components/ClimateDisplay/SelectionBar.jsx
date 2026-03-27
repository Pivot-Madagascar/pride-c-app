import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import HelpButton from '@/components/HelpButton'
import MultiSelect from '@/components/MultiSelect'
import SearchInput from '@/components/SearchInput'
import ToggleButton from '@/components/ToggleButton'
import style from '@/components/ClimateDisplay/ClimateDisplay.module.scss'
import {
    showNotification,
    clearNotification,
} from '@/redux/notificationSlice'
import SearchIcon from '@mui/icons-material/Search'
import Modal from '@/components/Modal'
import MobileSelectionBar from '@/components/ClimateDisplay/MobileSelectionBar'

// Constants
const DEFAULT_LOCATION_NAME = 'Unite organisationnelle'

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
    const dispatch = useDispatch()

    const [adminLevel, setAdminLevel] = useState()
    const [orgUnitOptions, setOrgUnitOptions] = useState()
    const [selected, setSelected] = useState([])
    const [showSearch, setShowSearch] = useState(false)
    const [showModal, setShowModal] = useState({
        showModal: false,
        title: 'Aides',
        content: '',
    })
    const [locationName, setLocationName] = useState(DEFAULT_LOCATION_NAME)

    const [filterLvl, setFilterLvl] = useState()
    const [orgUnitList, setOrgUnitList] = useState()
    const [isSmallScreen, setIsSmallScreen] = useState(false)

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
        if (!selectors?.orgUnit) {
            const timeout = setTimeout(() => {
                if (selectors.adminLevel) {
                    dispatch(
                        showNotification({
                            message:
                                'Veuillez selectionner une unite organisationnelle',
                            type: 'info',
                            id: 'org-unit-warning',
                        })
                    )
                } else {
                    dispatch(clearNotification('org-unit-warning'))
                }
            }, 500)
            return () => clearTimeout(timeout)
        }
    }, [selectors.orgUnit, selectors.adminLevel, dispatch])

    useEffect(() => {
        onClimateVarSelected(selected)
    }, [selected])

    useEffect(() => {
        onShowModal(showModal)
    }, [showModal])

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 900)
        }

        window.addEventListener('resize', handleResize)
        handleResize()

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const handleAdminLvlSelect = ({ value, id }) => {
        setFilterLvl(value)
        setAdminLevel(id)
        setLocationName(DEFAULT_LOCATION_NAME)
        setOrgUnitOptions(undefined)
        setSelectors((prevSelectors) => ({
            ...prevSelectors,
            adminLevel: id,
            orgUnit: undefined,
        }))
    }

    const handleOrgUnitSearch = (value) => {
        if (value) {
            const { id, name } = value
            setLocationName(name)
            setSelectors((prevSelectors) => ({
                ...prevSelectors,
                orgUnit: id,
            }))
        } else {
            setLocationName(DEFAULT_LOCATION_NAME)
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

    const searchButtonStyle = {
        borderColor: 'var(--color-gray-light)',
        borderWidth: '1px',
        borderStyle: 'solid',
        // width: '300px',
    }

    const searchIconStyle = {
        marginRight: '1rem',
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
            {isSmallScreen ? (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        width: '100%',
                    }}
                >
                    <MobileSelectionBar
                        climateVariables={climateVariables}
                        adminLevelOptions={mapKeys(adminLevels)}
                        onClimateVarChange={(event) => setSelected(event)}
                        onAdminLevelChange={handleAdminLvlSelect}
                    />
                    <div
                        className={style.button}
                        style={{
                            ...searchButtonStyle,
                            width: '100%',
                        }}
                        onClick={() => setShowSearch(true)}
                        role="button"
                    >
                        <SearchIcon style={searchIconStyle} />
                        {locationName}
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                        <div
                            className={style.button}
                            style={{...searchButtonStyle, width: '300px'}}
                            onClick={() => setShowSearch(true)}
                            role="button"
                        >
                            <SearchIcon style={searchIconStyle} />
                            {locationName}
                        </div>
                    </div>
                </div>
            )}

            <Modal
                open={showSearch}
                onClose={() => setShowSearch(false)}
                title="Selectionnez une unite organisationnelle"
            >
                <SearchInput
                    borderColor={themeColor}
                    options={orgUnitOptions}
                    onSelect={handleOrgUnitSearch}
                    groupByLevel={groupByLevel}
                    width="350px"
                />
            </Modal>
        </div>
    )
}

export default SelectionBar
