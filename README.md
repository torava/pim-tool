# PIM Tool

An application for viewing diary files exported from [Fineli](https://fineli.fi/), the national Food Composition Database in Finland. Supports [PIM API](https://github.com/torava/pim-api) to view product information such as prices and environmental footprints in addition to nutrient values with coloring based on recommendations.

## Try out

Go to [https://pim-tool.s3.eu-central-1.amazonaws.com/index.html](https://pim-tool.s3.eu-central-1.amazonaws.com/index.html)

## Generate PIM API client

Clone PIM API and run following command:
```
./node_modules/.bin/openapi-generator-cli generate -i /path/to/swagger.full.json -g typescript-fetch -o src/generated/product-api
```
