import FileDownloadIcon from '@mui/icons-material/FileDownload'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { exportToExcel, exportToPDF } from '@/utils/exportutils/exportutils.js'
import { showNotification, clearNotification } from '@/redux/notificationSlice'
import logoImage from '@/assets/img/logo/pride-c-logo.png'
import Modal from '@/components/Modal/index.jsx'
import { TABLE_LOCALIZATION, MODAL_TITLES } from '@/components/DataTable/constants'
import { columns } from '@/components/DataTable/data.js'
import { useDataTable } from '@/components/DataTable/useDataTable.js'

const DataTable = ({ data, orgUnitColumns, onExcelExport, onPdfExport, metaData, themeColor }) => {
    const dispatch = useDispatch()
    
    const {
        showModal,
        modalData,
        activeAction,
        memoizedColumns,
        filteredData,
        openModal,
        closeModal,
        updateModalContent,
    } = useDataTable(data, orgUnitColumns, columns)

    // Table configuration
    const table = useMaterialReactTable({
        columns: memoizedColumns.filter((col) => col.visible),
        data: filteredData,
        localization: TABLE_LOCALIZATION,
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
                        onClick={() => openModal('exports')}
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

    // Handle PDF export with logo
    const handlePdfExport = useCallback(async () => {
        try {
            let logoBase64 = null
            try {
                const response = await fetch(logoImage)
                const blob = await response.blob()
                logoBase64 = await new Promise((resolve) => {
                    const reader = new FileReader()
                    reader.onloadend = () => resolve(reader.result.split(',')[1])
                    reader.readAsDataURL(blob)
                })
            } catch (logoError) {
                console.warn('Could not load logo, proceeding without it:', logoError)
            }
            
            const result = await exportToPDF({ 
                rows: table.getPrePaginationRowModel().rows, 
                columns: memoizedColumns, 
                logoBase64,
                disease: metaData.disease,
                dataSources: metaData.source,
                orgUnitLevel: metaData.adminLevel
            })
            
            if (result.success) {
                dispatch(showNotification({
                    message: 'PDF exporté avec succès',
                    type: 'success',
                    id: 'pdf-export-success'
                }))
            } else {
                dispatch(showNotification({
                    message: `Échec de l'export PDF: ${result.error}`,
                    type: 'error',
                    id: 'pdf-export-error'
                }))
            }
        } catch (error) {
            console.error('Error exporting PDF:', error)
            dispatch(showNotification({
                message: `Échec de l'export PDF: ${error.message}`,
                type: 'error',
                id: 'pdf-export-error'
            }))
        }
    }, [table, memoizedColumns])

    // Handle Excel export
    const handleExcelExport = useCallback(async () => {
        try {
            let logoBase64 = null
            try {
                const response = await fetch(logoImage)
                const blob = await response.blob()
                logoBase64 = await new Promise((resolve) => {
                    const reader = new FileReader()
                    reader.onloadend = () => resolve(reader.result.split(',')[1])
                    reader.readAsDataURL(blob)
                })
            } catch (logoError) {
                console.warn('Could not load logo, proceeding without it:', logoError)
            }

            const result = await exportToExcel({
                rows: table.getPrePaginationRowModel().rows,
                columns: memoizedColumns,
                logoBase64,
                disease: metaData.disease,
                dataSources: metaData.source,
                orgUnitLevel: metaData.adminLevel,
                headerColor: themeColor
            })
            
            if (result.success) {
                dispatch(showNotification({
                    message: 'Table de données exporté avec succès',
                    type: 'success',
                    id: 'excel-export-success'
                }))
            } else {
                dispatch(showNotification({
                    message: `Échec de l'export Excel: ${result.error}`,
                    type: 'error',
                    id: 'excel-export-error'
                }))
            }
        } catch (error) {
            console.error('Error exporting Excel:', error)
            dispatch(showNotification({
                message: `Échec de l'export Excel: ${error.message}`,
                type: 'error',
                id: 'excel-export-error'
            }))
        }
    }, [table, memoizedColumns, metaData])

    // Expose handleExcelExport via callback
    useEffect(() => {
        if (onExcelExport) {
            onExcelExport(handleExcelExport)
        }
    }, [onExcelExport, handleExcelExport])

    // Expose handlePdfExport via callback
    useEffect(() => {
        if (onPdfExport) {
            onPdfExport(handlePdfExport)
        }
    }, [onPdfExport, handlePdfExport])

    // Generate modal content based on active action
    const generateModalContent = useCallback(() => {
        switch (activeAction) {
            case 'exports':
                return (
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
                                closeModal()
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
                                handleExcelExport()
                                closeModal()
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
                )
            default:
                return null
        }
    }, [activeAction, handlePdfExport, handleExcelExport, closeModal])

    // Update modal content when action changes
    useEffect(() => {
        if (showModal && activeAction) {
            const content = (
                <Box sx={{ width: '100%' }}>

                    {generateModalContent()}
                </Box>
            )

            updateModalContent(
                MODAL_TITLES[activeAction] || '',
                content
            )
        }
    }, [showModal, activeAction, generateModalContent, updateModalContent])

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
                onClose={closeModal}
                title={modalData.title}
            >
                {modalData.content}
            </Modal>
        </>
    )
}

export default DataTable
