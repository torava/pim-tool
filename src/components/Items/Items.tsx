import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Link,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import type AttributeShape from '@torava/pim-utils/dist/models/Attribute';
import { visuallyHidden } from '@mui/utils';
import { useLocation } from 'react-router-dom';
import type ItemShape from '@torava/pim-utils/dist/models/Item';
import { Link as RouterLink } from 'react-router-dom';

import type { Locale } from '../App';
import { formatNumber } from '../DiaryTable/utils';
import { getItemMeasure, getItemUnit } from '../../utils/items';

type Order = 'asc' | 'desc';

interface ItemsProps {
  attributes: AttributeShape[];
  items: ItemShape[];
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function Items({ items, locale, onLocaleChange }: ItemsProps) {
  const { pathname, hash, key } = useLocation();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>();

  const descendingComparator = (a: ItemShape, b: ItemShape, orderBy: string) => {
    let aValue, bValue;
    if (orderBy === 'name') {
      aValue = a.product?.name;
      bValue = b.product?.name;
    } else if (orderBy === 'category') {
      aValue = a.product?.category?.name?.[locale];
      bValue = b.product?.category?.name?.[locale];
    } else if (orderBy === 'measure') {
      aValue = getItemMeasure(a);
      bValue = getItemMeasure(b);
    } else {
      aValue = a[orderBy as keyof ItemShape];
      bValue = b[orderBy as keyof ItemShape];
    }
    if (bValue! < aValue!) {
      return -1;
    }
    if (bValue! > aValue!) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order: Order, orderBy: string): ((a: ItemShape, b: ItemShape) => number) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const sortedItems = useMemo(
    () => (orderBy ? [...items].sort(getComparator(order, orderBy)) : items),
    [items, order, orderBy]
  );

  useEffect(() => {
    if (hash !== '' && sortedItems.length) {
      setTimeout(() => {
        const id = Number(hash.replace('#', '').split('-')[1]);
        const element = document.getElementById(`item-${id}`);
        if (element) {
          element.scrollIntoView();
        }
      }, 0);
    }
  }, [pathname, hash, key, sortedItems]);

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <>
      <Box sx={{ m: 1 }}>
        <Select value={locale} onChange={(event) => onLocaleChange(event.target.value)} size="small" sx={{ mr: 1 }}>
          <MenuItem disabled value="">
            <em>Locale</em>
          </MenuItem>
          <MenuItem value="fi-FI">Finnish</MenuItem>
          <MenuItem value="en-US">English</MenuItem>
          <MenuItem value="sv-SE">Swedish</MenuItem>
        </Select>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={(event) => handleRequestSort(event, 'name')}
                >
                  Name
                  {orderBy === 'name' ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'category'}
                  direction={orderBy === 'category' ? order : 'asc'}
                  onClick={(event) => handleRequestSort(event, 'category')}
                >
                  Category
                  {orderBy === 'category' ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'price'}
                  direction={orderBy === 'price' ? order : 'asc'}
                  onClick={(event) => handleRequestSort(event, 'price')}
                >
                  Price
                  {orderBy === 'price' ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'measure'}
                  direction={orderBy === 'measure' ? order : 'asc'}
                  onClick={(event) => handleRequestSort(event, 'measure')}
                >
                  Measure
                  {orderBy === 'measure' ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedItems.map((item) => (
              <TableRow key={item.id} id={`item-${item.id}`}>
                <TableCell>{item.product?.name}</TableCell>
                <TableCell>
                  <Link to={`/categories#category-${item.product?.category?.id}`} component={RouterLink}>
                    {item.product?.category?.name?.[locale]}
                  </Link>
                </TableCell>
                <TableCell>{formatNumber(item.price, locale)} €</TableCell>
                <TableCell>
                  {formatNumber(getItemMeasure(item), locale)} {getItemUnit(item)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
