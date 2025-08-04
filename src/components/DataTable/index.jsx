import FilterIcon from '@mui/icons-material/EventAvailable'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import PdfIcon from '@mui/icons-material/PictureAsPdf'
import SearchIcon from '@mui/icons-material/Search'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import domtoimage from 'dom-to-image-more'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import COLORS from '../../constants/styles'
import { setPeriodOptions } from '../../redux/dataTableSlice'
import { exportToExcel, exportToPDF } from '../../utils/export'
import ExcelFile from '../Icons/Excel'
import PdfFile from '../Icons/Pdf'
import Logo from '../Logo'
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

const replaceNulls = (data) => {
    return data.map(item => ({
        ...item,
        lowci: item.lowci === null || Number.isNaN(item.lowci) || item.lowci === undefined ? 0 : item.lowci,
        avg: item.avg === null || Number.isNaN(item.avg) || item.avg === undefined ? 0 : item.avg,
        uppci: item.uppci === null || Number.isNaN(item.uppci) || item.uppci === undefined ? 0 : item.uppci
    }));
}

const DataTable = ({ data, orgUnitColumns }) => {
    const dispatch = useDispatch()
    const logoRef = useRef()

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
        const cleanedData = replaceNulls(data)
        return cleanedData
    }, [data])

    const handlePeriod = useCallback(
        (event) => {
            setActivePeriods(activePeriods)
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

    const handlePdfExport = async() => {
        try {
            const logoBase64 = await domtoimage.toPng(logoRef.current, { cacheBust: true })
            exportToPDF({ 
                rows: table.getPrePaginationRowModel().rows, 
                columns: memoizedColumns, 
                logoBase64 
            })
        } catch (error) {
            console.error('Error exporting PDF:', error)
            exportToPDF({
                rows: table.getPrePaginationRowModel().rows,
                columns: memoizedColumns,
            })
        }
    }

    const updateModalContent = useCallback(() => {
        const content = (
            <Box
                sx={{
                    width: '100%',
                }}
            >
                <div
                    ref={logoRef}
                    style={{
                        position: 'absolute',
                        top: '-9999px',
                        left: '-9999px',
                        width: '1000px',
                        height: '1000px',
                        background: 'white',
                    }}
                >
                    <Logo />
                </div>
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
                                handlePdfExport()
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
                                    {
                                        rows: table.getPrePaginationRowModel().rows,
                                        columns: memoizedColumns
                                    }
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
                onClose={() => setShowModal(false)}
                title={modalData.title}
            >
                {modalData.content}
            </Modal>
        </>
    )
}

export default DataTable
