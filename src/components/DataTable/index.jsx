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
} from '@mui/material'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import React, { useState, useMemo, useEffect } from 'react'
import COLORS from '../../constants/styles'
import Modal from '../Modal'
import style from './dataTable.module.scss'
import ColumnFilter from './FilterCheckbox'

const predictionPeriodOptions = [
    { label: 'July 2016', value: '201607' },
    { label: 'August 2016', value: '201608' },
    { label: 'September 2016', value: '201609' },
]

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
    const [activePeriods, setActivePeriods] = useState([
        '201607',
        '201608',
        '201609',
    ])
    const [filteredData, setFilteredData] = useState(data)

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

    const filterByPeriods = (targetPeriods) => {
        if (targetPeriods.length) {
            return data.filter((item) => targetPeriods.includes(item.period))
        } else {
            return []
        }
    }

    const filterShow = (array) => {
        return array.filter((item) => item.show).map((item) => item.value)
    }

    useEffect(() => {
        const newFilteredData = filterByPeriods(activePeriods)
        setFilteredData(newFilteredData)
    }, [activePeriods, data]) // Re-run when activePeriods or data changes

    const handlePeriod = (event) => {
        const periods = filterShow(event)
        setActivePeriods(periods)
    }

    const handleColumnToggle = (columnKey) => {
        setColumnVisibility((prevState) => ({
            ...prevState,
            [columnKey]: !prevState[columnKey],
        }))
    }

    const handleExportRows = (rows) => {
        const doc = new jsPDF()
        const tableData = rows.map((row) => [
            row.original.municipality,
            row.original.orgUnitName,
            row.original.periodName,
            row.original.min,
            row.original.mean,
            row.original.max,
        ])

        const tableHeaders = columns
            .filter((c) => c.visible)
            .map((c) => c.header)

        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
        })

        const currentDate = new Date()
        const year = currentDate.getFullYear()
        const month = String(currentDate.getMonth() + 1).padStart(2, '0')
        const day = String(currentDate.getDate()).padStart(2, '0')

        doc.save(`dataTable_${year}_${month}_${day}.pdf`)
    }

    const handleColumns = () => {
        setActiveAction('columns')
        updateModalContent()
        setShowModal(true)
    }

    const handleFilters = () => {
        setActiveAction('filters')
        updateModalContent()
        setShowModal(true)
    }

    const updateModalContent = () => {
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
                        />
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
    }

    useEffect(() => {
        if (showModal) {
            updateModalContent()
        }
    }, [columnVisibility])

    useEffect(() => {
        updateModalContent()
    }, [activeAction])

    const table = useMaterialReactTable({
        columns: columns.filter((col) => col.visible),
        data: filteredData,
        localization: {
            actions: 'Actions',
            cancel: 'Annuler',
            clearFilter: 'Reinitialiser le filtre',
            clearSearch: 'Reinitialiser la recherche',
            clearSort: 'Reinitialiser le tri',
            columnActions: 'Actions',
            edit: 'Éditer',
            filterByColumn: 'Filtrer par {column}',
            filterPlaceholder: 'Filtrer...',
            filter: 'Filtrer',
            hideColumn: 'Masquer la colonne',
            noRecordsToDisplay: 'Aucune données à afficher',
            reset: 'Réinitialiser',
            save: 'Sauvegarder',
            search: 'Rechercher',
            showHideColumns: 'Afficher/Masquer les colonnes',
            sortByColumnAsc: 'Trier par ordre croissant {column}',
            sortByColumnDesc: 'Trier par ordre décroissant {column}',
            toggleFullScreen: 'Plein écran',
        },
        initialState: {
            density: 'xs',
            expanded: false,
            pagination: { pageIndex: 0, pageSize: 15 },
            showColumnFilters: false,
        },
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    width: '300px',
                    display: 'flex',
                    flexDirection: 'row',
                    border: 1,
                    borderRadius: 2,
                    borderColor: COLORS.gray_stroke_light,
                    marginLeft: '10px',
                }}
            >
                <IconButton type="button" sx={{ p: '5px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
                <InputBase
                    placeholder="Rechercher..."
                    value={table.getState().globalFilter || ''}
                    onChange={(e) => table.setGlobalFilter(e.target.value)}
                    sx={{ height: '35px' }}
                />
            </Box>
        ),
        renderToolbarInternalActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    fontSize: 'small',
                    marginRight: '10px',
                }}
            >
                <Box
                    onClick={handleFilters}
                    sx={{
                        height: '35px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                    title={'Période(s)'}
                >
                    <FilterIcon />
                </Box>
                <Box
                    onClick={handleColumns}
                    sx={{
                        height: '35px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                    title={'Afficher/Masquer des colonnes'}
                >
                    <ViewColumnIcon />
                </Box>
                <Box
                    onClick={() =>
                        table.setIsFullScreen(!table.getState().isFullScreen)
                    }
                >
                    {table.getState().isFullScreen ? (
                        <Box
                            sx={{
                                height: '35px',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                            }}
                            title={'Quitter le mode plein écran'}
                        >
                            <FullscreenExitIcon />
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                height: '35px',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                            }}
                            title={'Mode plein écran'}
                        >
                            <FullscreenIcon />
                        </Box>
                    )}
                </Box>
                <Box
                    disabled={
                        table.getPrePaginationRowModel().rows.length === 0
                    }
                    onClick={() =>
                        handleExportRows(table.getPrePaginationRowModel().rows)
                    }
                    sx={{
                        height: '35px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                    title={'Exporter en PDF'}
                >
                    <FileDownloadIcon />
                </Box>
            </Box>
        ),
    })

    return (
        <Box sx={{ marginTop: '5rem' }}>
            <Typography variant="h4" sx={{ textAlign: 'start' }}>
                Prédictions et tendances
            </Typography>
            <MaterialReactTable table={table} />
            <Modal
                open={showModal}
                handleClose={() => setShowModal(false)}
                title={modalData.title}
            >
                <div style={{ width: '100%' }}>{modalData.content}</div>
            </Modal>
        </Box>
    )
}

export default DataTable
