
# Party


## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`vat` | string
`streetName` | string
`streetNumber` | string
`postalCode` | string
`city` | string
`phoneNumber` | string
`email` | string
`transaction` | [Transaction](Transaction.md)

## Example

```typescript
import type { Party } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "vat": null,
  "streetName": null,
  "streetNumber": null,
  "postalCode": null,
  "city": null,
  "phoneNumber": null,
  "email": null,
  "transaction": null,
} satisfies Party

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Party
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


