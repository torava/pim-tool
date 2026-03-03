import type { Locale, Sex } from '../components/App';
import type { Attribute, AttributeName, Recommendation } from '../generated/product-api';

/**
 * Food component energy density, MJ/g
 */
const componentEnergyMap = {
  fat: 0.037,
  protein: 0.017,
  carbohydrate: 0.017,
  sugar: 0.017,
  fibre: 0.008,
};

const factors: Record<string, number> = {
  y: -24,
  z: -21,
  a: -16,
  f: -15,
  p: -12,
  n: -9,
  µ: -6,
  m: -3,
  c: -2,
  d: -1,
  '': 0,
  da: 1,
  h: 2,
  k: 3,
  M: 6,
  G: 9,
  T: 12,
  P: 15,
  E: 18,
  Z: 21,
  Y: 24,
};

// price;7;;10.1;euro;;;;;;;;male or female under 45 years living alone average
const PRICE_RECOMMENDATION = 10.1;

const GOOD_COLOR = '#00ff00aa';
const BAD_COLOR = '#ff0000aa';

export const hasChildren = (id: number, rows: Record<string, string | number | null>[]) =>
  rows.some((row) => row.parentId === id);

export const getLeafEntities = <T extends { id: number; parentId?: number }>(entities: T[]) =>
  entities.filter((parent) => !hasChildren(parent.id, entities));

export const convertMeasure = (measure: number = 0, fromUnit?: string, toUnit?: string) => {
  let offset = 0;
  // assumes that 1 l = 1 kg
  if (fromUnit?.substring(fromUnit?.length - 1) === 'l') {
    offset += 3;
  }
  if (toUnit?.substring(toUnit?.length - 1) === 'l') {
    offset -= 3;
  }
  if (fromUnit && fromUnit.length > 1) {
    fromUnit = fromUnit.substring(0, 1);
  } else {
    fromUnit = '';
  }
  if (toUnit && toUnit.length > 1) {
    toUnit = toUnit.substring(0, 1);
  } else {
    toUnit = '';
  }
  const conversion = factors[fromUnit] - factors[toUnit] + offset;
  return measure * Math.pow(10, conversion);
};

export const getAttributeValue = (
  cellValue: number,
  energy: number,
  mass: number,
  recommendation?: Recommendation,
  attribute?: Attribute
) => {
  if (recommendation && attribute) {
    let value;
    if (recommendation.unit === 'percent' && recommendation.perUnit === 'energy') {
      const componentEnergy =
        Object.entries(componentEnergyMap).find(([component]) =>
          attribute.name.enUS?.toLocaleLowerCase().includes(component)
        )?.[1] || 0;
      value = ((cellValue * componentEnergy) / (energy / 1000)) * 100;
    } else if (recommendation.unit === 'g' && recommendation.perUnit === 'MJ') {
      value = cellValue / (energy / 1000);
    } else if (recommendation.perUnit === 'kg') {
      value = cellValue / (mass / 1000);
    } else if (recommendation.unit === 'MJ') {
      value = cellValue / 1000;
    }
    return value;
  }
};

export const getDailyAttributeValue = (
  cellValue: number,
  energy: number,
  mass: number,
  recommendation?: Recommendation,
  attribute?: Attribute
) => getAttributeValue(cellValue, energy, mass, recommendation, attribute) || cellValue;

export const getMealAttributeValue = (
  cellValue: number,
  energy: number,
  mass: number,
  energyRecommendation?: Recommendation,
  recommendation?: Recommendation,
  attribute?: Attribute
) => {
  const value =
    getAttributeValue(cellValue, energy, mass, recommendation, attribute) ||
    (cellValue * energy) / convertMeasure(energyRecommendation?.minValue, energyRecommendation?.unit, 'kJ');
  return value;
};

export const compareAttributeToRecommendation = (value: number, recommendation: Recommendation) =>
  (!recommendation.minValue || value > recommendation.minValue) &&
  (!recommendation.maxValue || value < recommendation.maxValue);

export const getRecommendation = (attribute?: Attribute, sex?: string, recommendations?: Recommendation[]) => {
  if (attribute && sex && recommendations) {
    const attributeRecommendations = recommendations.filter(
      (recommendation) => recommendation.attribute?.id === attribute.id
    );
    const hasSex = attributeRecommendations.some((recommendation) => recommendation.sex);
    return hasSex
      ? attributeRecommendations.find((recommendation) => recommendation.sex === sex)
      : attributeRecommendations[0];
  }
};

export const getAttribute = (name: string, attributes: Attribute[], locale?: Locale) =>
  attributes.find(
    (attribute) =>
      attribute.name[locale?.replace('-', '') as keyof AttributeName] &&
      name.match(/^((min|max)\.\s)?(.*)\s\((.*)\)\s\[(.*)\]$/i)?.[3].toLocaleLowerCase() ===
        attribute.name[locale?.replace('-', '') as keyof AttributeName]?.toLocaleLowerCase()
  );

export const compareMealPriceToRecommendation = (
  value: number,
  energy: number,
  energyRecommendation?: Recommendation
) =>
  value <
  (PRICE_RECOMMENDATION * energy) / convertMeasure(energyRecommendation?.minValue, energyRecommendation?.unit, 'kJ');

export const getDailyPriceBackgroundColor = (value: number) => (value < PRICE_RECOMMENDATION ? GOOD_COLOR : BAD_COLOR);

export const getMealPriceBackgroundColor = (value: number, energy: number, energyRecommendation?: Recommendation) =>
  compareMealPriceToRecommendation(value, energy, energyRecommendation) ? GOOD_COLOR : BAD_COLOR;

export const getAttributeBackgroundColor = (
  value: number,
  attributeName: string,
  attributes: Attribute[],
  recommendations: Recommendation[],
  sex?: Sex,
  locale?: Locale
) => {
  const attribute = getAttribute(attributeName, attributes, locale);
  if (attribute) {
    const recommendation = getRecommendation(attribute, sex, recommendations);
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
