import * as React from 'react';
import XLSX from 'xlsx';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import ArrowUpward from '@mui/icons-material/ArrowUpward';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends PropertyKey>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string | null },
  b: { [key in Key]: number | string | null },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

interface EnhancedTableProps {
  headCells: HeadCell[];
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy?: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { headCells, order, orderBy, onRequestSort } =
    props;
  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell />
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
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function EnhancedTable() {
  const [rows, setRows] = React.useState<Record<string, string | number | null>[]>([]);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<string>();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: string,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const sortedRows = React.useMemo(
    () =>
      orderBy
        ? [...rows].sort(getComparator(order, orderBy))
        : [...rows],
    [order, orderBy, rows],
  );

  const visibleRows = React.useMemo(
    () =>
      [...sortedRows].filter((row) => !row.parentId).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, sortedRows],
  );

  const headCells: HeadCell[] = rows.length ? Object.keys(rows[0]).map((key) => ({
    id: key,
    numeric: false,
    disablePadding: true,
    label: key,
  })) : [];

  return (
    <Box sx={{ width: '100%' }}>
      <input type="file" onChange={async (event) => {
        const reader = new FileReader()
        const readFile = async () => {
          const buffer = reader.result;
          const workbook = XLSX.read(buffer);
          const ws = workbook.Sheets[workbook.SheetNames[0]];
          const data: Record<string, string | number>[] = XLSX.utils.sheet_to_json(ws);
          console.log('data', data);
          let treeData: Record<string, string | number | null>[] = [];
          let previousMealIndex = 0;
          let previousDayIndex = 0;
          data.forEach((row, index) => {
            if (!row.meal) {
              treeData = [
                ...treeData.slice(0, previousDayIndex),
                ...treeData.slice(previousDayIndex).map((previousRow) =>
                  previousRow.foodid
                    ? previousRow
                    : {
                        ...previousRow,
                        parentId: index + 1,
                      },
                ),
                {
                  id: index + 1,
                  parentId: null,
                  ...row,
                },
              ];
              previousDayIndex = index + 1;
              previousMealIndex = index + 1;
            } else if (!row.foodid) {
              treeData = [
                ...treeData,
                ...data
                  .slice(previousMealIndex, index)
                  .map((foodRow, foodIndex) => ({
                    id: previousMealIndex + foodIndex + 1,
                    parentId: index + 1,
                    ...foodRow,
                  })),
                {
                  id: index + 1,
                  parentId: null,
                  ...row,
                },
              ];
              previousMealIndex = index + 1;
            }
          });
          console.log('treeData', treeData);
          setRows(treeData);
        };
        reader.addEventListener('load', readFile);
        reader.readAsArrayBuffer(event.target.files![0]);
      }}/>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <EnhancedTableHead
              headCells={headCells}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row) => {
                return (
                  <>
                    <TableRow key={row.id}>
                      <TableCell>
                        <ArrowUpward />
                      </TableCell>
                      {headCells.map((headCell) => (
                        <TableCell>{row[headCell.id]}</TableCell>
                      ))}
                    </TableRow>
                    {sortedRows
                      .filter((meal) => meal.parentId === row.id)
                      .map((meal) => (
                        <>
                          <TableRow key={meal.id} sx={{ pl: 4 }}>
                            <TableCell>
                              <ArrowUpward />
                            </TableCell>
                            {headCells.map((headCell) => (
                              <TableCell>{meal[headCell.id]}</TableCell>
                            ))}
                          </TableRow>
                          {sortedRows
                            .filter((food) => food.parentId === meal.id)
                            .map((food) => (
                              <TableRow key={food.id} sx={{ pl: 4 }}>
                                <TableCell />
                                {headCells.map((headCell) => (
                                  <TableCell>{food[headCell.id]}</TableCell>
                                ))}
                              </TableRow>
                            ))}
                        </>
                      ))}
                  </>
                );
              })}
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
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}