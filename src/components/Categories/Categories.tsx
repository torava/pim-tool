import { useEffect, useMemo, useState, type ReactElement } from 'react';
import type CategoryShape from '@torava/pim-utils/dist/models/Category';
import {
  Box,
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
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { hasChildren } from '@torava/pim-utils';
import type AttributeShape from '@torava/pim-utils/dist/models/Attribute';
import { visuallyHidden } from '@mui/utils';

import { API_BASE_PATH } from '../../utils/diary';
import type { Locale } from '../App';

type Order = 'asc' | 'desc';

export function Categories({ attributes }: { attributes: AttributeShape[] }) {
  const [locale, setLocale] = useState<Locale>('fi-FI');
  const [categories, setCategories] = useState<CategoryShape[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await fetch(`${API_BASE_PATH}/api/category?categoriesPerPage=10000&attributes=1`);
        const categoryData = await categoryResponse.json();
        setCategories(categoryData.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const descendingComparator = <T,>(a: T, b: T, orderBy: string) => {
    let aValue, bValue;
    if (orderBy === 'name') {
      aValue = (a as CategoryShape)['name']?.[locale] || (a as CategoryShape)['name']?.['en-US'] || '';
      bValue = (b as CategoryShape)['name']?.[locale] || (b as CategoryShape)['name']?.['en-US'] || '';
    } else if (orderBy.startsWith('attribute-')) {
      const attributeId = parseInt(orderBy.split('-')[1]);
      aValue = (a as CategoryShape).attributes?.find((attr) => attr.attributeId === attributeId)?.value || '';
      bValue = (b as CategoryShape).attributes?.find((attr) => attr.attributeId === attributeId)?.value || '';
    }
    if (bValue! < aValue!) {
      return -1;
    }
    if (bValue! > aValue!) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order: Order, orderBy: string): (a: any, b: any) => number => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const sortedCategories = useMemo(
    () => (orderBy ? [...categories].sort(getComparator(order, orderBy)) : categories),
    [categories, order, orderBy]
  );

  const renderChildren = (parentId?: number, depth = 0): ReactElement[] =>
    sortedCategories
      .filter((category) => (parentId ? category.parentId === parentId : !category.parentId))
      .map((category) => (
        <>
          <TableRow key={category.id}>
            <TableCell
              sx={{ pl: 2 + depth * 6 }}
              onClick={() =>
                setExpandedCategories((previousCategories) => ({
                  ...previousCategories,
                  [category.id!]: !previousCategories[category.id!],
                }))
              }
            >
              {hasChildren(category.id, categories) &&
                (expandedCategories[category.id!] ? <ExpandLess /> : <ExpandMore />)}
            </TableCell>
            <TableCell>{category.name?.[locale] || category.name?.['en-US'] || ''}</TableCell>
            {attributes.map((attribute) => {
              const categoryAttribute = category.attributes?.find(
                (categoryAttribute) => categoryAttribute.attributeId === attribute.id
              );
              return (
                <TableCell key={attribute.id}>
                  {typeof categoryAttribute?.value === 'number'
                    ? new Intl.NumberFormat(locale).format(categoryAttribute?.value)
                    : categoryAttribute?.value || ''}{' '}
                  {categoryAttribute?.unit}
                </TableCell>
              );
            })}
          </TableRow>
          {expandedCategories[category.id!] && renderChildren(category.id, depth + 1)}
        </>
      ));

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <>
      <Box sx={{ m: 1 }}>
        <Select
          value={locale}
          onChange={(event) => setLocale(event.target.value)}
          displayEmpty
          size="small"
          sx={{ mr: 1 }}
        >
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
              <TableCell
                onClick={() =>
                  setExpandedCategories(
                    Object.keys(expandedCategories).length === categories.length
                      ? {}
                      : Object.fromEntries(categories.map((category) => [category.id!, true]))
                  )
                }
              >
                {Object.keys(expandedCategories).length === categories.length ? <ExpandLess /> : <ExpandMore />}
              </TableCell>
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
              {attributes.map((attribute) => (
                <TableCell key={attribute.id}>
                  <TableSortLabel
                    active={orderBy === `attribute-${attribute.id}`}
                    direction={orderBy === `attribute-${attribute.id}` ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, `attribute-${attribute.id}`)}
                  >
                    {attribute.name?.['fi-FI']}
                    {orderBy === `attribute-${attribute.id}` ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{renderChildren()}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
