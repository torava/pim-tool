
# ProductContribution


## Properties

Name | Type
------------ | -------------
`id` | number
`amount` | number
`unit` | string
`category` | [Category](Category.md)
`product` | [Product](Product.md)
`contribution` | [Category](Category.md)

## Example

```typescript
import type { ProductContribution } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "amount": null,
  "unit": null,
  "category": null,
  "product": null,
  "contribution": null,
} satisfies ProductContribution

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProductContribution
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


