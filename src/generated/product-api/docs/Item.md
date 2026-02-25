
# Item


## Properties

Name | Type
------------ | -------------
`id` | number
`itemNumber` | string
`text` | string
`price` | number
`currency` | string
`quantity` | number
`measure` | number
`unit` | string
`transaction` | [Transaction](Transaction.md)
`product` | [Product](Product.md)

## Example

```typescript
import type { Item } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "itemNumber": null,
  "text": null,
  "price": null,
  "currency": null,
  "quantity": null,
  "measure": null,
  "unit": null,
  "transaction": null,
  "product": null,
} satisfies Item

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Item
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


