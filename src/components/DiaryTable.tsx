import React, { useMemo, useState, type ChangeEvent } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import {
  getRecommendation,
  getDailyPriceBackgroundColor,
  getAttributeBackgroundColor,
  getDailyAttributeValue,
  getEnergy,
  getAttribute,
  formatNumber,
  getMealPriceBackgroundColor,
  getMealAttributeValue,
  getLeafEntities,
} from '../utils/diary';
import type { Attribute, Recommendation } from '../generated/product-api';
import type { Locale, Sex } from './App';
import DiaryTableHead from './DiaryTableHead';

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
  orderBy: Key,
): (
  a: { [key in Key]: number | string | null },
  b: { [key in Key]: number | string | null },
) => number {
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

export default function DiaryTable({
  rows,
  recommendations,
  attributes,
  sex,
  locale,
}: DiaryTableProps) {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const leafAttributes = getLeafEntities(attributes);
  const energyAttribute = attributes.find((attribute) => attribute.code === 'ENERC');
  const energyRecommendation = getRecommendation(energyAttribute, sex, recommendations);

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
      <TableContainer>
        <Table sx={{ minWidth: 750 }} size="small">
          <DiaryTableHead
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
                    <TableCell
                      onClick={() => {
                        setExpanded({ ...expanded, [Number(row.id)]: !expanded[Number(row.id)] });
                      }}
                    >
                      {expanded[Number(row.id)] ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                    </TableCell>
                    {headCells.map((headCell) => (
                      <TableCell
                        sx={{
                          backgroundColor: headCell.id.toLocaleLowerCase().includes('price')
                            ? getDailyPriceBackgroundColor(Number(row[headCell.id]))
                            : getAttributeBackgroundColor(
                                getDailyAttributeValue(
                                  Number(row[headCell.id]),
                                  Number(getEnergy(row)),
                                  Number(row['mass (g)']),
                                  getRecommendation(getAttribute(headCell.id, attributes, locale), sex, recommendations),
                                  getAttribute(headCell.id, attributes, locale)
                                ),
                                headCell.id,
                                leafAttributes,
                                recommendations,
                                sex,
                                locale,
                              ),
                        }}
                      >
                        {formatNumber(row[headCell.id] as number, locale)}
                      </TableCell>
                    ))}
                  </TableRow>
                  {expanded[Number(row.id)] &&
                    sortedRows
                      .filter((meal) => meal.parentId === row.id)
                      .map((meal) => (
                        <>
                          <TableRow key={meal.id} sx={{ pl: 4 }}>
                            <TableCell
                              sx={{ pl: 6 }}
                              onClick={() => {
                                setExpanded({ ...expanded, [Number(meal.id)]: !expanded[Number(meal.id)] });
                              }}
                            >
                              {expanded[Number(meal.id)] ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                            </TableCell>
                            {headCells.map((headCell) => (
                              <TableCell
                                sx={{
                                  backgroundColor: headCell.id.toLocaleLowerCase().includes('price')
                                    ? getMealPriceBackgroundColor(
                                        Number(row[headCell.id]),
                                        Number(getEnergy(row)),
                                        energyRecommendation
                                      )
                                    : getAttributeBackgroundColor(
                                        getMealAttributeValue(
                                          Number(row[headCell.id]),
                                          Number(getEnergy(row)),
                                          Number(row['mass (g)']),
                                          energyRecommendation,
                                          getRecommendation(
                                            getAttribute(headCell.id, attributes, locale),
                                            sex,
                                            recommendations
                                          ),
                                          getAttribute(headCell.id, attributes, locale)
                                        ),
                                        headCell.id,
                                        leafAttributes,
                                        recommendations,
                                        sex,
                                        locale
                                      ),
                                }}
                              >
                                {formatNumber(meal[headCell.id] as number, locale)}
                              </TableCell>
                            ))}
                          </TableRow>
                          {expanded[Number(meal.id)] &&
                            sortedRows
                              .filter((food) => food.parentId === meal.id)
                              .map((food) => (
                                <TableRow key={food.id} sx={{ pl: 4 }}>
                                  <TableCell />
                                  {headCells.map((headCell) => (
                                    <TableCell>{formatNumber(food[headCell.id] as number, locale)}</TableCell>
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
    </>
  );
}
