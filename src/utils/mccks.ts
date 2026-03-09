import type { Attribute, Recommendation } from '../generated/product-api';

export const mockAttributes: Attribute[] = [
  {
    id: 1,
    code: 'GHG',
    name: {
      enUS: 'GHG',
      fiFI: 'KHK',
      svSE: 'VHG',
    },
    parentId: undefined,
  },
  {
    id: 5,
    code: 'ENERC',
    name: {
      enUS: 'Energy,calculated',
      fiFI: 'Energia, laskennallinen',
      svSE: 'Energi, beräknad',
    },
    parentId: 4,
  },
  {
    id: 117,
    code: 'PORTM',
    name: {
      enUS: 'medium-sized portion',
      fiFI: 'keskikokoinen annos',
      svSE: 'medelstor portion',
    },
    parentId: 2,
  },
  {
    id: 13,
    code: 'CHOAVL',
    name: {
      enUS: 'Carbohydrate, available',
      fiFI: 'Hiilihydraatti imeytyvä',
      svSE: 'Kolhydrater, digererbara',
    },
    parentId: 12,
  },
];

export const mockRecommendations: Recommendation[] = [
  {
    id: 7,
    minValue: 45,
    maxValue: 60,
    unit: 'percent',
    perUnit: 'energy',
    minimumAge: undefined,
    maximumAge: undefined,
    sex: undefined,
    weight: undefined,
    pav: undefined,
    pal: undefined,
    note: '',
  },
];
