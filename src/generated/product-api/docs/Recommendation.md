
# Recommendation


## Properties

Name | Type
------------ | -------------
`id` | number
`minValue` | number
`maxValue` | number
`unit` | string
`perUnit` | string
`minimumAge` | number
`maximumAge` | number
`sex` | string
`weight` | number
`pav` | boolean
`pal` | number
`note` | string
`attribute` | [Attribute](Attribute.md)

## Example

```typescript
import type { Recommendation } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "minValue": null,
  "maxValue": null,
  "unit": null,
  "perUnit": null,
  "minimumAge": null,
  "maximumAge": null,
  "sex": null,
  "weight": null,
  "pav": null,
  "pal": null,
  "note": null,
  "attribute": null,
} satisfies Recommendation

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Recommendation
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


