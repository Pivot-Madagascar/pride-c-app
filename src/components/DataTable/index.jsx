import {
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
    FileDownload as FileDownloadIcon,
    Search as SearchIcon,
    ViewColumn as ViewColumnIcon,
    EventAvailable as FilterIcon,
    PictureAsPdf as PdfIcon,
} from '@mui/icons-material'
import {
    IconButton,
    InputBase,
    Box,
    FormControlLabel,
    Switch,
    Typography,
    Button,
} from '@mui/material'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as XLSX from 'xlsx'
import COLORS from '../../constants/styles'
import { setPeriodOptions } from '../../redux/dataTableSlice'
import { exportToExcel, exportToPDF } from '../../utils/export'
import ExcelFile from '../Icons/Excel'
import PdfFile from '../Icons/Pdf'
import Modal from '../Modal'
import SearchInput from '../SearchInput'
import { columns } from './data'
import style from './dataTable.module.scss'
import ColumnFilter from './FilterCheckbox'

const lastThreeMonths = () => {
    const currentDate = new Date()
    const lastThreeMonths = []

    for (let i = 1; i < 4; i++) {
        const month = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + i,
            1
        )
        const yearMonth = month.toISOString().slice(0, 7).replace('-', '')
        lastThreeMonths.unshift(yearMonth)
    }

    return lastThreeMonths
}

const DataTable = ({ data, orgUnitColumns }) => {
    const dispatch = useDispatch()

    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState({ title: '', content: '' })
    const [activeAction, setActiveAction] = useState(null)
    const [columnVisibility, setColumnVisibility] = useState(
        columns.reduce((acc, col) => {
            acc[col.accessorKey] = col.visible
            return acc
        }, {})
    )
    const [activePeriods, setActivePeriods] = useState(lastThreeMonths)
    const [updatedOptions, setUpdatedOptions] = useState(undefined)

    const predictionPeriodOptions = useSelector(
        (state) => state.dataTable.periodOptions
    )

    const memoizedColumns = useMemo(() => {
        if (!orgUnitColumns) {
            return columns
                .map((col) => ({
                    ...col,
                    visible: columnVisibility[col.accessorKey],
                }))
                .filter((col) => col.header !== undefined) 
        }
        return columns
            .map((col, index) => ({
                ...col,
                header:
                    index < 2 && orgUnitColumns[index] !== null
                        ? orgUnitColumns[index]
                        : col.header,
                visible: columnVisibility[col.accessorKey],
            }))
            .filter((col) => col.header !== undefined) 
    }, [columnVisibility, orgUnitColumns])

    const filteredData = useMemo(() => {
        if (!data) {
            return []
        }
        return data
    }, [data])

    const handlePeriod = useCallback(
        (event) => {
            setActivePeriods(activePeriods)
            setUpdatedOptions(event)
            dispatch(setPeriodOptions(event))
        },
        [data, activePeriods, dispatch]
    )

    const handleColumnToggle = useCallback((columnKey) => {
        setColumnVisibility((prevState) => ({
            ...prevState,
            [columnKey]: !prevState[columnKey],
        }))
    }, [])

    const handleExports = () => {
        setActiveAction('exports')
        setShowModal(true)
    }


    const handleSearchChange = (event) => {
        if (event) {
            table.setGlobalFilter(event.displayName)
        } else {
            table.setGlobalFilter('')
        }
    }

    const updateModalContent = useCallback(() => {
        const content = (
            <Box
                sx={{
                    width: '100%',
                }}
            >
                {activeAction === 'columns' && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '60%',
                            margin: 'auto',
                        }}
                    >
                        {Object.keys(columnVisibility).map((key) => (
                            <FormControlLabel
                                key={key}
                                control={
                                    <Switch
                                        checked={columnVisibility[key]}
                                        onChange={() => handleColumnToggle(key)}
                                        disabled={
                                            !columns.find(
                                                (col) => col.accessorKey === key
                                            ).enableHideColumn
                                        }
                                    />
                                }
                                label={
                                    columns.find(
                                        (col) => col.accessorKey === key
                                    ).header
                                }
                            />
                        ))}
                    </Box>
                )}
                {activeAction === 'filters' && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <ColumnFilter
                            options={predictionPeriodOptions}
                            onSelect={handlePeriod}
                            parentLabel={'Selectionner tout'}
                            selectedValues={activePeriods}
                            updatedOptions={updatedOptions}
                        />
                    </Box>
                )}
                {activeAction === 'exports' && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            gap: 4,
                        }}
                    >
                        <IconButton
                            onClick={() => {
                                exportToPDF(
                                    table.getPrePaginationRowModel().rows,
                                    memoizedColumns
                                )
                                setShowModal(false)
                            }}
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                            }}
                        >
                            Format PDF
                        </IconButton>
                        <IconButton
                            onClick={() => {
                                exportToExcel(
                                    table.getPrePaginationRowModel().rows,
                                    memoizedColumns
                                )
                                setShowModal(false)
                            }}
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                            }}
                        >
                            Format Excel
                        </IconButton>
                    </Box>
                )}
                {activeAction === 'search' && (
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <SearchInput
                            options={[]}
                            onSelect={handleSearchChange}
                            width={'80%'}
                        />
                    </Box>
                )}
            </Box>
        )

        setModalData({
            title:
                activeAction === 'columns'
                    ? 'Afficher/masquer des colonnes'
                    : activeAction === 'exports'
                    ? 'Telécharger en fichier'
                    : activeAction === 'search'
                    ? 'Localisation'
                    : 'Definir le(s) période(s)',

            content,
        })
    }, [
        activeAction,
        columnVisibility,
        columns,
        handleColumnToggle,
        handlePeriod,
        activePeriods,
    ])

    useEffect(() => {
        if (showModal) {
            updateModalContent()
        }
    }, [showModal, updateModalContent])

    useEffect(() => {
        updateModalContent()
    }, [activeAction, updateModalContent])

    const table = useMaterialReactTable({
        columns: memoizedColumns.filter((col) => col.visible),
        data: filteredData,
        localization: {
            actions: 'Actions',
            cancel: 'Annuler',
            clearFilter: 'Reinitialiser le filtre',
            clearSearch: 'Reinitialiser la recherche',
            search: 'Rechercher',
            showColumns: 'Afficher les colonnes',
            showHideColumns: 'Afficher/masquer les colonnes',
            sortByColumnAsc: 'Trier par ordre croissant',
            sortByColumnDesc: 'Trier par ordre décroissant',
            noRecordsToDisplay: 'Information non disponible',
            rowsPerPage: 'Afficher',
            of: 'sur',
        },
        renderTopToolbarCustomActions: () => (
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {/* <IconButton
                        onClick={handleColumns}
                        sx={{ display: 'flex', gap: 1, marginRight: 3 }}
                    >
                        <ViewColumnIcon /> <Typography>Colonnes</Typography>
                    </IconButton> */}
                    {/* <IconButton
                        onClick={handleFilters}
                        sx={{ display: 'flex', gap: 1, marginRight: 3 }}
                    >
                        <FilterIcon /> <Typography>Periodes</Typography>
                    </IconButton> */}
                    <IconButton
                        onClick={handleExports}
                        sx={{ display: 'flex', gap: 1, marginRight: 3 }}
                    >
                        <FileDownloadIcon />{' '}
                        <Typography>Telecharger</Typography>
                    </IconButton>
                </div>
            </div>
        ),
        renderToolbarInternalActions: () => <></>,
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100vh - 280px)',
            },
        },
        globalFilterFn: 'contains',
        muiSearchTextFieldProps: {
            placeholder: 'Search all users',
            sx: { minWidth: '300px' },
            variant: 'outlined',
        },
    })

    return (
        <>
            <MaterialReactTable
                table={table}
                muiTableBodyCellProps={{
                    sx: {
                        fontSize: '0.875rem',
                        textTransform: 'capitalize',
                    },
                }}
            />
            <Modal
                open={showModal}
                handleClose={() => setShowModal(false)}
                title={modalData.title}
            >
                {modalData.content}
            </Modal>
        </>
    )
}

export default DataTable
