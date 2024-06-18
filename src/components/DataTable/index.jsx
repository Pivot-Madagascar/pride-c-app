import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Paper,
} from '@mui/material'
import PropTypes from 'prop-types'
import React, { useState, useMemo } from 'react'
import EnhancedTableHead from './EnhancedTableHead'

const createData = ({
    id,
    municipality,
    orgUnitName,
    periodName,
    min,
    mean,
    max,
}) => {
    return {
        id,
        municipality,
        orgUnitName,
        periodName,
        min,
        mean,
        max,
    }
}

const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
        return -1
    }
    if (b[orderBy] > a[orderBy]) {
        return 1
    }
    return 0
}

const getComparator = (order, orderBy) => {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}

const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) {
            return order
        }
        return a[1] - b[1]
    })
    return stabilizedThis.map((el) => el[0])
}

const DataTable = ({ data }) => {
    const [order, setOrder] = useState('asc')
    const [orderBy, setOrderBy] = useState('calories')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)

    const rows = data.map((item) => createData(item))

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

    // Memoize sorted rows
    const sortedRows = useMemo(
        () => stableSort(rows, getComparator(order, orderBy)),
        [rows, order, orderBy]
    )

    // Slice the visible rows based on pagination
    const visibleRows = sortedRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    )

    // Function to map period names to their replacements
    const getMappedPeriodName = (periodName) => {
        const periodMapping = {
            "July 2016": "Juillet 2024",
            "August 2016": "Aout 2024",
            "September 2016": "Septembre 2024"
        };
        return periodMapping[periodName] || periodName;
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                    >
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`

                                return (
                                    <TableRow
                                        hover
                                        tabIndex={-1}
                                        key={row.id}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                        >
                                            {row.municipality}
                                        </TableCell>
                                        <TableCell align="left">
                                            {row.orgUnitName}
                                        </TableCell>
                                        <TableCell align="left">
                                            {getMappedPeriodName(row.periodName)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.min}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.mean}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.max}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 53 * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    )
}

DataTable.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            municipality: PropTypes.string.isRequired,
            orgUnitName: PropTypes.string.isRequired,
            periodName: PropTypes.string.isRequired,
            min: PropTypes.number.isRequired,
            mean: PropTypes.number.isRequired,
            max: PropTypes.number.isRequired,
        })
    ).isRequired,
}

export default DataTable
