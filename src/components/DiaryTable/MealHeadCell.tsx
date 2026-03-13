import { TableCell } from '@mui/material';
import { getMealAttributeValue, getRecommendation, getAttribute } from '@torava/pim-utils';
import type AttributeShape from '@torava/pim-utils/dist/models/Attribute';
import type RecommendationShape from '@torava/pim-utils/dist/models/Recommendation';

import { getMealPriceBackgroundColor, getEnergy, getAttributeBackgroundColor, formatNumber } from '../../utils/diary';
import type { Locale, Sex } from '../App';

interface MealHeadeCellProps {
  headCell: { id: string };
  day: Record<string, string | number | null>;
  meal: Record<string, string | number | null>;
  energyRecommendation: RecommendationShape;
  leafAttributes: AttributeShape[];
  recommendations: RecommendationShape[];
  sex?: Sex;
  locale?: Locale;
}

export function MealHeadCell({
  headCell,
  day,
  meal,
  energyRecommendation,
  leafAttributes,
  recommendations,
  sex,
  locale,
}: MealHeadeCellProps) {
  let backgroundColor;
  if (headCell.id.toLocaleLowerCase().includes('price')) {
    backgroundColor = getMealPriceBackgroundColor(
      Number(day[headCell.id]),
      Number(getEnergy(day)),
      energyRecommendation
    );
  } else {
    const attribute = getAttribute(headCell.id, leafAttributes, recommendations);
    backgroundColor = getAttributeBackgroundColor(
      getMealAttributeValue(
        Number(day[headCell.id]),
        Number(getEnergy(day)),
        Number(day['mass (g)']),
        energyRecommendation,
        getRecommendation(attribute, recommendations, sex),
        attribute
      ),
      headCell.id,
      leafAttributes,
      recommendations,
      sex
    );
  }
  return <TableCell sx={{ backgroundColor }}>{formatNumber(meal[headCell.id] as number, locale)}</TableCell>;
}
