import {
    TableHead,
    TableCell,
    TableSortLabel,
    Box,
    TableRow,
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import PropTypes from 'prop-types'
import React, { useMemo, useEffect } from 'react'
import { headCells as initialHeadCells } from './config'

const EnhancedTableHead = ({ order, orderBy, onRequestSort, cols }) => {
    const headCells = useMemo(() => {
        const colsMap = new Map(
            cols.filter((col) => col.show).map((col) => [col.value, col])
        )

        return initialHeadCells
            .map((headCell) => colsMap.get(headCell.id) || headCell)
            .filter(
                (headCell) =>
                    colsMap.has(headCell.id) || headCell.show !== false
            )
    }, [cols])

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property)
    }

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc'
                                        ? 'sorted descending'
                                        : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    cols: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            show: PropTypes.bool,
        })
    ).isRequired,
}

export default EnhancedTableHead