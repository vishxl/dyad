# Vector Tiles API

## Introduction

The Vector Tiles API serves vector tiles from NextBillion.ai’s vector tile sets. A vector tile contains the vector data about the geometries and metadata - like road names, place names etc in the form of points, lines and polygons. These tiles can be used as a source for styling or for creating an interactive map experience for your users.

GET

https://api.nextbillion.io/tiles/{tilesId}/{z}/{x}/{y}.{format}?key={your_api_key}

## Request Parameters

### Query Parameter

| Name  | Required | Format and Usage                                                                   | Description                                                                         |
| ----- | -------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: key=API_KEY | A key is a unique identifier that is required to authenticate a request to the API. |

### Path Parameters

| Name      | Required | Format and Usage                      | Description                                                                                              |
| --------- | -------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `tilesId` | Yes      | Type: `string`<br>Default: `v3`       | Unique identifier for the vector tile set. The identifier for Nextbillion.ai's default tile set is `v3`. |
| `z`       | Yes      | Type: `integer`<br>Example: 12        | Specifies the tile's zoom level. You can use values between 0 to 15 as zoom levels.                      |
| `x`       | Yes      | Type: `integer`<br>Example: 1898      | Specifies the tile's column. The maximum value is 2<sup>z</sup>.                                         |
| `y`       | Yes      | Type: `integer`<br>Example: 1898      | Specifies the tile's row. The maximum value is 2<sup>z</sup>.                                            |
| `format`  | Yes      | Type: `string`<br>Example: format=pbf | Specifies the format of the tiles to be returned.                                                        |

## Sample Request

```bash
curl --location 'https://api.nextbillion.io/tiles/v3/12/2929/1898.pbf?key=<your_api_key>'
```

## Sample Response

![documentation image](https://static.nextbillion.io/docs-next/docs/maps/api/maptile-default-sample.webp)

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
