
# Transaction


## Properties

Name | Type
------------ | -------------
`id` | number
`totalPrice` | number
`totalPriceRead` | number
`date` | string
`party` | [Party](Party.md)
`group` | [Group](Group.md)
`receipts` | [Array&lt;Receipt&gt;](Receipt.md)
`items` | [Array&lt;Item&gt;](Item.md)

## Example

```typescript
import type { Transaction } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "totalPrice": null,
  "totalPriceRead": null,
  "date": null,
  "party": null,
  "group": null,
  "receipts": null,
  "items": null,
} satisfies Transaction

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Transaction
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


