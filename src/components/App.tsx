import React, { useEffect, useState } from 'react';
import XLSX from 'xlsx';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { Configuration, DefaultApi, type Attribute, type Recommendation } from '../generated/product-api';
import DiaryTable from './DiaryTable/DiaryTable';
import { MenuItem, Select } from '@mui/material';

const configuration = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_PATH || 'http://localhost:42809',
});
const defaultApi = new DefaultApi(configuration);

export type Sex = 'female' | 'male';

export type Locale = 'fi-FI' | 'en-US' | 'sv-SV';

export default function App() {
  const [rows, setRows] = useState<Record<string, string | number | null>[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [sex, setSex] = useState<Sex | ''>('');
  const [locale, setLocale] = useState<Locale | ''>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recommendationResponse = await defaultApi.apiRecommendationGet();
        setRecommendations(recommendationResponse);

        const attributeResponse = await defaultApi.apiAttributeGet();
        setAttributes(attributeResponse);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    const reader = new FileReader();
    const readFile = async () => {
      const buffer = reader.result;
      const workbook = XLSX.read(buffer);
      const ws = workbook.Sheets[workbook.SheetNames[0]];
      const data: Record<string, string | number>[] = XLSX.utils.sheet_to_json(ws);
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
                  }
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
            ...data.slice(previousMealIndex, index).map((foodRow, foodIndex) => ({
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
      setRows(treeData);
    };
    reader.addEventListener('load', readFile);
    reader.readAsArrayBuffer(event.target.files![0]);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }}>
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
          <MenuItem value="sv-SV">Swedish</MenuItem>
        </Select>
        <Select value={sex} onChange={(event) => setSex(event.target.value)} displayEmpty size="small" sx={{ mr: 1 }}>
          <MenuItem disabled value="">
            <em>Sex</em>
          </MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="male">Male</MenuItem>
        </Select>
        <input type="file" onChange={handleFileChange} data-testid="file" />
        {!!rows.length && (
          <DiaryTable
            rows={rows}
            recommendations={recommendations}
            attributes={attributes}
            sex={sex || undefined}
            locale={locale || undefined}
          />
        )}
      </Paper>
    </Box>
  );
}
