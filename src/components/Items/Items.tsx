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
  TextField,
} from '@mui/material';
import type AttributeShape from '@torava/pim-utils/dist/models/Attribute';
import { visuallyHidden } from '@mui/utils';
import { useLocation } from 'react-router-dom';
import type ItemShape from '@torava/pim-utils/dist/models/Item';
import { Link as RouterLink } from 'react-router-dom';
import { convertMeasure } from '@torava/pim-utils';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const descendingComparator = (a: ItemShape, b: ItemShape, orderBy: string) => {
    let aValue, bValue;
    if (orderBy === 'name') {
      aValue = a.product?.name;
      bValue = b.product?.name;
    } else if (orderBy === 'category') {
      aValue = a.product?.category?.name?.[locale];
      bValue = b.product?.category?.name?.[locale];
    } else if (orderBy === 'measure') {
      aValue = convertMeasure(getItemMeasure(a), getItemUnit(a), 'kg');
      bValue = convertMeasure(getItemMeasure(b), getItemUnit(b), 'kg');
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

  const filteredItems = useMemo(() => {
    const query = debouncedSearchTerm.trim().toLowerCase();
    if (!query) {
      return sortedItems;
    }

    return sortedItems.filter((item) => {
      const name = item.product?.name || '';
      const aliasList = Array.isArray(item.product?.aliases) ? item.product.aliases : [];
      const aliasText = aliasList.join(' ').toLowerCase();

      return name.toLowerCase().includes(query) || aliasText.includes(query);
    });
  }, [debouncedSearchTerm, sortedItems]);

  const renderItemName = (name: string) => {
    const query = debouncedSearchTerm.trim();
    if (!query) {
      return name;
    }

    const matchIndex = name.toLocaleLowerCase().indexOf(query.toLocaleLowerCase());
    if (matchIndex === -1) {
      return name;
    }

    return (
      <>
        {name.slice(0, matchIndex)}
        <strong>{name.slice(matchIndex, matchIndex + query.length)}</strong>
        {name.slice(matchIndex + query.length)}
      </>
    );
  };

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
      <Box sx={{ m: 1, display: 'flex', alignItems: 'center' }}>
        <Select value={locale} onChange={(event) => onLocaleChange(event.target.value)} size="small" sx={{ mr: 1 }}>
          <MenuItem disabled value="">
            <em>Locale</em>
          </MenuItem>
          <MenuItem value="fi-FI">Finnish</MenuItem>
          <MenuItem value="en-US">English</MenuItem>
          <MenuItem value="sv-SE">Swedish</MenuItem>
        </Select>
        <TextField
          size="small"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by item name"
          slotProps={{ htmlInput: { 'aria-label': 'Search by item name' } }}
          sx={{ minWidth: 220 }}
        />
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
            {filteredItems.map((item) => (
              <TableRow key={item.id} id={`item-${item.id}`}>
                <TableCell>{renderItemName(item.product?.name || '')}</TableCell>
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
