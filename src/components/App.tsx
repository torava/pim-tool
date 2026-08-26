import React, { useEffect, useState } from 'react';
import XLSX from 'xlsx';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import type RecommendationShape from '@torava/pim-utils/dist/models/Recommendation';
import type AttributeShape from '@torava/pim-utils/dist/models/Attribute';
import type CategoryShape from '@torava/pim-utils/dist/models/Category';

import DiaryTable from './DiaryTable/DiaryTable';
import { API_BASE_PATH } from '../utils/diary';
import { Tab, Tabs } from '@mui/material';
import { Categories } from './Categories/Categories';

export type Sex = 'female' | 'male';

export type Locale = 'fi-FI' | 'en-US' | 'sv-SE';

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const [rows, setRows] = useState<Record<string, string | number | null>[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationShape[]>([]);
  const [attributes, setAttributes] = useState<AttributeShape[]>([]);
  const [categories, setCategories] = useState<CategoryShape[]>([]);
  const [sex, setSex] = useState<Sex | ''>('');
  const [locale, setLocale] = useState<Locale>('fi-FI');
  const [uploading, setUploading] = useState(false);
  const [href, setHref] = useState<string>('');
  const [download, setDownload] = useState<string>('');
  const fileUpload = React.createRef<HTMLInputElement>();
  const location = useLocation();
  const navigate = useNavigate();
  const tab = location.pathname.includes('/categories') ? 1 : 0;

  useEffect(() => {
    if (location.pathname !== '/' && !location.pathname.includes('/categories')) {
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleFileChange = async () => {
    if (fileUpload.current?.files?.[0] && locale && sex) {
      setUploading(true);
      const formData = new FormData();
      formData.append('upload', fileUpload.current.files[0]);
      const fileName = fileUpload.current.files[0].name;
      try {
        const response = await fetch(`${API_BASE_PATH}/api/category/diary?locale=${locale}&sex=${sex}`, {
          method: 'POST',
          body: formData,
        });
        const buffer = await response.arrayBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        setHref(window.URL.createObjectURL(blob));
        setDownload(`${fileName}_pi.xlsx`);
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
      } catch (error) {
        console.error(error);
      } finally {
        setUploading(false);
      }
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

        const categoryResponse = await fetch(`${API_BASE_PATH}/api/category?categoriesPerPage=10000&attributes=1`);
        const categoryData = await categoryResponse.json();
        setCategories(categoryData.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    handleFileChange();
  }, [locale, sex]);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Tabs
          value={tab}
          onChange={(_event, newValue) => navigate(newValue === 1 ? '/categories' : '/')}
          aria-label="tabs"
        >
          <Tab label="Diary" disableRipple />
          <Tab label="Categories" disableRipple />
        </Tabs>
        <Box hidden={tab !== 0}>
          <Box sx={{ m: 1 }}>
            <Select
              value={locale}
              onChange={(event) => setLocale(event.target.value)}
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
            <Select
              value={sex}
              onChange={(event) => setSex(event.target.value)}
              displayEmpty
              size="small"
              sx={{ mr: 1 }}
            >
              <MenuItem disabled value="">
                <em>Sex</em>
              </MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="male">Male</MenuItem>
            </Select>
            <input
              type="file"
              onChange={handleFileChange}
              data-testid="file"
              ref={(ref) => {
                fileUpload.current = ref;
              }}
            />
            {uploading && <CircularProgress sx={{ ml: 1 }} size={16} />}
            {href && (
              <Typography display="inline" sx={{ ml: 1 }}>
                <Link href={href} download={download}>
                  Download XSLX
                </Link>
              </Typography>
            )}
          </Box>
          {!!rows.length && (
            <DiaryTable
              rows={rows}
              recommendations={recommendations}
              attributes={attributes}
              categories={categories}
              sex={sex || undefined}
              locale={locale || undefined}
            />
          )}
        </Box>
        <Box hidden={tab !== 1}>
          <Categories attributes={attributes} categories={categories} locale={locale} onLocaleChange={setLocale} />
        </Box>
      </Paper>
    </Box>
  );
}
