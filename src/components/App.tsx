import React, { useEffect, useState } from 'react';
import XLSX from 'xlsx';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import type RecommendationShape from '@torava/pim-utils/dist/models/Recommendation';
import type AttributeShape from '@torava/pim-utils/dist/models/Attribute';

import DiaryTable from './DiaryTable/DiaryTable';
import { CircularProgress, MenuItem, Select } from '@mui/material';
import { API_BASE_PATH } from '../utils/diary';

export type Sex = 'female' | 'male';

export type Locale = 'fi-FI' | 'en-US' | 'sv-SV';

export default function App() {
  const [rows, setRows] = useState<Record<string, string | number | null>[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationShape[]>([]);
  const [attributes, setAttributes] = useState<AttributeShape[]>([]);
  const [sex, setSex] = useState<Sex | ''>('');
  const [locale, setLocale] = useState<Locale | ''>('');
  const [uploading, setUploading] = useState(false);
  const fileUpload = React.createRef<HTMLInputElement>();

  const handleFileChange = async () => {
    if (fileUpload.current?.files?.[0] && locale && sex) {
      setUploading(true);
      const formData = new FormData();
      formData.append('upload', fileUpload.current.files[0]);
      const response = await fetch(`${API_BASE_PATH}/api/category/diary?locale=${locale}&sex=${sex}`, {
        method: 'POST',
        body: formData,
      });
      const buffer = await response.arrayBuffer();
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
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recommendationResponse = await fetch(`${API_BASE_PATH}/api/recommendation`);
        const recommendationData = await recommendationResponse.json();
        setRecommendations(recommendationData);

        const attributeResponse = await fetch(`${API_BASE_PATH}/api/attribute`);
        const attributeData = await attributeResponse.json();
        setAttributes(attributeData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    handleFileChange();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, sex]);

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
        <input type="file" onChange={handleFileChange} data-testid="file" ref={(ref) => { fileUpload.current = ref }} />
        {uploading && <CircularProgress sx={{ ml: 1 }} size={16} />}
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
