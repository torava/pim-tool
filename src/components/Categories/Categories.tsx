import { useEffect, useState, type ReactElement } from 'react';
import type CategoryShape from '@torava/pim-utils/dist/models/Category';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { hasChildren } from '@torava/pim-utils';
import type AttributeShape from '@torava/pim-utils/dist/models/Attribute';

import { API_BASE_PATH } from '../../utils/diary';

export function Categories({ attributes }: { attributes: AttributeShape[] }) {
  const [categories, setCategories] = useState<CategoryShape[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});

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

  console.log('Categories:', categories);

  const renderChildren = (parentId?: number, depth = 0): ReactElement[] =>
    categories
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
            <TableCell>{category.name?.['fi-FI']}</TableCell>
            {attributes.map((attribute) => {
              const categoryAttribute = category.attributes?.find(
                (categoryAttribute) => categoryAttribute.attributeId === attribute.id
              );
              return <TableCell key={attribute.id}>{categoryAttribute?.value} {categoryAttribute?.unit}</TableCell>;
            })}
          </TableRow>
          {expandedCategories[category.id!] && renderChildren(category.id, depth + 1)}
        </>
      ));

  return (
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
            <TableCell>Name</TableCell>
            {attributes.map((attribute) => (
              <TableCell key={attribute.id}>{attribute.name?.['fi-FI']}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{renderChildren()}</TableBody>
      </Table>
    </TableContainer>
  );
}
