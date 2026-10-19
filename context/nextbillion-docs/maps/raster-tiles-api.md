# Raster Tiles API

## Introduction

The Raster Tiles API serves raster tiles from NextBillion.ai raster tilesets. Raster data refers to pixel-based data format in which data is stored in a grid structure. Each pixel, or unit of information, has the same size and shape, but varies in value. Raster Tiles are images created in raster data format. These tiles can be used to display maps as a grid of images which can be loaded on map-based tools or platforms.

GET

https://api.nextbillion.io/maps/{mapId}/{tileSize}/{z}/{x}/{y}{scale}.{format}?key={your_api_key}

## Request Parameters

### Query Parameter

| Name  | Required | Format and Usage                                                                       | Description                                                                        |
| ----- | -------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`<br>Format: `32 character alphanumeric string`<br>Example: `key=API_KEY` | A key is a unique identifier that is required to authenticate a request to an API. |

### Path Parameters

| Name       | Required | Format and Usage                                                  | Description                                                                                                                                                                                                                                     |
| ---------- | -------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mapId`    | Yes      | Type: `string`<br>Allowed values: `hybrid`, `dark`, `default`     | Identifier of the maps. Please check with NextBillion at [support@nextbillion.ai](mailto:support@nextbillion.ai) for any other custom values for your key.                                                                                      |
| `tileSize` | Yes      | Type: `integer`<br>Allowed values: `256`<br>Example: tileSize=256 | Specify the tileSize. Only 256 is the accepted value.                                                                                                                                                                                           |
| `z`        | Yes      | Type: `integer`<br>Example: 12                                    | Specifies the tile's zoom level. You can use between 0 to 22 as zoom levels.                                                                                                                                                                    |
| `x`        | Yes      | Type: `integer`<br>Example: 2929                                  | Specifies the tile's column. Please note that only the values less than 2^z are valid for this parameter.                                                                                                                                       |
| `y`        | Yes      | Type: `integer`<br>Example: 1898                                  | Specifies the tile's row. Please note that only the values less than 2^z are valid for this parameter.                                                                                                                                          |
| `scale`    | Yes      | Type: `string`<br>Allowed values: `@2x`                           | Use “@2x” to get “retina”/HiDPI image.                                                                                                                                                                                                          |
| `format`   | Yes      | Type: `string`<br>Allowed values: `jpg`                           | The format of the tile image to be returned in the response. NextBillion supports `jpg` format by default. In order to get `png` and `webp` formats, pleaser reach out at [support@nextbillion.ai](mailto:support@nextbillion.ai) to know more. |

## Sample Request

```bash
curl --location 'https://api.nextbillion.io/maps/dark/256/7/29/51.jpg?key=<your_api_key>'
```

## Sample Response

![documentation image](https://static.nextbillion.io/docs-next/docs/maps/api/raster-maptile-sample.webp)

## API Query Limits

NextBillion.ai allows a maximum rate limit of 6000 queries per minute or 100 queries/second for continuous requests.
Note: We can increase the quota if needed, on request. Contact [support@nextbillion.ai](mailto:support@nextbillion.ai) for more details.

## API Error Codes

| Response code | Description                                                     | Additional notes                                                                                                                                                |
| ------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200           | Normal success case.                                            | Normal success case.                                                                                                                                            |
| 400           | Input validation failed.                                        | There is a missing or an invalid parameter or a parameter with an invalid value type is added to the request.                                                   |
| 401           | APIKEY not supplied or invalid                                  | This error occurs when the wrong API key is passed in the request or the key is missing altogether                                                              |
| 403           | APIKEY is valid but does not have access to requested resources | You might be querying for a geographical region which is not valid for your account, or requesting a service which is not enabled for you.                      |
| 404           | Requested host/path not found                                   | This error occurs when a malformed hostname is used.                                                                                                            |
| 414           | Request is too long                                             | This error occurs when the URI is too long. Maximum allowed length is 8192 bytes.                                                                               |
| 422           | Could not process the request                                   | The requested tiles were not found. Please check the input request. Reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) if the issue persists. |
| 429           | Too many requests                                               | QPM limit or API usage quota reached.                                                                                                                           |
| 500           | Internal Service error.                                         | There was an internal issue with NextBillion.ai services. You can reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) for an explanation.      |
