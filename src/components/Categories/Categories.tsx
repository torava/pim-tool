import { useEffect, useState, type ReactElement } from 'react';
import type CategoryShape from '@torava/pim-utils/dist/models/Category';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';

import { API_BASE_PATH } from '../../utils/diary';

export function Categories() {
  const [categories, setCategories] = useState<CategoryShape[]>([]);

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

  const renderChildren = (parentId?: number, depth = 0): ReactElement[] =>
    categories
      .filter((category) => parentId ? category.parentId === parentId : !category.parentId)
      .map((category) => (
        <>
          <TableRow key={category.id}>
            <TableCell sx={{ pl: 2 + depth * 6 }}>
              <ExpandLess />
            </TableCell>
            <TableCell>{category.name?.['fi-FI']}</TableCell>
          </TableRow>
          {renderChildren(category.id, depth + 1)}
        </>
      ));

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <ExpandLess />
            </TableCell>
            <TableCell>Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderChildren()}</TableBody>
      </Table>
    </TableContainer>
  );
}
