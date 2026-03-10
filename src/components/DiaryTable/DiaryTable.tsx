import React, { useMemo, useState, type ChangeEvent } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import type { Attribute, Recommendation } from '../../generated/product-api';
import type { Locale, Sex } from '../App';
import DiaryTableHead from './DiaryTableHead';
import { DayRow } from './DayRow';
import { HIDDEN_COLUMNS } from '../../utils/diary';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export type Order = 'asc' | 'desc';

function getComparator<Key extends PropertyKey>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string | null }, b: { [key in Key]: number | string | null }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

interface DiaryTableProps {
  rows: Record<string, string | number | null>[];
  recommendations: Recommendation[];
  attributes: Attribute[];
  sex?: Sex;
  locale?: Locale;
}

export default function DiaryTable({ rows, recommendations, attributes, sex, locale }: DiaryTableProps) {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const sortedRows = useMemo(
    () => (orderBy ? [...rows].sort(getComparator(order, orderBy)) : [...rows]),
    [order, orderBy, rows]
  );

  const visibleRows = useMemo(
    () => [...sortedRows].filter((row) => !row.parentId).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, sortedRows]
  );

  const headCells: HeadCell[] = rows.length
    ? Object.keys(rows[0]).map((key) => ({
        id: key,
        numeric: false,
        disablePadding: false,
        label: key,
      }))
    : [];

  const visibleHeadCells = headCells.filter((cell) => !HIDDEN_COLUMNS.includes(cell.id));

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer sx={{ maxHeight: 700 }}>
        <Table sx={{ minWidth: 750 }} size="small" stickyHeader>
          <DiaryTableHead
            headCells={visibleHeadCells}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            rows={rows}
            expanded={expanded}
            setExpanded={setExpanded}
          />
          <TableBody>
            {visibleRows.map((row) => (
              <DayRow
                key={row.id}
                row={row}
                sortedRows={sortedRows}
                recommendations={recommendations}
                attributes={attributes}
                sex={sex}
                locale={locale}
                expanded={expanded}
                onExpand={setExpanded}
                headCells={visibleHeadCells}
              />
            ))}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 33 * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 10000]}
        component="div"
        count={rows.filter((row) => !row.parentId).length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
