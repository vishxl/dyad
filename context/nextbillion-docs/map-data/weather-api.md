# Weather API

## Introduction

The NextBillion.ai Weather API delivers real-time as well as predicted weather information for a specified region. API response provides radar-based current and forecasted precipitation details, using GeoJSON polygons. These polygons delineate the areas affected by particular weather conditions across various time intervals.

GET

https://api.nextbillion.io/map/weather?key={your_api_key}&region={region}

### Request Parameters

| Name     | Required | Format and Usage                                                               | Description                                                                                                                                                                                                             |
| -------- | -------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`    | Yes      | Type: `string`<br>Format: 32 character alphanumeric string                     | A key is a unique identifier that is required to authenticate a request to the API.                                                                                                                                     |
| `region` | Yes      | Type: `string`<br>Allowed values: `europe`, `nam`, `usa`, `australia`, `latam` | Specifies the region for which the weather polygons are to be fetched. Allowed value details: `europe`: Europe; `nam`: North America; `usa`: United States of America; `australia`: Australia; `latam`: Latin Americas. |

### Response Schema

| Field                             | Type                     | Description                                                                                                                                                                                |
| --------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `features`                        | array of object          | A collection of [geoJSON features](https://datatracker.ietf.org/doc/html/rfc7946#section-3.3) containing weather condition details for the requested region.                               |
| `features[].bbox`                 | string                   | Specifies the bounding box, in format of min_long, min_lat, max_long, max_lat, containing the weather polygon.                                                                             |
| `features[].geometry`             | object                   | An object with geoJSON details of the weather polygon. The contents of this object follow the [geoJSON standard](https://datatracker.ietf.org/doc/html/rfc7946#section-3.2).               |
| `features[].geometry.type`        | string                   | Type of the geoJSON geometry. Will always be `Polygon`.                                                                                                                                    |
| `features[].geometry.coordinates` | array of array of number | An array of coordinates in the \[longitude, latitude\] format, representing the polygon boundary.                                                                                          |
| `features[].id`                   | string                   | Specifies the geoJSON feature ID.                                                                                                                                                          |
| `features[].properties`           | object                   | An object containing useful details about the weather pattern type, intensity and its impacted area.                                                                                       |
| `features[].properties.area`      | number                   | Returns the area of the weather polygon in square kilometers (km²).                                                                                                                        |
| `features[].properties.category`  | string                   | Returns the category of the weather polygon, e.g., "precip". The precipitation type is indicated in `type`.                                                                                |
| `features[].properties.type`      | string                   | Returns the type of the weather polygon. Supported values: `rain`, `snow`, `mixed` and `hail`                                                                                              |
| `features[].properties.children`  | array of string          | Returns a list of Feature-Ids that represent polygons of the same `category` and `type` with the next higher `level` which lie inside the given polygon. An empty array means no children. |
| `features[].properties.countries` | array of string          | The list of countries, represented as [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) alpha-3 country codes, that intersect with the weather polygon.                               |
| `features[].properties.level`     | number                   | Returns the level of the weather atom, i.e., a numeric value describing its magnitude. e.g. for the "precip” category, a level of “2.0” indicates the precipitation levels.                |
| `features[].properties.parent`    | string                   | A single Feature-Id that represents the polygon of the next lower `level` containing this weather polygon. An empty string means no parent.                                                |
| `features[].properties.uniqueId`  | string                   | A unique and stable ID of the current weather polygon.                                                                                                                                     |
| `features[].type`                 | string                   | Indicates the type of [geoJSON structure](https://datatracker.ietf.org/doc/html/rfc7946#section-3.2). Will always be `Feature` .                                                           |
| `properties`                      | object                   | Contains time related details for the `FeatureCollection` returned.                                                                                                                        |
| `properties.creationTime`         | string                   | Returns the time of the request in UTC as an ISO-8601-compliant date-time string of the form YYYY-MM-DDThh:mm:ssTZD                                                                        |
| `properties.forecastOffset`       | string                   | Returns the forecast horizon of the weather polygon, in minutes. Zero represents present time.                                                                                             |
| `properties.rootTimeStamp`        | string                   | Returns the time at which the weather polygons were measured/predicted in UTC as an ISO-8601-compliant date-time string of the form YYYY-MM-DDThh:mm:ssTZD                                 |
| `properties.timeStamp`            | string                   | Returns the time of which the weather polygons refer to (may be in the future) in UTC as an ISO-8601-compliant date-time string of the form YYYY-MM-DDThh:mm:ssTZD                         |
| `type`                            | string                   | Indicates the type of [geoJSON structure](https://datatracker.ietf.org/doc/html/rfc7946#section-3.3). Will always be `FeatureCollection` .                                                 |

### Sample Request

```bash
curl --location 'https://api.nextbillion.io/map/weather?key=<your_api_key>&region=europe'
```

### Sample Response

```json
{
  "features": [
    {
      "features": [
        {
          "bbox": [-1.61, 47.778, 0.009, 48.608],
          "geometry": {
            "coordinates": [
              [
                [-1.216, 47.778],
                [-1.116, 47.778],
                [-0.996, 47.828],
                [-0.766, 47.828],
                [-0.476, 48.068],
                [-0.096, 48.248],
                [0.009, 48.373],
                [-0.166, 48.498],
                [-0.446, 48.498],
                [-0.566, 48.568],
                [-5.554, 40.512]
              ]
            ],
            "type": "Polygon"
          },
          "id": "110",
          "properties": {
            "area": 238635.535,
            "category": "precip",
            "children": [
              "113",
              "136",
              "116",
              "161",
              "177",
              "135",
              "152",
              "143",
              "183",
              "130",
              "187",
              "114",
              "176",
              "167",
              "185",
              "155",
              "189",
              "125"
            ],
            "countries": ["ESP", "FRA", "PRT"],
            "level": 0.086,
            "parent": "",
            "type": "rain",
            "uniqueId": "21f0f1dab074a5bb"
          },
          "type": "Feature"
        },
        {
          "bbox": [1.278, 41.641, 3.398, 42.521],
          "geometry": {
            "coordinates": [
              [
                [1.973, 41.641],
                [2.213, 41.681],
                [2.523, 41.681],
                [2.613, 41.801],
                [1.968, 41.646]
              ]
            ],
            "type": "Polygon"
          },
          "id": "231",
          "properties": {
            "area": 8089.19,
            "category": "precip",
            "children": ["244"],
            "countries": ["ESP", "FRA"],
            "level": 2.05,
            "parent": "186",
            "type": "rain",
            "uniqueId": "e05d7d6545c81761"
          },
          "type": "Feature"
        },
        {
          "bbox": [4.907, 41.851, 5.187, 42.131],
          "geometry": {
            "coordinates": [
              [
                [5.132, 41.851],
                [5.167, 41.876],
                [5.187, 41.976],
                [5.157, 42.076],
                [5.082, 42.131],
                [4.982, 42.111],
                [4.907, 42.016],
                [4.917, 41.956],
                [5.127, 41.856]
              ]
            ],
            "type": "Polygon"
          },
          "id": "111",
          "properties": {
            "area": 480.992,
            "category": "precip",
            "children": [],
            "countries": [],
            "level": 0.086,
            "parent": "",
            "type": "rain",
            "uniqueId": "9a3e07adec7c78b9"
          },
          "type": "Feature"
        },
        {
          "bbox": [8.646, 38.143, 10.765, 39.812],
          "geometry": {
            "coordinates": [
              [
                [9.32, 38.143],
                [9.75, 38.173],
                [10.26, 38.313],
                [10.44, 38.403],
                [10.64, 38.553],
                [10.675, 38.598],
                [10.595, 38.738],
                [9.97, 38.603]
              ]
            ],
            "type": "Polygon"
          },
          "id": "232",
          "properties": {
            "area": 23490.55,
            "category": "precip",
            "children": ["236", "246", "239", "237"],
            "countries": ["ITA"],
            "level": 2.05,
            "parent": "190",
            "type": "rain",
            "uniqueId": "3f06924971ded9d6"
          },
          "type": "Feature"
        }
      ],
      "properties": {
        "creationTime": "2026-03-06T05:18:01.734Z",
        "forecastOffset": 0,
        "rootTimeStamp": "2026-03-06T05:15:00.00Z",
        "timeStamp": "2026-03-06T05:15:00.00Z"
      },
      "type": "FeatureCollection"
    }
  ]
}
```

## API Query Limits

NextBillion.ai allows a maximum rate limit of 6000 queries per minute or 100 queries/second for continuous requests.
_Note_: We can increase the quota if needed on request. Contact [support@nextbillion.ai](mailto:support@nextbillion.ai) for more details.

## API Error Codes

| Response code | Description                                                     | Additional notes                                                                                                                                           |
| ------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200           | Normal success case.                                            | Normal success case.                                                                                                                                       |
| 400           | Input validation failed.                                        | There is a missing or an invalid parameter or a parameter with an invalid value type is added to the request.                                              |
| 401           | APIKEY not supplied or invalid                                  | This error occurs when the wrong API key is passed in the request or the key is missing altogether.                                                        |
| 403           | APIKEY is valid but does not have access to requested resources | You might be querying for a geographical region which is not valid for your account or requesting a service which is not enabled for you.                  |
| 404           | Requested host/path not found                                   | This error occurs when a malformed hostname is used.                                                                                                       |
| 422           | Could not process the request                                   | A feasible solution could not be generated for the given set of locations or parameter configuration.                                                      |
| 429           | Too many requests                                               | QPM reached or API request count quota reached.                                                                                                            |
| 500           | Internal Service error.                                         | There was an internal issue with NextBillion.ai services. You can reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) for an explanation. |
