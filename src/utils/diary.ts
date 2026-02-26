import type { Attribute, Recommendation } from '../generated/product-api';

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

export const getLeafEntities = <T extends { id: number, parentId?: number }>(entities: T[]) =>
  entities.filter((parent) => !entities.some((child) => child.parentId === parent.id));

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
) =>
  getAttributeValue(cellValue, energy, mass, recommendation, attribute) || cellValue;

export const getMealAttributeValue = (
  cellValue: number,
  energy: number,
  mass: number,
  energyRecommendation?: Recommendation,
  recommendation?: Recommendation,
  attribute?: Attribute,
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

export const getAttribute = (name: string, attributes: Attribute[]) =>
  attributes.find(
    (attribute) =>
      attribute.name.fiFI && name.toLocaleLowerCase().includes(attribute.name.fiFI.toLocaleLowerCase())
  );

export const compareMealPriceToRecommendation = (
  value: number,
  energy: number,
  energyRecommendation?: Recommendation
) =>
  value <
  (PRICE_RECOMMENDATION * energy) / convertMeasure(energyRecommendation?.minValue, energyRecommendation?.unit, 'kJ');

export const getDailyPriceBackgroundColor = (value: number) =>
  value < PRICE_RECOMMENDATION ? '#00ff00aa' : '#ff0000aa';

export const getMealPriceBackgroundColor = (value: number, energy: number, energyRecommendation?: Recommendation) =>
  compareMealPriceToRecommendation(value, energy, energyRecommendation) ? '#00ff00aa' : '#ff0000aa';

export const getAttributeBackgroundColor = (
  value: number,
  attributeName: string,
  attributes: Attribute[],
  recommendations: Recommendation[]
) => {
  const attribute = getAttribute(attributeName, attributes);
  if (attribute) {
    const recommendation = getRecommendation(attribute, 'male', recommendations);
    if (recommendation) {
      return compareAttributeToRecommendation(value, recommendation) ? '#00ff00aa' : '#ff0000aa';
    }
  }
};

export const getEnergy = (row: Record<string, string | number | null>) => {
  const energyKey = Object.keys(row).find((key) => key.includes('energia, laskennallinen'));
  if (energyKey) {
    return row[energyKey];
  }
};

export const hasChildren = (id: number, rows: Record<string, string | number | null>[]) =>
  rows.some((row) => row.parentId === id);

export const isAllExpanded = (expanded: Record<number, boolean>, rows: Record<string, string | number | null>[]) => {
  const parents = rows.filter((row) => hasChildren(Number(row.id), rows));
  return parents.every((parent) => expanded[Number(parent.id)]);
};