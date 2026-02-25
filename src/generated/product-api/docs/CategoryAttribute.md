
# CategoryAttribute


## Properties

Name | Type
------------ | -------------
`id` | number
`value` | number
`unit` | string
`type` | string
`category` | [Category](Category.md)
`attribute` | [Attribute](Attribute.md)
`sources` | [Array&lt;CategoryAttributeSource&gt;](CategoryAttributeSource.md)

## Example

```typescript
import type { CategoryAttribute } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "value": null,
  "unit": null,
  "type": null,
  "category": null,
  "attribute": null,
  "sources": null,
} satisfies CategoryAttribute

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CategoryAttribute
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


