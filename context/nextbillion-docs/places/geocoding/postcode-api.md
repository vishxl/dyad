# Geocode Postcode API

## Introduction

Geocode Postcode API is a geolocation tool that provides users with a simple way to retrieve the geographical coordinates and boundaries of a postal code or ZIP code. Additionally, users can provide location coordinates to get the postal code it belongs to.

The API has a range of potential use cases across multiple domains. In the e-commerce industry, it can be utilized to enhance the accuracy of shipping and delivery processes. Similarly, in the logistics and delivery sector, the API can assist with optimizing routes, resulting in faster deliveries. Online mapping services and location-based apps can leverage the API to recommend nearby businesses and attractions based on a user's geographical location. These are just a few examples of the practical applications of the API that can enhance user experiences in various domains.

POST

https://api.nextbillion.io/postalcode?key={your_api_key}

## Request Parameters

| Name  | Required | Format and Usage                                                                                    | Description                |
| ----- | -------- | --------------------------------------------------------------------------------------------------- | -------------------------- |
| `key` | Yes      | Type: `string`<br>Example: `Format: 32 character alphanumeric string<br>Usage:<br>key=YOUR_API_KEY` | API Key for authentication |

## Request Body

| Field        | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `postalcode` | string | Provide the postal code for which the information is needed. At least one of (`postalcode` + `country`) or `at` needs to be provided.<br>Please note that only 1 postal code can be requested [See this example](#note)                                                                                                                                                                                                                                                              |
| `country`    | string | country containing the postal code or the location. It is mandatory if `postalcode` is provided in the request.[See this example](#note). <br> Please check the [API Query Limits](#api-query-limits) section below for a list of the countries covered by the Geocode Postcode API. Users can provide either the name or the alpha-2/3 code as per the [ISO 3166-1 standard](https://en.wikipedia.org/wiki/ISO_3166-1) of a country covered by the API as input for this parameter. |
| `at`         | object | Location coordinates that you want to get the postal code of. If not providing `postalcode` in the request, `at` becomes mandatory.<br>Please note that only 1 point can be requested. [See this example](#note)                                                                                                                                                                                                                                                                     |
| `at.lat`     | number | latitude of the location                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `at.lng`     | number | longitude of the location                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `format`     | string | Specify the format in which the boundary details of the post code will be returned. Currently, only `geojson` format is supported. When specified, the boundary details will be returned in the "geojson" format. When not specified, the boundary details are returned in general format.                                                                                                                                                                                           |

### Note

- The user can include only the `at` parameter in the API request to obtain information about the postal code a specific geographic coordinate belongs to.  
  For example:

  ```json
  {
    "at": { "lat": 28.661332, "lng": 77.197106 }
  }
  ```

- To retrieve information about a specific postal code, include both the `postalcode` and the `country` parameter in the request.  
  For example:

  ```json
  {
    "postalcode": "110007",
    "country": "India"
  }
  ```

- We do not recommend using both `postalcode` and `at` together in a single request

## Response Schema

| Field                                                     | Type                      | Description                                                                                                                                                                                                                                                                                  |
| --------------------------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `warning`                                                 | array of string           | An object that contains details about the place that was provided in the input.                                                                                                                                                                                                              |
| `places`                                                  | object                    | An object that contains details about the place that was provided in the input.                                                                                                                                                                                                              |
| `places[].geopoint`                                       | object                    | Refers to the geographic coordinate denoting the center of the postal code in latitude, longitude format.                                                                                                                                                                                    |
| `places[].geopoint.lat`                                   | number                    | Latitude of the location.                                                                                                                                                                                                                                                                    |
| `places[].geopoint.lng`                                   | number                    | Longitude of the location.                                                                                                                                                                                                                                                                   |
| `places[].country`                                        | string                    | Name of the country associated with the geographic coordinate point / postal code provided in the API request                                                                                                                                                                                |
| `places[].countryCode`                                    | string                    | Returns the [alpha-3 ISO code](https://www.iban.com/country-codes) of the country containing the `postalcode` returned.                                                                                                                                                                      |
| `places[].state`                                          | string                    | Name of the state or province associated with the geographic coordinate point / postal code provided in the API request                                                                                                                                                                      |
| `places[].district`                                       | string                    | Name of the district or region associated with the geographic coordinate point / postal code provided in the API request                                                                                                                                                                     |
| `places[].subDistrict`                                    | string                    | Name of the sub-district or sub-region associated with the postal code or geographic coordinate point / postal code provided in the API request                                                                                                                                              |
| `places[].postalCode`                                     | string                    | Returns the postal code associated with the requested geographic coordinate point or the postal code itself as provided in the input API request.                                                                                                                                            |
| `places[].address`                                        | string                    | Returns the address of the postal code provided.                                                                                                                                                                                                                                             |
| `places[].distance`                                       | number                    | This property is returned only when the API is requested to fetch the postal code containing the location coordinate provided in the `at` input parameter. distance denotes the straight line distance, in meters, from the requested location coordinate to the postal code centroid.       |
| `places[].boundary`                                       | object                    | An object containing the boundary details of the postal code area                                                                                                                                                                                                                            |
| `places[].boundary.multiPolygon`                          | array of object           | An array of objects containing information about all the polygons forming the postal code area. In case, the postal code area is formed by multiple polygons not containing each other, a matching count of `polygon` objects will be returned.                                              |
| `places[].boundary.multiPolygon[].polygon`                | array of object           | An object containing the details of a single polygon that is a part of the postal code area. In case the postal code area contains other polygon(s), the details of such polygon(s) would be returned through an array of `points` object                                                    |
| `places[].boundary.multiPolygon[].polygon[].points`       | array of object           | Represents an array of geographic coordinates that define a `polygon` boundary.                                                                                                                                                                                                              |
| `places[].boundary.multiPolygon[].polygon[].points[].lat` | number                    | Latitude of the coordinate                                                                                                                                                                                                                                                                   |
| `places[].boundary.multiPolygon[].polygon[].points[].lng` | number                    | Longitude of the coordinate                                                                                                                                                                                                                                                                  |
| `places[].boundary.type`                                  | string                    | Type of the geoJSON object. This parameter is returned when the `format` field is set to `geojson` in the input request, otherwise it is not present in the response. The contents of this object follow the [geoJSON standard](https://datatracker.ietf.org/doc/html/rfc7946).              |
| `places[].boundary.geometry`                              | object                    | An object with geoJSON details of the boundary. This object is returned when the format field is set to geojson in the input request, otherwise it is not present in the response. The contents of this object follow the [geoJSON standard](https://datatracker.ietf.org/doc/html/rfc7946). |
| `places[].boundary.geometry.type`                         | string                    | Type of the geoJSON geometry.                                                                                                                                                                                                                                                                |
| `places[].boundary.geometry.coordinates`                  | array of array of numbers | An array of coordinates in the [longitude, latitude] format, representing the coordinates points which lie on the boundary of the postal code area.                                                                                                                                          |
| `places[].boundary.properties`                            | string                    | Property associated with the geoJSON shape.                                                                                                                                                                                                                                                  |

## Sample Request

```bash
curl --location --request POST 'https://api.nextbillion.io/postalcode?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "at": { "lat": 34.007578, "lng": -118.271713 },
  "country": "USA"
}'
```

## Sample Response

```json
{
  "places": [
    {
      "geopoint": {
        "lat": 34.00713949,
        "lng": -118.2587382
      },
      "country": "United States",
      "countryCode": "USA",
      "state": "California",
      "district": "Los Angeles",
      "postalCode": "90011",
      "address": "Los Angeles, Los Angeles, California, United States, 90011",
      "distance": 1197,
      "boundary": {
        "multiPolygon": [
          {
            "polygon": [
              {
                "points": [
                  {
                    "lat": 34.016452,
                    "lng": -118.27402099
                  },
                  {
                    "lat": 34.018654,
                    "lng": -118.27262499
                  },
                  {
                    "lat": 34.018818,
                    "lng": -118.26837099
                  },
                  {
                    "lat": 34.020256,
                    "lng": -118.27160099
                  },
                  {
                    "lat": 34.024847,
                    "lng": -118.26867099
                  },
                  {
                    "lat": 34.027311,
                    "lng": -118.26709899
                  },
                  {
                    "lat": 34.028413,
                    "lng": -118.26491999
                  },
                  {
                    "lat": 34.028952,
                    "lng": -118.26605099
                  },
                  {
                    "lat": 34.030991,
                    "lng": -118.26467899
                  },
                  {
                    "lat": 34.029962,
                    "lng": -118.26244699
                  },
                  {
                    "lat": 34.027467,
                    "lng": -118.26290499
                  },
                  {
                    "lat": 34.027703,
                    "lng": -118.26275699
                  },
                  {
                    "lat": 34.028606,
                    "lng": -118.26218199
                  },
                  {
                    "lat": 34.027571,
                    "lng": -118.25995599
                  },
                  {
                    "lat": 34.026742,
                    "lng": -118.26054299
                  },
                  {
                    "lat": 34.02588,
                    "lng": -118.25855999
                  },
                  {
                    "lat": 34.027631,
                    "lng": -118.25743699
                  },
                  {
                    "lat": 34.026748,
                    "lng": -118.25553399
                  },
                  {
                    "lat": 34.025872,
                    "lng": -118.25611599
                  },
                  {
                    "lat": 34.025845,
                    "lng": -118.25358699
                  },
                  {
                    "lat": 34.023027,
                    "lng": -118.24804199
                  },
                  {
                    "lat": 34.021208,
                    "lng": -118.24659099
                  },
                  {
                    "lat": 34.021421,
                    "lng": -118.245184
                  },
                  {
                    "lat": 34.020172,
                    "lng": -118.24617899
                  },
                  {
                    "lat": 34.019004,
                    "lng": -118.24413799
                  },
                  {
                    "lat": 34.020805,
                    "lng": -118.24399499
                  },
                  {
                    "lat": 34.020595,
                    "lng": -118.24277199
                  },
                  {
                    "lat": 34.018717,
                    "lng": -118.24285599
                  },
                  {
                    "lat": 34.018754,
                    "lng": -118.243023
                  },
                  {
                    "lat": 34.014286,
                    "lng": -118.24323699
                  },
                  {
                    "lat": 34.01385,
                    "lng": -118.24487699
                  },
                  {
                    "lat": 34.013201,
                    "lng": -118.24324699
                  },
                  {
                    "lat": 34.003917,
                    "lng": -118.24337599
                  },
                  {
                    "lat": 33.989443,
                    "lng": -118.24313899
                  },
                  {
                    "lat": 33.989498,
                    "lng": -118.25643599
                  },
                  {
                    "lat": 33.989317,
                    "lng": -118.25643599
                  },
                  {
                    "lat": 33.989227,
                    "lng": -118.26518499
                  },
                  {
                    "lat": 33.989205,
                    "lng": -118.27052799
                  },
                  {
                    "lat": 33.986067,
                    "lng": -118.27052599
                  },
                  {
                    "lat": 33.986143,
                    "lng": -118.27180699
                  },
                  {
                    "lat": 33.9892,
                    "lng": -118.27180799
                  },
                  {
                    "lat": 33.989191,
                    "lng": -118.27392799
                  },
                  {
                    "lat": 33.995227,
                    "lng": -118.27394799
                  },
                  {
                    "lat": 33.996514,
                    "lng": -118.27284399
                  },
                  {
                    "lat": 33.996505,
                    "lng": -118.27395299
                  },
                  {
                    "lat": 34.002014,
                    "lng": -118.27397199
                  },
                  {
                    "lat": 34.003835,
                    "lng": -118.27278999
                  },
                  {
                    "lat": 34.003831,
                    "lng": -118.27342799
                  },
                  {
                    "lat": 34.005683,
                    "lng": -118.27398399
                  },
                  {
                    "lat": 34.013057,
                    "lng": -118.27400899
                  },
                  {
                    "lat": 34.016452,
                    "lng": -118.27402099
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  ]
}
```

## API Query Limits

- Only 1 `postalcode` is allowed per request.
- Only 1 `at` location is allowed per request.
- The Geocode Postcode API supports the following countries currently:
  - United States of America
  - India
  - United Kingdom
  - Netherlands
  - Austria
  - Germany
  - Indonesia
  - France
  - Singapore
  - Philippines
  - Canada
  - Australia
  - New Zealand
  - Italy
  - Brazil
  - Mexico
  - Spain

- Nextbillion.ai allows a maximum rate limit of 2400 queries per minute or 40 queries/second for continuous requests.
  _Note_: We can increase the quota if needed on request. Contact [support@nextbillion.ai](mailto:support@nextbillion.ai) for more details

## API Error Codes

| Response Code | Description                                                      | Additional Notes                                                                                                                                           |
| ------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200           | Normal success case.                                             | Normal success case.                                                                                                                                       |
| 400           | Input validation failed.                                         | There is a missing or invalid parameter or a parameter with an invalid value type is added to the request.                                                 |
| 401           | APIKEY not supplied or invalid.                                  | This error occurs when the wrong API key is passed in the request or the key is missing altogether                                                         |
| 403           | APIKEY is valid but does not have access to requested resources. | You might be querying for a geographical region which is not valid for your account, or requesting a service which is not enabled for you.                 |
| 404           | Requested host/path not found.                                   | This error occurs when a malformed hostname is used.                                                                                                       |
| 422           | Could not process the request.                                   | The request could not be processed due to inappropriate input. Please verify the accuracy of the postal code or the location.                              |
| 429           | Too many requests.                                               | QPM reached or API request count quota reached.                                                                                                            |
| 500           | Internal Service error.                                          | There was an internal issue with NextBillion.ai services. You can reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) for an explanation. |
