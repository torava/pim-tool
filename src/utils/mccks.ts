import type AttributeShape from '@torava/pim-utils/dist/models/Attribute';
import type CategoryShape from '@torava/pim-utils/dist/models/Category';
import type ItemShape from '@torava/pim-utils/dist/models/Item';
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

export const mockCategories: CategoryShape[] = [
  {
    id: 1,
    name: {
      'en-US': 'Food',
      'fi-FI': 'Ruoka',
      'sv-SE': 'Mat',
    },
    aliases: undefined,
    parentId: undefined,
    attributes: [],
  },
];

export const mockItems: ItemShape[] = [
  {
    id: 1,
    itemNumber: undefined,
    text: 'Sondey luomu riisikakku',
    price: 0.99,
    quantity: undefined,
    measure: undefined,
    unit: undefined,
    transactionId: 1,
    productId: 1,
    transaction: {
      id: 1,
      date: '2021-03-01T22:00:00.000Z',
      partyId: undefined,
      totalPrice: undefined,
      totalPriceRead: undefined,
      party: undefined,
    },
    product: {
      id: 1,
      productNumber: undefined,
      name: 'Sondey Bio Organic Rice Cakes',
      aliases: undefined,
      contributionList: undefined,
      quantity: undefined,
      measure: 130,
      unit: 'g',
      manufacturerId: undefined,
      brandId: undefined,
      categoryId: 2213,
      manufacturer: undefined,
      category: {
        id: 2213,
        name: {
          'en-US': 'Rice cake',
          'fi-FI': 'Riisikakku, riisikeksi',
          'sv-SE': 'Riskaka, riskex',
        },
        aliases: undefined,
        parentId: 55,
      },
    },
  },
];
