import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Box, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import { hasChildren, isAllExpanded } from '../../utils/diary';
import type { HeadCell, Order } from './DiaryTable';

interface DiaryTableHeadProps {
  headCells: HeadCell[];
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy?: string;
  rowCount: number;
  rows: Record<string, string | number | null>[];
  expanded: Record<number, boolean>;
  setExpanded: (expanded: Record<number, boolean>) => void;
}

export default function DiaryTableHead({
  headCells,
  order,
  orderBy,
  onRequestSort,
  rows,
  expanded,
  setExpanded,
}: DiaryTableHeadProps) {
  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell
          onClick={() => {
            const updatedExpanded: Record<number, boolean> = {};
            const allExpanded = isAllExpanded(expanded, rows);
            rows.forEach((row) => {
              if (hasChildren(Number(row.id), rows)) {
                updatedExpanded[Number(row.id)] = !allExpanded;
              }
            });
            setExpanded(updatedExpanded);
          }}
        >
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
