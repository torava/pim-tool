import {
  compareAttributeToRecommendation,
  compareMealPriceToRecommendation,
  getAttribute,
  getRecommendation,
  hasChildren,
  PRICE_RECOMMENDATION,
} from '@torava/pim-utils';

import type { Locale, Sex } from '../components/App';
import type RecommendationShape from '@torava/pim-utils/dist/models/Recommendation';
import type AttributeShape from '@torava/pim-utils/dist/models/Attribute';

export const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH || 'http://localhost:42809';

const GOOD_COLOR = '#00ff00aa';
const BAD_COLOR = '#ff0000aa';

export const getDailyPriceBackgroundColor = (value: number) => (value < PRICE_RECOMMENDATION ? GOOD_COLOR : BAD_COLOR);

export const getMealPriceBackgroundColor = (
  value: number,
  energy: number,
  energyRecommendation?: RecommendationShape
) => (compareMealPriceToRecommendation(value, energy, energyRecommendation) ? GOOD_COLOR : BAD_COLOR);

export const getAttributeBackgroundColor = (
  value: number,
  attributeName: string,
  attributes: AttributeShape[],
  recommendations: RecommendationShape[],
  sex?: Sex
) => {
  const attribute = getAttribute(attributeName, attributes, recommendations, sex);
  if (attribute) {
    const recommendation = getRecommendation(attribute, recommendations, sex);
    if (recommendation) {
      return compareAttributeToRecommendation(value, recommendation) ? GOOD_COLOR : BAD_COLOR;
    }
  }
};

export const getEnergy = (row: Record<string, string | number | null>) => {
  const energyKey = Object.keys(row).find(
    (key) =>
      key.includes('energy,calculated') || key.includes('energia, laskennallinen') || key.includes('energi, beräknad')
  );
  if (energyKey) {
    return row[energyKey];
  }
};

export const isAllExpanded = (expanded: Record<number, boolean>, rows: Record<string, string | number | null>[]) => {
  const parents = rows.filter((row) => hasChildren(Number(row.id), rows));
  return parents.every((parent) => expanded[Number(parent.id)]);
};

export const formatNumber = (value: number, locale?: Locale) =>
  !value || isNaN(value) ? value : new Intl.NumberFormat(locale).format(value);

export const HIDDEN_COLUMNS = ['id', 'parentId'];
