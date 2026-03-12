import { TableCell } from '@mui/material';
import { getAttribute, getDailyAttributeValue, getRecommendation } from '@torava/pim-utils';
import type AttributeShape from '@torava/pim-utils/dist/models/Attribute';
import type RecommendationShape from '@torava/pim-utils/dist/models/Recommendation';

import { getDailyPriceBackgroundColor, getAttributeBackgroundColor, getEnergy, formatNumber } from '../../utils/diary';
import type { HeadCell } from './DiaryTable';
import type { Locale, Sex } from '../App';

interface DayHeadCellProps {
  headCell: HeadCell;
  row: Record<string, string | number | null>;
  attributes: AttributeShape[];
  recommendations: RecommendationShape[];
  sex?: Sex;
  locale?: Locale;
  leafAttributes: AttributeShape[];
}

export function DayHeadCell({
  headCell,
  row,
  attributes,
  recommendations,
  sex,
  locale,
  leafAttributes,
}: DayHeadCellProps) {
  let backgroundColor;
  if (headCell.id.toLocaleLowerCase().includes('price')) {
    backgroundColor = getDailyPriceBackgroundColor(Number(row[headCell.id]));
  } else {
    const attribute = getAttribute(headCell.id, attributes, recommendations, sex);
    const recommendation = getRecommendation(attribute, recommendations, sex);
    const value = getDailyAttributeValue(
      Number(row[headCell.id]),
      Number(getEnergy(row)),
      Number(row['mass (g)']),
      recommendation,
      attribute
    );
    backgroundColor = getAttributeBackgroundColor(value, headCell.id, leafAttributes, recommendations, sex);
  }
  return <TableCell sx={{ backgroundColor }}>{formatNumber(row[headCell.id] as number, locale)}</TableCell>;
}
