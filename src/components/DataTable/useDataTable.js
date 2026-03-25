import { useState, useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setPeriodOptions } from '../../redux/dataTableSlice.js'
import { getLastThreeMonths, replaceNulls } from './utils.js'

export const useDataTable = (data, orgUnitColumns, columnConfig) => {
    const dispatch = useDispatch()

    const initialVisibility = useMemo(() => {
        return columnConfig.reduce((acc, col) => {
            acc[col.accessorKey] = col.visible
            return acc
        }, {})
    }, [columnConfig])

    const [columnVisibility, setColumnVisibility] = useState(initialVisibility)
    const [activePeriods, setActivePeriods] = useState(getLastThreeMonths)
    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState({ title: '', content: '' })
    const [activeAction, setActiveAction] = useState(null)

    const memoizedColumns = useMemo(() => {
        if (!orgUnitColumns) {
            return columnConfig
                .map((col) => ({
                    ...col,
                    visible: columnVisibility[col.accessorKey],
                }))
                .filter((col) => col.header !== undefined) 
        }
        return columnConfig
            .map((col, index) => ({
                ...col,
                header:
                    index < 2 && orgUnitColumns[index] !== null
                        ? orgUnitColumns[index]
                        : col.header,
                visible: columnVisibility[col.accessorKey],
            }))
            .filter((col) => col.header !== undefined) 
    }, [columnVisibility, orgUnitColumns, columnConfig])

    const filteredData = useMemo(() => {
        if (!data) {
            return []
        }
        return replaceNulls(data)
    }, [data])

    const visibleColumns = useMemo(() => {
        return memoizedColumns.filter((col) => col.visible)
    }, [memoizedColumns])

    const handleColumnToggle = useCallback((columnKey) => {
        setColumnVisibility((prevState) => ({
            ...prevState,
            [columnKey]: !prevState[columnKey],
        }))
    }, [])

    const handlePeriod = useCallback(
        (event) => {
            setActivePeriods(activePeriods)
            dispatch(setPeriodOptions(event))
        },
        [activePeriods, dispatch]
    )

    const openModal = useCallback((action) => {
        setActiveAction(action)
        setShowModal(true)
    }, [])

    const closeModal = useCallback(() => {
        setShowModal(false)
    }, [])

    const updateModalContent = useCallback((title, content) => {
        setModalData({ title, content })
    }, [])

    return {
        columnVisibility,
        activePeriods,
        showModal,
        modalData,
        activeAction,
        memoizedColumns,
        visibleColumns,
        filteredData,
        setColumnVisibility,
        setActivePeriods,
        handleColumnToggle,
        handlePeriod,
        openModal,
        closeModal,
        updateModalContent,
    }
}

export default useDataTable
