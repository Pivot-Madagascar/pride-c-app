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
import { generateYearMonths } from '../../utils/format-time'
import ExcelFile from '../Icons/Excel'
import PdfFile from '../Icons/Pdf'
import Modal from '../Modal'
import style from './dataTable.module.scss'
import { exportToExcel, exportToPDF } from './export'
import ColumnFilter from './FilterCheckbox'

const lastThreeMonths = () => {
    const currentDate = new Date()
    const lastThreeMonths = []

    for (let i = 0; i < 3; i++) {
        const month = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - i,
            1
        )
        const yearMonth = month.toISOString().slice(0, 7).replace('-', '')
        lastThreeMonths.unshift(yearMonth)
    }

    return lastThreeMonths
}

const DataTable = ({ data }) => {
    const dispatch = useDispatch()

    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState({ title: '', content: '' })
    const [activeAction, setActiveAction] = useState(null)
    const [columnVisibility, setColumnVisibility] = useState({
        municipality: true,
        orgUnitName: true,
        periodName: true,
        min: true,
        mean: true,
        max: true,
    })
    const [activePeriods, setActivePeriods] = useState(lastThreeMonths)
    const [filteredData, setFilteredData] = useState(data)
    const [updatedOptions, setUpdatedOptions] = useState(undefined)

    const [searchQuery, setSearchQuery] = useState('')

    const predictionPeriodOptions = useSelector((state) => state.dataTable.periodOptions)

    const columns = useMemo(
        () => [
            {
                accessorKey: 'municipality',
                header: 'Commune',
                size: 150,
                visible: columnVisibility.municipality,
                enableColumnActions: false,
                enableHideColumn: true,
            },
            {
                accessorKey: 'orgUnitName',
                header: 'Fokontany',
                size: 150,
                visible: columnVisibility.orgUnitName,
                enableColumnActions: false,
                enableHideColumn: false,
            },
            {
                accessorKey: 'periodName',
                header: 'Mois',
                size: 150,
                visible: columnVisibility.periodName,
                enableColumnActions: false,
                enableHideColumn: false,
                enableGlobalFilter: false
            },
            {
                accessorKey: 'min',
                header: 'Estimation min.',
                size: 100,
                visible: columnVisibility.min,
                enableColumnActions: false,
                enableHideColumn: true,
                enableGlobalFilter: false
            },
            {
                accessorKey: 'mean',
                header: 'Estimation moyenne',
                size: 100,
                visible: columnVisibility.mean,
                enableColumnActions: false,
                enableHideColumn: true,
                enableGlobalFilter: false
            },
            {
                accessorKey: 'max',
                header: 'Estimation max.',
                size: 100,
                visible: columnVisibility.max,
                enableColumnActions: false,
                enableHideColumn: true,
                enableGlobalFilter: false
            },
        ],
        [columnVisibility]
    )

    const handlePeriod = useCallback(
        (event) => {
            const periods = filterShow(event)
            const newData = data.filter((item) => periods.includes(item.period))
            setFilteredData(newData)
            setActivePeriods(activePeriods)
            setUpdatedOptions(event)
            dispatch(setPeriodOptions(event))
        },
        [data, activePeriods, dispatch]
    )

    const filterShow = (array) => {
        return array.filter((item) => item.show).map((item) => item.value)
    }

    const handleColumnToggle = useCallback((columnKey) => {
        setColumnVisibility((prevState) => ({
            ...prevState,
            [columnKey]: !prevState[columnKey],
        }))
    }, [])

    const handleColumns = () => {
        setActiveAction('columns')
        setShowModal(true)
    }

    const handleFilters = () => {
        setActiveAction('filters')
        setShowModal(true)
    }

    const handleExports = () => {
        setActiveAction('exports')
        setShowModal(true)
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value)
        table.setGlobalFilter(event.target.value)
    }

    const updateModalContent = useCallback(() => {
        const content = (
            <Box>
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
                            justifyContent: 'center',
                            gap: 4,
                        }}
                    >
                        <IconButton
                            onClick={() =>
                                exportToPDF(
                                    table.getPrePaginationRowModel().rows,
                                    columns
                                )
                            }
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                            }}
                        >
                            <PdfFile height={40} width={40} /> Format PDF
                        </IconButton>
                        <IconButton
                            onClick={() =>
                                exportToExcel(
                                    table.getPrePaginationRowModel().rows,
                                    columns
                                )
                            }
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                            }}
                        >
                            <ExcelFile height={40} width={40} /> Format Excel
                        </IconButton>
                    </Box>
                )}
            </Box>
        )

        setModalData({
            title:
                activeAction === 'columns'
                    ? 'Afficher/masquer des colonnes'
                    : activeAction === 'exports'
                    ? 'Telecharger un fichier'
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
        columns: columns.filter((col) => col.visible),
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
        },
        renderTopToolbarCustomActions: () => (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <IconButton onClick={handleColumns}>
                        <ViewColumnIcon />
                    </IconButton>
                    <IconButton onClick={handleFilters}>
                        <FilterIcon />
                    </IconButton>
                    <IconButton onClick={handleExports}>
                        <FileDownloadIcon />
                    </IconButton>
                    <InputBase
                        placeholder="Rechercher"
                        value={searchQuery}
                        onChange={handleSearchChange} 
                        startAdornment={<SearchIcon sx={{ marginRight: '0.5rem' }} />}
                        sx={{ background: '#f1f3f4', padding: '0rem 1rem', borderRadius: '4px' }}
                    />
                </div>
            </div>
        ),
        renderToolbarInternalActions: () => (
            <>
            </>
        ),
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
