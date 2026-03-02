import React, { useEffect, useMemo, useState, type ChangeEvent } from 'react';
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
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import { Configuration, DefaultApi, type Attribute, type Recommendation } from './generated/product-api';
import {
  formatNumber,
  getAttribute,
  getAttributeBackgroundColor,
  getDailyAttributeValue,
  getDailyPriceBackgroundColor,
  getEnergy,
  getLeafEntities,
  getMealAttributeValue,
  getMealPriceBackgroundColor,
  getRecommendation,
  hasChildren,
  isAllExpanded,
} from './utils/diary';

const configuration = new Configuration({
  basePath: 'http://localhost:42809',
});
const defaultApi = new DefaultApi(configuration);

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
  rows: Record<string, string | number | null>[];
  expanded: Record<number, boolean>;
  setExpanded: (expanded: Record<number, boolean>) => void;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { headCells, order, orderBy, onRequestSort, rows, expanded, setExpanded } =
    props;
  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell onClick={() => {
          const updatedExpanded: Record<number, boolean> = {};
          const allExpanded = isAllExpanded(expanded, rows);
          rows.forEach((row) => {
            if (hasChildren(Number(row.id), rows)) {
              updatedExpanded[Number(row.id)] = !allExpanded;
            }
          });
          setExpanded(updatedExpanded);
        }}>
          {isAllExpanded(expanded, rows) ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
        </TableCell>
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
  const [rows, setRows] = useState<Record<string, string | number | null>[]>([]);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const sex = 'male';
  const leafAttributes = getLeafEntities(attributes);
  const energyAttribute = attributes.find((attribute) => attribute.code === 'ENERC');
  const energyRecommendation = getRecommendation(energyAttribute, sex, recommendations);

  useEffect(() => {
    const fetchData = async () => {
      const recommendationResponse = await defaultApi.apiRecommendationGet();
      setRecommendations(recommendationResponse);

      const attributeResponse = await defaultApi.apiAttributeGet();
      setAttributes(attributeResponse);
    };
    fetchData();
  }, []);

  console.log('leafAttributes', leafAttributes);

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

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
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
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const sortedRows = useMemo(
    () =>
      orderBy
        ? [...rows].sort(getComparator(order, orderBy))
        : [...rows],
    [order, orderBy, rows],
  );

  const visibleRows = useMemo(
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
      <input type="file" onChange={handleFileChange}/>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            size="small"
          >
            <EnhancedTableHead
              headCells={headCells}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              rows={rows}
              expanded={expanded}
              setExpanded={setExpanded}
            />
            <TableBody>
              {visibleRows.map((row) => {
                return (
                  <>
                    <TableRow key={row.id}>
                      <TableCell onClick={() => {
                        setExpanded({ ...expanded, [Number(row.id)]: !expanded[Number(row.id)] })
                      }}>
                        {expanded[Number(row.id)] ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                      </TableCell>
                      {headCells.map((headCell) => (
                        <TableCell
                          sx={{
                            backgroundColor: headCell.id.toLocaleLowerCase().includes('price') ?
                              getDailyPriceBackgroundColor(Number(row[headCell.id])) :
                              getAttributeBackgroundColor(
                                getDailyAttributeValue(
                                  Number(row[headCell.id]),
                                  Number(getEnergy(row)),
                                  Number(row['mass (g)']),
                                  getRecommendation(getAttribute(headCell.id, attributes), sex, recommendations),
                                  getAttribute(headCell.id, attributes)
                                ),
                                headCell.id,
                                leafAttributes,
                                recommendations
                              ),
                          }}
                        >
                          {formatNumber(row[headCell.id] as number)}
                        </TableCell>
                      ))}
                    </TableRow>
                    {expanded[Number(row.id)] && sortedRows
                      .filter((meal) => meal.parentId === row.id)
                      .map((meal) => (
                        <>
                          <TableRow key={meal.id} sx={{ pl: 4 }}>
                            <TableCell sx={{ pl: 6 }} onClick={() => {
                              setExpanded({ ...expanded, [Number(meal.id)]: !expanded[Number(meal.id)] })
                            }}>
                              {expanded[Number(meal.id)] ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                            </TableCell>
                            {headCells.map((headCell) => (
                              <TableCell
                                sx={{
                                  backgroundColor: headCell.id.toLocaleLowerCase().includes('price') ?
                                    getMealPriceBackgroundColor(Number(row[headCell.id]), Number(getEnergy(row)), energyRecommendation) :
                                    getAttributeBackgroundColor(
                                      getMealAttributeValue(
                                        Number(row[headCell.id]),
                                        Number(getEnergy(row)),
                                        Number(row['mass (g)']),
                                        energyRecommendation,
                                        getRecommendation(getAttribute(headCell.id, attributes), sex, recommendations),
                                        getAttribute(headCell.id, attributes)
                                      ),
                                      headCell.id,
                                      leafAttributes,
                                      recommendations
                                    ),
                                }}
                              >
                                {formatNumber(meal[headCell.id] as number)}
                              </TableCell>
                            ))}
                          </TableRow>
                          {expanded[Number(meal.id)] && sortedRows
                            .filter((food) => food.parentId === meal.id)
                            .map((food) => (
                              <TableRow key={food.id} sx={{ pl: 4 }}>
                                <TableCell />
                                {headCells.map((headCell) => (
                                  <TableCell>{formatNumber(food[headCell.id] as number)}</TableCell>
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
          count={rows.filter((row) => !row.parentId).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}