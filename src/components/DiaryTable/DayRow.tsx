import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import {
  getRecommendation,
  getDailyPriceBackgroundColor,
  getAttributeBackgroundColor,
  getDailyAttributeValue,
  getEnergy,
  getAttribute,
  formatNumber,
  getMealPriceBackgroundColor,
  getMealAttributeValue,
  getLeafEntities,
} from '../../utils/diary';
import type { Recommendation, Attribute } from '../../generated/product-api';
import type { Sex, Locale } from '../App';
import type { HeadCell } from './DiaryTable';

interface DayRowProps {
  row: Record<string, string | number | null>;
  sortedRows: Record<string, string | number | null>[];
  recommendations: Recommendation[];
  attributes: Attribute[];
  sex?: Sex;
  locale?: Locale;
  expanded: Record<number, boolean>;
  onExpand: (expanded: Record<number, boolean>) => void;
  headCells: HeadCell[];
}

export function DayRow({
  row,
  sortedRows,
  recommendations,
  attributes,
  sex,
  locale,
  expanded,
  onExpand,
  headCells,
}: DayRowProps) {
  const leafAttributes = getLeafEntities(attributes);
  const energyAttribute = attributes.find((attribute) => attribute.code === 'ENERC');
  const energyRecommendation = getRecommendation(energyAttribute, sex, recommendations);
  return (
    <React.Fragment key={row.id}>
      <TableRow key={row.id}>
        <TableCell
          onClick={() => {
            onExpand({ ...expanded, [Number(row.id)]: !expanded[Number(row.id)] });
          }}
        >
          {expanded[Number(row.id)] ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sx={{
              backgroundColor: headCell.id.toLocaleLowerCase().includes('price')
                ? getDailyPriceBackgroundColor(Number(row[headCell.id]))
                : getAttributeBackgroundColor(
                    getDailyAttributeValue(
                      Number(row[headCell.id]),
                      Number(getEnergy(row)),
                      Number(row['mass (g)']),
                      getRecommendation(getAttribute(headCell.id, attributes, locale), sex, recommendations),
                      getAttribute(headCell.id, attributes, locale)
                    ),
                    headCell.id,
                    leafAttributes,
                    recommendations,
                    sex,
                    locale
                  ),
            }}
          >
            {formatNumber(row[headCell.id] as number, locale)}
          </TableCell>
        ))}
      </TableRow>
      {expanded[Number(row.id)] &&
        sortedRows
          .filter((meal) => meal.parentId === row.id)
          .map((meal) => (
            <>
              <TableRow key={meal.id} sx={{ pl: 4 }}>
                <TableCell
                  sx={{ pl: 6 }}
                  onClick={() => {
                    onExpand({ ...expanded, [Number(meal.id)]: !expanded[Number(meal.id)] });
                  }}
                >
                  {expanded[Number(meal.id)] ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                </TableCell>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    sx={{
                      backgroundColor: headCell.id.toLocaleLowerCase().includes('price')
                        ? getMealPriceBackgroundColor(
                            Number(row[headCell.id]),
                            Number(getEnergy(row)),
                            energyRecommendation
                          )
                        : getAttributeBackgroundColor(
                            getMealAttributeValue(
                              Number(row[headCell.id]),
                              Number(getEnergy(row)),
                              Number(row['mass (g)']),
                              energyRecommendation,
                              getRecommendation(getAttribute(headCell.id, attributes, locale), sex, recommendations),
                              getAttribute(headCell.id, attributes, locale)
                            ),
                            headCell.id,
                            leafAttributes,
                            recommendations,
                            sex,
                            locale
                          ),
                    }}
                  >
                    {formatNumber(meal[headCell.id] as number, locale)}
                  </TableCell>
                ))}
              </TableRow>
              {expanded[Number(meal.id)] &&
                sortedRows
                  .filter((food) => food.parentId === meal.id)
                  .map((food) => (
                    <TableRow key={food.id} sx={{ pl: 4 }}>
                      <TableCell />
                      {headCells.map((headCell) => (
                        <TableCell>{formatNumber(food[headCell.id] as number, locale)}</TableCell>
                      ))}
                    </TableRow>
                  ))}
            </>
          ))}
    </React.Fragment>
  );
}
