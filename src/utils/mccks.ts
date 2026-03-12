import type AttributeShape from '@torava/pim-utils/dist/models/Attribute';
import type RecommendationShape from '@torava/pim-utils/dist/models/Recommendation';

export const mockAttributes: AttributeShape[] = [
  {
    id: 1,
    code: 'GHG',
    name: {
      'en-US': 'GHG',
      'fi-FI': 'KHK',
      'sv-SE': 'VHG',
    },
    parentId: undefined,
  },
  {
    id: 5,
    code: 'ENERC',
    name: {
      'en-US': 'Energy,calculated',
      'fi-FI': 'Energia, laskennallinen',
      'sv-SE': 'Energi, beräknad',
    },
    parentId: 4,
  },
  {
    id: 117,
    code: 'PORTM',
    name: {
      'en-US': 'medium-sized portion',
      'fi-FI': 'keskikokoinen annos',
      'sv-SE': 'medelstor portion',
    },
    parentId: 2,
  },
  {
    id: 13,
    code: 'CHOAVL',
    name: {
      'en-US': 'Carbohydrate, available',
      'fi-FI': 'Hiilihydraatti imeytyvä',
      'sv-SE': 'Kolhydrater, digererbara',
    },
    parentId: 12,
  },
];

export const mockRecommendations: RecommendationShape[] = [
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
    attributeId: 13,
    attribute: mockAttributes[3],
  },
];
