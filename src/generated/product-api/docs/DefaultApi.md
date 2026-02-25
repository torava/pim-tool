# DefaultApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiAttributeGet**](DefaultApi.md#apiattributeget) | **GET** /api/attribute |  |
| [**apiCategoryDiaryPost**](DefaultApi.md#apicategorydiarypost) | **POST** /api/category/diary |  |
| [**apiCategoryGet**](DefaultApi.md#apicategoryget) | **GET** /api/category |  |
| [**apiCategoryIdGet**](DefaultApi.md#apicategoryidget) | **GET** /api/category/{id} |  |
| [**apiItemGet**](DefaultApi.md#apiitemget) | **GET** /api/item |  |
| [**apiProductGet**](DefaultApi.md#apiproductget) | **GET** /api/product |  |
| [**apiProductIdGet**](DefaultApi.md#apiproductidget) | **GET** /api/product/{id} |  |
| [**apiProductPost**](DefaultApi.md#apiproductpost) | **POST** /api/product |  |
| [**apiReceiptDataEditedIdPost**](DefaultApi.md#apireceiptdataeditedidpost) | **POST** /api/receipt/data/edited/{id} |  |
| [**apiReceiptDataOriginalIdPost**](DefaultApi.md#apireceiptdataoriginalidpost) | **POST** /api/receipt/data/original/{id} |  |
| [**apiReceiptEditPost**](DefaultApi.md#apireceipteditpost) | **POST** /api/receipt/edit |  |
| [**apiReceiptOriginalPost**](DefaultApi.md#apireceiptoriginalpost) | **POST** /api/receipt/original |  |
| [**apiRecommendationGet**](DefaultApi.md#apirecommendationget) | **GET** /api/recommendation |  |
| [**apiSourceGet**](DefaultApi.md#apisourceget) | **GET** /api/source |  |
| [**apiTransactionCsvPost**](DefaultApi.md#apitransactioncsvpost) | **POST** /api/transaction/csv |  |
| [**apiTransactionPost**](DefaultApi.md#apitransactionpost) | **POST** /api/transaction |  |



## apiAttributeGet

> Array&lt;Attribute&gt; apiAttributeGet()



Returns a list of attributes

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiAttributeGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.apiAttributeGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;Attribute&gt;**](Attribute.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiCategoryDiaryPost

> string apiCategoryDiaryPost(locale, sex, upload)



Returns Fineli diary file with prices and environmental foodprints colored based on recommendations from uploaded diary file

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiCategoryDiaryPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string | Locale (optional)
    locale: locale_example,
    // string | Sex (female/male) (optional)
    sex: sex_example,
    // Blob (optional)
    upload: BINARY_DATA_HERE,
  } satisfies ApiCategoryDiaryPostRequest;

  try {
    const data = await api.apiCategoryDiaryPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **locale** | `string` | Locale | [Optional] [Defaults to `undefined`] |
| **sex** | `string` | Sex (female/male) | [Optional] [Defaults to `undefined`] |
| **upload** | `Blob` |  | [Optional] [Defaults to `undefined`] |

### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiCategoryGet

> Array&lt;Category&gt; apiCategoryGet(pageNumber, categoriesPerPage, name)



Returns a list of categories

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiCategoryGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // number | Zero based page number (optional)
    pageNumber: 56,
    // number | Number of categories per page (optional)
    categoriesPerPage: 56,
    // string | Part of category name for filtering (optional)
    name: name_example,
  } satisfies ApiCategoryGetRequest;

  try {
    const data = await api.apiCategoryGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **pageNumber** | `number` | Zero based page number | [Optional] [Defaults to `undefined`] |
| **categoriesPerPage** | `number` | Number of categories per page | [Optional] [Defaults to `undefined`] |
| **name** | `string` | Part of category name for filtering | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;Category&gt;**](Category.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiCategoryIdGet

> Category apiCategoryIdGet(id)



Returns category by id

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiCategoryIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // number | Category id to return
    id: 56,
  } satisfies ApiCategoryIdGetRequest;

  try {
    const data = await api.apiCategoryIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` | Category id to return | [Defaults to `undefined`] |

### Return type

[**Category**](Category.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiItemGet

> Array&lt;Item&gt; apiItemGet()



Returns a list of items

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiItemGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.apiItemGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;Item&gt;**](Item.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiProductGet

> Array&lt;Product&gt; apiProductGet(acceptLanguage, pageNumber, productsPerPage, name, contributionList, brand, category, quantity, measure, unit, attributeCodes, foodUnitAttributeCode)



Returns list of products

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiProductGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string | Accept language header for filtering name translations (optional)
    acceptLanguage: acceptLanguage_example,
    // number | Zero based page number (optional)
    pageNumber: 56,
    // number | Number of products per page (optional)
    productsPerPage: 56,
    // string | Part of product name for filtering (optional)
    name: name_example,
    // string | Product contributions separated with commas (optional)
    contributionList: contributionList_example,
    // string | Product brand (optional)
    brand: brand_example,
    // string | Product category (optional)
    category: category_example,
    // number | Product quantity (optional)
    quantity: 8.14,
    // number | Product measure such as weight or volume (optional)
    measure: 8.14,
    // string | Unit of product measure such as kg or l (optional)
    unit: unit_example,
    // string | Attribute codes separated with commas to aggregate for product.  For example, GHG will return carbon footprint.  ENERC,FAT,FASAT,CHOAVL,SUGAR,FIBRC,PROT,NACL returns basic nutritional information. (optional)
    attributeCodes: attributeCodes_example,
    // string | Attribute code for food unit to use in attribute aggregation.  For example, PORTS is small portion, PORTM is medium portion and PORTL is large portion. (optional)
    foodUnitAttributeCode: foodUnitAttributeCode_example,
  } satisfies ApiProductGetRequest;

  try {
    const data = await api.apiProductGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **acceptLanguage** | `string` | Accept language header for filtering name translations | [Optional] [Defaults to `undefined`] |
| **pageNumber** | `number` | Zero based page number | [Optional] [Defaults to `undefined`] |
| **productsPerPage** | `number` | Number of products per page | [Optional] [Defaults to `undefined`] |
| **name** | `string` | Part of product name for filtering | [Optional] [Defaults to `undefined`] |
| **contributionList** | `string` | Product contributions separated with commas | [Optional] [Defaults to `undefined`] |
| **brand** | `string` | Product brand | [Optional] [Defaults to `undefined`] |
| **category** | `string` | Product category | [Optional] [Defaults to `undefined`] |
| **quantity** | `number` | Product quantity | [Optional] [Defaults to `undefined`] |
| **measure** | `number` | Product measure such as weight or volume | [Optional] [Defaults to `undefined`] |
| **unit** | `string` | Unit of product measure such as kg or l | [Optional] [Defaults to `undefined`] |
| **attributeCodes** | `string` | Attribute codes separated with commas to aggregate for product.  For example, GHG will return carbon footprint.  ENERC,FAT,FASAT,CHOAVL,SUGAR,FIBRC,PROT,NACL returns basic nutritional information. | [Optional] [Defaults to `undefined`] |
| **foodUnitAttributeCode** | `string` | Attribute code for food unit to use in attribute aggregation.  For example, PORTS is small portion, PORTM is medium portion and PORTL is large portion. | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;Product&gt;**](Product.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiProductIdGet

> Product apiProductIdGet(id, attributeCodes, foodUnitAttributeCode)



Returns product by id

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiProductIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // number | Product id to return
    id: 56,
    // string | Attribute codes to aggregate for product (optional)
    attributeCodes: attributeCodes_example,
    // string | Attribute code for food unit to use in attribute aggregation (optional)
    foodUnitAttributeCode: foodUnitAttributeCode_example,
  } satisfies ApiProductIdGetRequest;

  try {
    const data = await api.apiProductIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` | Product id to return | [Defaults to `undefined`] |
| **attributeCodes** | `string` | Attribute codes to aggregate for product | [Optional] [Defaults to `undefined`] |
| **foodUnitAttributeCode** | `string` | Attribute code for food unit to use in attribute aggregation | [Optional] [Defaults to `undefined`] |

### Return type

[**Product**](Product.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiProductPost

> Product apiProductPost(product)



Creates a new product

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiProductPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // Product (optional)
    product: ...,
  } satisfies ApiProductPostRequest;

  try {
    const data = await api.apiProductPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **product** | [Product](Product.md) |  | [Optional] |

### Return type

[**Product**](Product.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Product added |  -  |
| **500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiReceiptDataEditedIdPost

> Receipt apiReceiptDataEditedIdPost(id)



Creates receipt from edited receipt file

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiReceiptDataEditedIdPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // number | Receipt ID
    id: 56,
  } satisfies ApiReceiptDataEditedIdPostRequest;

  try {
    const data = await api.apiReceiptDataEditedIdPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` | Receipt ID | [Defaults to `undefined`] |

### Return type

[**Receipt**](Receipt.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiReceiptDataOriginalIdPost

> Receipt apiReceiptDataOriginalIdPost(id)



Creates receipt from original receipt file

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiReceiptDataOriginalIdPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // number | Receipt ID
    id: 56,
  } satisfies ApiReceiptDataOriginalIdPostRequest;

  try {
    const data = await api.apiReceiptDataOriginalIdPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` | Receipt ID | [Defaults to `undefined`] |

### Return type

[**Receipt**](Receipt.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiReceiptEditPost

> string apiReceiptEditPost(src, id)



Uploads and crops a receipt file

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiReceiptEditPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // Blob (optional)
    src: BINARY_DATA_HERE,
    // number (optional)
    id: 8.14,
  } satisfies ApiReceiptEditPostRequest;

  try {
    const data = await api.apiReceiptEditPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **src** | `Blob` |  | [Optional] [Defaults to `undefined`] |
| **id** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `text/plain`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Receipt uploaded |  -  |
| **500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiReceiptOriginalPost

> string apiReceiptOriginalPost(src, id)



Uploads an original receipt file

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiReceiptOriginalPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // Blob (optional)
    src: BINARY_DATA_HERE,
    // number (optional)
    id: 8.14,
  } satisfies ApiReceiptOriginalPostRequest;

  try {
    const data = await api.apiReceiptOriginalPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **src** | `Blob` |  | [Optional] [Defaults to `undefined`] |
| **id** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `text/plain`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Receipt uploaded |  -  |
| **500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiRecommendationGet

> Array&lt;Recommendation&gt; apiRecommendationGet()



Returns a list of recommendations

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiRecommendationGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.apiRecommendationGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;Recommendation&gt;**](Recommendation.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiSourceGet

> Array&lt;Source&gt; apiSourceGet()



Returns list of sources

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiSourceGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.apiSourceGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;Source&gt;**](Source.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiTransactionCsvPost

> Array&lt;Product&gt; apiTransactionCsvPost(template, transactions)



Creates new products from CSV file

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiTransactionCsvPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string | CSV template (sryhma, kesko, default) (optional)
    template: template_example,
    // Blob (optional)
    transactions: BINARY_DATA_HERE,
  } satisfies ApiTransactionCsvPostRequest;

  try {
    const data = await api.apiTransactionCsvPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **template** | `string` | CSV template (sryhma, kesko, default) | [Optional] [Defaults to `undefined`] |
| **transactions** | `Blob` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;Product&gt;**](Product.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Products added |  -  |
| **500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiTransactionPost

> Transaction apiTransactionPost(transaction)



Creates a new transaction

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiTransactionPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // Transaction (optional)
    transaction: ...,
  } satisfies ApiTransactionPostRequest;

  try {
    const data = await api.apiTransactionPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **transaction** | [Transaction](Transaction.md) |  | [Optional] |

### Return type

[**Transaction**](Transaction.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Transaction added |  -  |
| **500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

