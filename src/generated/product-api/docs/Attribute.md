
# Attribute


## Properties

Name | Type
------------ | -------------
`id` | number
`code` | string
`name` | [AttributeName](AttributeName.md)
`parent` | [Attribute](Attribute.md)
`parentId` | number

## Example

```typescript
import type { Attribute } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "code": null,
  "name": null,
  "parent": null,
  "parentId": null,
} satisfies Attribute

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Attribute
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


