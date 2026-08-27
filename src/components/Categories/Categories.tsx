import React, { useEffect, useMemo, useState, type ReactElement } from 'react';
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
import { convertMeasure, hasChildren } from '@torava/pim-utils';
import type AttributeShape from '@torava/pim-utils/dist/models/Attribute';
import { visuallyHidden } from '@mui/utils';
import { useLocation } from 'react-router-dom';
import type ItemShape from '@torava/pim-utils/dist/models/Item';

import { API_BASE_PATH, formatNumber, getParents } from '../DiaryTable/utils';
import type { Locale } from '../App';
import { getCategoryItemWithPrice } from './utils';

type Order = 'asc' | 'desc';

interface CategoriesProps {
  attributes: AttributeShape[];
  categories: CategoryShape[];
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function Categories({ attributes, categories, locale, onLocaleChange }: CategoriesProps) {
  const { pathname, hash, key } = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>();
  const [currentCategoryId, setCurrentCategoryId] = useState<number>();
  const [items, setItems] = useState<ItemShape[]>([]);

  const descendingComparator = (a: CategoryShape, b: CategoryShape, orderBy: string) => {
    let aValue, bValue;
    if (orderBy === 'name') {
      aValue = a['name']?.[locale] || a['name']?.['en-US'] || '';
      bValue = b['name']?.[locale] || b['name']?.['en-US'] || '';
    } else if (orderBy === 'price') {
      aValue = getCategoryItemWithPrice(a, items)?.transaction?.totalPrice || 0;
      bValue = getCategoryItemWithPrice(b, items)?.transaction?.totalPrice || 0;
    } else if (orderBy === 'measure') {
      aValue = convertMeasure(
        getCategoryItemWithPrice(a, items)?.measure || 0,
        getCategoryItemWithPrice(a, items)?.unit,
        'kg'
      );
      bValue = convertMeasure(
        getCategoryItemWithPrice(b, items)?.measure || 0,
        getCategoryItemWithPrice(b, items)?.unit,
        'kg'
      );
    } else if (orderBy.startsWith('attribute-')) {
      const attributeId = parseInt(orderBy.split('-')[1]);
      aValue = a.attributes?.find((attr) => attr.attributeId === attributeId)?.value || '';
      bValue = b.attributes?.find((attr) => attr.attributeId === attributeId)?.value || '';
    }
    if (bValue! < aValue!) {
      return -1;
    }
    if (bValue! > aValue!) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order: Order, orderBy: string): ((a: CategoryShape, b: CategoryShape) => number) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const sortedCategories = useMemo(
    () => (orderBy ? [...categories].sort(getComparator(order, orderBy)) : categories),
    [categories, order, orderBy]
  );

  useEffect(() => {
    if (hash !== '' && sortedCategories.length) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const category = categories.find((category) => `category-${category.id}` === id);
        getParents(category?.id, categories).forEach((parent) => {
          if (parent.id) {
            setExpandedCategories((previousCategories) => ({
              ...previousCategories,
              [parent.id!]: true,
            }));
          }
        });
        setCurrentCategoryId(Number(id.split('-')[1]));
      }, 0);
    }
  }, [pathname, hash, key, sortedCategories]);

  useEffect(() => {
    if (currentCategoryId && sortedCategories.length) {
      const parents = getParents(currentCategoryId, categories);
      if (parents.every((parent) => expandedCategories[parent.id!])) {
        const element = document.getElementById(`category-${currentCategoryId}`);
        if (element) {
          element.scrollIntoView();
        }
      }
    }
  }, [currentCategoryId, expandedCategories, sortedCategories]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemResponse = await fetch(`${API_BASE_PATH}/api/item`);
        const itemData = await itemResponse.json();
        setItems(itemData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const renderChildren = (parentId?: number, depth = 0): ReactElement[] =>
    sortedCategories
      .filter((category) => (parentId ? category.parentId === parentId : !category.parentId))
      .map((category) => (
        <React.Fragment key={category.id}>
          <TableRow id={`category-${category.id}`}>
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
            <TableCell>
              {formatNumber(getCategoryItemWithPrice(category, items)?.transaction?.totalPrice, locale, {
                style: 'currency',
                currency: 'EUR',
              })}
            </TableCell>
            <TableCell>
              {formatNumber(getCategoryItemWithPrice(category, items)?.measure, locale)}{' '}
              {getCategoryItemWithPrice(category, items)?.unit}
            </TableCell>
            {attributes.map((attribute) => {
              const categoryAttribute = category.attributes?.find(
                (categoryAttribute) => categoryAttribute.attributeId === attribute.id
              );
              return (
                <TableCell key={attribute.id}>
                  {formatNumber(categoryAttribute?.value, locale)} {categoryAttribute?.unit}
                </TableCell>
              );
            })}
          </TableRow>
          {expandedCategories[category.id!] && renderChildren(category.id, depth + 1)}
        </React.Fragment>
      ));

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
              {attributes.map((attribute) => (
                <TableCell key={attribute.id}>
                  <TableSortLabel
                    active={orderBy === `attribute-${attribute.id}`}
                    direction={orderBy === `attribute-${attribute.id}` ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, `attribute-${attribute.id}`)}
                  >
                    {attribute.name?.[locale] || attribute.name?.['en-US'] || ''}
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
