import {
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
    FileDownload as FileDownloadIcon,
    Search as SearchIcon,
    ViewColumn as ViewColumnIcon,
    EventAvailable as FilterIcon,
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
import * as XLSX from 'xlsx'
import COLORS from '../../constants/styles'
import { generateYearMonths } from '../../utils/format-time'
import Modal from '../Modal'
import style from './dataTable.module.scss'
import { exportToExcel, exportToPDF } from './export'
import ColumnFilter from './FilterCheckbox'

const predictionPeriodOptions = [
    { label: 'July 2016', value: '201607' },
    { label: 'August 2016', value: '201608' },
    { label: 'September 2016', value: '201609' },
]

const getLastThreeMonths = () => {
    const months = [];
    const date = new Date();
    
    for (let i = 0; i < 3; i++) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        months.unshift(`${year}${month}`);
        date.setMonth(date.getMonth() - 1);
    }
    
    return months;
}

const currentDate = new Date()
const currentYear = currentDate.getFullYear()

const years = [currentYear, currentYear - 1, currentYear - 2]

const DataTable = ({ data }) => {
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
    const [activePeriods, setActivePeriods] = useState(getLastThreeMonths)

    const periods = useMemo(
        () => years.reduce((acc, year) => {
            acc[year] = generateYearMonths(year)
            return acc
        }, {}),
        [years]
    )

    const filteredData = useMemo(() => {
        return activePeriods.length
            ? data.filter((item) => activePeriods.includes(item.period))
            : []
    }, [activePeriods, data])

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
            },
            {
                accessorKey: 'min',
                header: 'Estimation min.',
                size: 100,
                visible: columnVisibility.min,
                enableColumnActions: false,
                enableHideColumn: true,
            },
            {
                accessorKey: 'mean',
                header: 'Estimation moyenne',
                size: 100,
                visible: columnVisibility.mean,
                enableColumnActions: false,
                enableHideColumn: true,
            },
            {
                accessorKey: 'max',
                header: 'Estimation max.',
                size: 100,
                visible: columnVisibility.max,
                enableColumnActions: false,
                enableHideColumn: true,
            },
        ],
        [columnVisibility]
    )

    const handlePeriod = useCallback((event) => {
        const periods = filterShow(event)
        setActivePeriods(periods)
    }, [])

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
                                                (col) =>
                                                    col.accessorKey === key
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
                        />
                    </Box>
                )}
                {activeAction === 'exports' && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: 2,
                        }}
                    >
                        <Button
                            onClick={() => exportToPDF(table.getPrePaginationRowModel().rows, columns)}
                        >
                            Télécharger en PDF
                        </Button>
                        <Button
                            onClick={() => exportToExcel(table.getPrePaginationRowModel().rows, columns)}
                        >
                            Télécharger en Excel
                        </Button>
                    </Box>
                )}
            </Box>
        )

        setModalData({
            title:
                activeAction === 'columns'
                    ? 'Afficher/masquer des colonnes'
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
            <>
                <IconButton onClick={handleColumns}>
                    <ViewColumnIcon />
                </IconButton>
                <IconButton onClick={handleFilters}>
                    <FilterIcon />
                </IconButton>
                <IconButton onClick={handleExports}>
                    <FileDownloadIcon />
                </IconButton>
            </>
        ),
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100vh - 280px)',
            },
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
                onClose={() => setShowModal(false)}
                title={modalData.title}
            >
                {modalData.content}
            </Modal>
        </>
    )
}

export default DataTable
