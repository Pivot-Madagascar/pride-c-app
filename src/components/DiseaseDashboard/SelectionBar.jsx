import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    showNotification,
    clearNotification,
} from '@/redux/notificationSlice'
import { setSelectors } from '@/redux/tempSlice'
import SearchInput from '@/components/SearchInput'
import ToggleButton from '@/components/ToggleButton'
import style from '@/components/DiseaseDashboard/diseaseDashboard.module.scss'
import Modal from '@/components/Modal'
import SearchIcon from '@mui/icons-material/Search'
import MobileSelectionBar from '@/components/DiseaseDashboard/MobileSelectionBar'

// Constants
const DEFAULT_LOCATION_NAME = 'Unite organisationnelle'
const NOTIFICATION_DELAY = 500
const SELECTOR_UPDATE_DELAY = 100
const DEFAULT_GROUP_BY_LEVEL = 4

// Utility functions moved outside component to prevent recreation
const mapKeys = (array) => {
    return (
        array?.map(({ name, level, id }) => ({
            label: name,
            value: level,
            id: id,
        })) || []
    )
}

const updateArrayWithDetails = (detailsArray, updateArray) => {
    if (!detailsArray || !updateArray) return updateArray || []

    const detailsMap = new Map(detailsArray.map((item) => [item.id, item]))
    return updateArray.map((item) => {
        const details = detailsMap.get(item.id)
        return details ? { ...item, ...details } : item
    })
}

const SelectionBar = ({ themeColor, sourceOptions }) => {
    const dispatch = useDispatch()

    // Local state
    const [adminLevel, setAdminLevel] = useState()
    const [orgUnitOptions, setOrgUnitOptions] = useState([])
    const [filterLvl, setFilterLvl] = useState()
    const [orgUnitList, setOrgUnitList] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [locationName, setLocationName] = useState(DEFAULT_LOCATION_NAME)
    const [isSmallScreen, setIsSmallScreen] = useState(false)

    // Redux selectors with memoization
    const adminLevels = useSelector((state) => state.orgUnit.orgUnitLevels)
    const parentDetails = useSelector((state) => state.orgUnit.parentDetails)
    const orgUnitsLevel5 = useSelector((state) => state.orgUnit.pridecOrgUnits)
    const storePath = useSelector((state) => state.temp.selectors)
    const orgUnits = useSelector((state) => state.orgUnit.orgUnits)

    // Memoized values
    const mappedAdminLevels = useMemo(() => mapKeys(adminLevels), [adminLevels])

    // Callback handlers
    const handleSourceSelect = useCallback(
        ({ value }) => {
            dispatch(setSelectors({ source: value }))
        },
        [dispatch]
    )

    const handleOrgUnitSearch = useCallback(
        (value) => {
            const orgUnitId = value?.id
            dispatch(setSelectors({ orgUnit: orgUnitId }))
        },
        [dispatch]
    )

    const handleAdminLvlSelect = useCallback(
        ({ value, id }) => {
            setFilterLvl(value)
            setAdminLevel(id)

            // Clear orgUnit selection after a brief delay to allow state update
            setTimeout(() => {
                dispatch(setSelectors({ orgUnit: undefined, adminLevel: id }))
            }, SELECTOR_UPDATE_DELAY)
        },
        [dispatch]
    )

    const handleModalClose = useCallback(() => {
        setShowModal(false)
    }, [])

    const handleModalOpen = useCallback(() => {
        setShowModal(true)
    }, [])

    // Effect for updating location name
    useEffect(() => {
        const selectedOrgUnit = storePath?.orgUnit
        if (!selectedOrgUnit) {
            setLocationName(DEFAULT_LOCATION_NAME)
            return
        }

        const foundUnit = orgUnitOptions?.find(
            ({ id }) => id === selectedOrgUnit
        )
        setLocationName(foundUnit?.name || DEFAULT_LOCATION_NAME)
    }, [storePath?.orgUnit, orgUnitOptions])

    // Effect for setting admin level from parent details
    useEffect(() => {
        if (!parentDetails || !adminLevels?.length) return

        const { level } = parentDetails
        const adminLevel = adminLevels.find(({ level: lvl }) => lvl === level)
        if (adminLevel) {
            setAdminLevel(adminLevel.id)
        }
    }, [parentDetails, adminLevels])

    // Effect for updating org unit list
    useEffect(() => {
        if (orgUnits && adminLevel) {
            setOrgUnitList(orgUnits[adminLevel] || [])
        }
    }, [adminLevel, orgUnits])

    // Effect for showing notification when no org unit is selected
    useEffect(() => {
        if (!adminLevel || storePath?.orgUnit) return

        const timeoutId = setTimeout(() => {
            if (adminLevel && !storePath?.orgUnit) {
                dispatch(
                    showNotification({
                        message:
                            'Veuillez selectionner une unite organisationnelle',
                        type: 'info',
                        id: 'org-unit-warning',
                    })
                )
            }
        }, NOTIFICATION_DELAY)

        return () => clearTimeout(timeoutId)
    }, [adminLevel, storePath?.orgUnit, dispatch])

    // Effect for clearing notification when org unit is selected
    useEffect(() => {
        if (storePath?.orgUnit) {
            dispatch(clearNotification('org-unit-warning'))
        }
    }, [storePath?.orgUnit, dispatch])

    // Effect for updating org unit options based on filter level
    useEffect(() => {
        if (filterLvl === 5 && orgUnitsLevel5 && orgUnitList?.length) {
            const result = updateArrayWithDetails(orgUnitList, orgUnitsLevel5)
            setOrgUnitOptions(result)
        } else {
            setOrgUnitOptions(orgUnitList || [])
            if (orgUnitList?.length === 1) {
                const singleUnit = orgUnitList[0]
                dispatch(setSelectors({ orgUnit: singleUnit.id }))
                setLocationName(singleUnit.name)
            }
        }
    }, [filterLvl, orgUnitsLevel5, orgUnitList])

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

    // Inline styles moved to object for better performance
    const searchButtonStyle = {
        borderColor: 'var(--color-gray-stroke-light)',
        borderWidth: '1px',
        borderStyle: 'solid',
        width: isSmallScreen ? '100%' : '300px',
        Height: '49px'
    }

    const searchIconStyle = {
        marginRight: '1rem',
    }

    return (
        <>
            {isSmallScreen ? (
                <div
                    style={{
                        width: 'calc(100% - 1rem)',
                        display: 'flex',
                        gap: '1rem',
                        flexDirection: 'column',
                        backgroundColor: 'var(--color-white)',
                        paddingBottom: '0.5rem'
                    }}
                >
                    <MobileSelectionBar
                        sourceOptions={sourceOptions}
                        adminLevelOptions={mappedAdminLevels}
                        onSourceChange={(event) => handleSourceSelect(event)}
                        onAdminLevelChange={(event) =>
                            handleAdminLvlSelect(event)
                        }
                    />
                    <div
                        className={style.button}
                        style={searchButtonStyle}
                        onClick={handleModalOpen}
                        role="button"
                    >
                        <SearchIcon style={searchIconStyle} />
                        {locationName}
                    </div>
                </div>
            ) : (
                <div className={style.filterSection}>
                    <ToggleButton
                        options={sourceOptions}
                        bgColor={themeColor}
                        onSelect={handleSourceSelect}
                    />
                    <ToggleButton
                        options={mappedAdminLevels}
                        bgColor={themeColor}
                        onSelect={handleAdminLvlSelect}
                    />
                    <div
                        className={style.button}
                        style={searchButtonStyle}
                        onClick={handleModalOpen}
                        role="button"
                    >
                        <SearchIcon style={searchIconStyle} />
                        {locationName}
                    </div>
                </div>
            )}

            <Modal
                open={showModal}
                onClose={handleModalClose}
                title="Selectionnes une unite organisationnelle"
            >
                <SearchInput
                    borderColor={themeColor}
                    options={orgUnitOptions}
                    onSelect={handleOrgUnitSearch}
                    groupByLevel={DEFAULT_GROUP_BY_LEVEL}
                    width="350px"
                    currentValue={storePath?.orgUnit}
                />
            </Modal>
        </>
    )
}

export default SelectionBar
