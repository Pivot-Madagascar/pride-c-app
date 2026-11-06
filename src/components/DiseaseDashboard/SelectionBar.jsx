import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    showNotification,
    clearNotification,
} from '@/redux/notificationSlice'
import { setSelectors } from '@/redux/tempSlice'
import SearchInput from '@/components/SearchInput'
import ToggleButton from '@/components/ToggleButton'
import style from './diseaseDashboard.module.scss'
import Modal from '@/components/Modal'
import SearchIcon from '@mui/icons-material/Search'
import MobileSelectionBar from '@/components/DiseaseDashboard/MobileSelectionBar'

// Constants
const DEFAULT_LOCATION_NAME = 'Unite organisationnelle'
const NOTIFICATION_DELAY = 500
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

// Mirrors the options logic: when a level has a single org unit (and the
// level-5 PRIDE-C list is not used), that unit is selected automatically.
const getOrgUnitOptions = (filterLvl, orgUnitList, orgUnitsLevel5) =>
    filterLvl === 5 && orgUnitsLevel5 && orgUnitList?.length
        ? updateArrayWithDetails(orgUnitList, orgUnitsLevel5)
        : orgUnitList || []

const getAutoSelectedOrgUnit = (filterLvl, orgUnitList, orgUnitsLevel5) => {
    const usesLevel5List = filterLvl === 5 && orgUnitsLevel5 && orgUnitList?.length
    return !usesLevel5List && orgUnitList?.length === 1 ? orgUnitList[0] : undefined
}

const SelectionBar = ({ themeColor, sourceOptions }) => {
    const dispatch = useDispatch()

    // Local state
    const [adminLevel, setAdminLevel] = useState()
    const [filterLvl, setFilterLvl] = useState()
    const [showModal, setShowModal] = useState(false)
    const [isSmallScreen, setIsSmallScreen] = useState(false)

    // Redux selectors with memoization
    const adminLevels = useSelector((state) => state.orgUnit.orgUnitLevels)
    const parentDetails = useSelector((state) => state.orgUnit.parentDetails)
    const orgUnitsLevel5 = useSelector((state) => state.orgUnit.pridecOrgUnits)
    // Only the selected org unit is read here (primitive: no re-render when
    // other selectors change)
    const selectedOrgUnitId = useSelector((state) => state.temp.selectors?.orgUnit)
    // Latest selection, read by the auto-select effect without making it
    // re-run when the user changes or clears the selection
    const selectedOrgUnitIdRef = useRef(selectedOrgUnitId)
    selectedOrgUnitIdRef.current = selectedOrgUnitId
    const orgUnits = useSelector((state) => state.orgUnit.orgUnits)

    // Memoized values (derived during render instead of state + effects:
    // avoids extra render passes on each level change)
    const mappedAdminLevels = useMemo(() => mapKeys(adminLevels), [adminLevels])

    const orgUnitList = useMemo(
        () => (adminLevel && orgUnits ? orgUnits[adminLevel] || [] : []),
        [adminLevel, orgUnits]
    )

    const orgUnitOptions = useMemo(
        () => getOrgUnitOptions(filterLvl, orgUnitList, orgUnitsLevel5),
        [filterLvl, orgUnitList, orgUnitsLevel5]
    )

    const locationName = useMemo(() => {
        if (!selectedOrgUnitId) {
            return DEFAULT_LOCATION_NAME
        }
        const foundUnit = orgUnitOptions.find(({ id }) => id === selectedOrgUnitId)
        return foundUnit?.name || DEFAULT_LOCATION_NAME
    }, [selectedOrgUnitId, orgUnitOptions])

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

            // Single dispatch: new level + org unit (the only unit of the
            // level when there is just one, otherwise cleared)
            const autoSelected = getAutoSelectedOrgUnit(
                value,
                orgUnits?.[id],
                orgUnitsLevel5
            )
            dispatch(setSelectors({ adminLevel: id, orgUnit: autoSelected?.id }))
        },
        [dispatch, orgUnits, orgUnitsLevel5]
    )

    const handleModalClose = useCallback(() => {
        setShowModal(false)
    }, [])

    const handleModalOpen = useCallback(() => {
        setShowModal(true)
    }, [])

    // Effect for setting admin level from parent details
    useEffect(() => {
        if (!parentDetails || !adminLevels?.length) return

        const { level } = parentDetails
        const adminLevel = adminLevels.find(({ level: lvl }) => lvl === level)
        if (adminLevel) {
            setAdminLevel(adminLevel.id)
        }
    }, [parentDetails, adminLevels])

    // Effect for showing notification when no org unit is selected
    useEffect(() => {
        if (!adminLevel || selectedOrgUnitId) return

        const timeoutId = setTimeout(() => {
            if (adminLevel && !selectedOrgUnitId) {
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
    }, [adminLevel, selectedOrgUnitId, dispatch])

    // Effect for clearing notification when org unit is selected
    useEffect(() => {
        if (selectedOrgUnitId) {
            dispatch(clearNotification('org-unit-warning'))
        }
    }, [selectedOrgUnitId, dispatch])

    // Auto-select the only org unit of the level when the list changes
    // (e.g. org units loaded after the level was chosen). Dispatches only
    // when the selection actually differs.
    useEffect(() => {
        const autoSelected = getAutoSelectedOrgUnit(
            filterLvl,
            orgUnitList,
            orgUnitsLevel5
        )
        if (autoSelected && autoSelected.id !== selectedOrgUnitIdRef.current) {
            dispatch(setSelectors({ orgUnit: autoSelected.id }))
        }
    }, [filterLvl, orgUnitList, orgUnitsLevel5, dispatch])

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
                    currentValue={selectedOrgUnitId}
                />
            </Modal>
        </>
    )
}

export default React.memo(SelectionBar)
