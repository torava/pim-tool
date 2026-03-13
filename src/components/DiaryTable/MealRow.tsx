import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import type RecommendationShape from '@torava/pim-utils/dist/models/Recommendation';
import type AttributeShape from '@torava/pim-utils/dist/models/Attribute';

import {
  getMealPriceBackgroundColor,
  getEnergy,
  getAttributeBackgroundColor,
  formatNumber,
} from '../../utils/diary';
import type { Sex, Locale } from '../App';
import type { HeadCell } from './DiaryTable';
import { getAttribute, getLeafEntities, getMealAttributeValue, getRecommendation } from '@torava/pim-utils';

interface MealRowProps {
  day: Record<string, string | number | null>;
  meal: Record<string, string | number | null>;
  sortedRows: Record<string, string | number | null>[];
  recommendations: RecommendationShape[];
  attributes: AttributeShape[];
  sex?: Sex;
  locale?: Locale;
  expanded: Record<number, boolean>;
  onExpand: (expanded: Record<number, boolean>) => void;
  headCells: HeadCell[];
}

export function MealRow({
  day,
  meal,
  sortedRows,
  recommendations,
  attributes,
  sex,
  locale,
  expanded,
  onExpand,
  headCells,
}: MealRowProps) {
  const leafAttributes = getLeafEntities(attributes);
  const energyAttribute = attributes.find((attribute) => attribute.code === 'ENERC');
  const energyRecommendation = getRecommendation(energyAttribute, recommendations, sex);
  return (
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
                ? getMealPriceBackgroundColor(Number(day[headCell.id]), Number(getEnergy(day)), energyRecommendation)
                : getAttributeBackgroundColor(
                    getMealAttributeValue(
                      Number(day[headCell.id]),
                      Number(getEnergy(day)),
                      Number(day['mass (g)']),
                      energyRecommendation,
                      getRecommendation(getAttribute(headCell.id, attributes, recommendations), recommendations, sex),
                      getAttribute(headCell.id, attributes, recommendations)
                    ),
                    headCell.id,
                    leafAttributes,
                    recommendations,
                    sex
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
  );
}
