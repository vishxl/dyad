# Batch Geocode API

## Introduction

NextBillion.ai Batch Geocode API allows searching for multiple known places using a single request. It can take up to 100 search queries and responds with matching place results for each of the search queries. The service accepts any free-form texts or known place names in the request body, to retrieve relevant results. The results are ranked based on the search score of a place.

POST

https://api.nextbillion.io/geocode/batch?key={your_api_key}

The method enables searching for multiple known places in a single request. Provide up to 100 search queries to get a response with matching places for all provided queries. It accepts any free-form texts or known place names in the request body, to retrieve relevant results. The results are ranked based on the search score of a place.

## Request Parameters

| Name  | Required | Format and Usage                                                                     | Description                                                                         |
| ----- | -------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: `key=API_KEY` | A key is a unique identifier that is required to authenticate a request to the API. |

## Request Body

| Field      | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[].q`     | string  | Specify the free-text search query.<br>Please note that whitespace, urls, email addresses, or other out-of-scope queries will yield no results.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `[].at`    | string  | Specify the center of the search context expressed as coordinates.<br>Please note that one of "at", "in=circle" or "in=bbox" should be provided for relevant results.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `[].in`    | string  | Search within a geographic area. This is a hard filter. Results will be returned if they are located within the specified area.<br>A geographic area can be<br>\* a country (or multiple countries), provided as comma-separated [ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) country codes<br>The country codes are to be provided in all uppercase.<br>Format: `countryCode:{countryCode}[,{countryCode}]`<br>\* a circular area, provided as latitude, longitude, and radius (an integer with meters as unit)<br>Format: `circle:{latitude},{longitude};r={radius}`<br>\* a bounding box, provided as \_west longitude\_, \_south latitude\_, \_east longitude\_, \_north latitude\_<br>Format: `bbox:{west longitude},{south latitude},{east longitude},{north latitude}`<br>Please provide one of 'at', 'in=circle' or 'in=bbox' input for a relevant result.                                                                          |
| `[].types` | string  | Restricts results to the specified types. If omitted, results are not restricted by type. Please note that: <br>\* Allowed Values:<br> - `houseNumber`: Exact door point<br> - `addressBlock`: Address-range/segment match, including interpolated house numbers<br> - `street`: Street level only<br> - `intersection`: Cross street intersections<br> - `place`: Point of Interest<br> - `area`: A city\/district\/postal\/admin area<br>\* For range based addresses, such as "600-699 Golden Gate Ave", use `types=addressBlock` to retrieve address-range or segment matches. Exact door-point addresses are excluded from range interpolation, so `types=addressBlock` with an exact single-address query can match same-numbered ranges in other cities.<br>\* `intersection` results are returned only when explicitly requested. <br>\* If invalid values are specified then the service returns an error.<br><br> Example: `types=houseNumber,addressBlock` |
| `[].limit` | integer | Maximum number of results to be returned. Please note that the minimum value that can be provided is 1 and the maximum that can be provided is 100.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `[].lang`  | string  | Select the language to be used for result rendering from a list of [BCP 47](https://en.wikipedia.org/wiki/IETF_language_tag) compliant language codes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

## Response Schema

| Field                                           | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`                                         | array of object | The results are presented as a JSON list of candidates in ranked order (most-likely to least-likely) based on the matched location criteria.                                                                                                                                                                                                                                                                                                                                                                                                       |
| `items[].title`                                 | string          | The localized display name of this result item.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `items[].id`                                    | string          | The unique identifier for the result item.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `items[].type`                                  | string          | Returns the geographical category that this result belongs to, hence implying the granularity of the match. When the result classification is available, it will always be one of `houseNumber` (exact door-point address), `addressBlock` (address-range or segment match, including single numbers resolved by range interpolation), `street` (street-level only), `intersection` (cross-street), `place` (POI), `area` (locality, administrative area, or postal area). If the classification is not available then this field is not returned. |
| `items[].address`                               | object          | Postal address of the result item.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `items[].address.label`                         | string          | Assembled address value built out of the address components according to the regional postal rules. These are the same rules for all endpoints. It may not include all the input terms.                                                                                                                                                                                                                                                                                                                                                            |
| `items[].address.countryCode`                   | string          | A three-letter country code.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `items[].address.countryName`                   | string          | The localised country name.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `items[].address.stateCode`                     | string          | A country specific state code or state name abbreviation. For example, in the United States it is the two letter state abbreviation: "CA" for California.                                                                                                                                                                                                                                                                                                                                                                                          |
| `items[].address.state`                         | string          | The state division of a country.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `items[].address.county`                        | string          | A division of a state; typically, a secondary-level administrative division of a country or equivalent.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `items[].address.city`                          | string          | The name of the primary locality of the place.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `items[].address.district`                      | string          | A division of city; typically an administrative unit within a larger city or a customary name of a city's neighborhood.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `items[].address.street`                        | string          | Name of street of the returned place, if available.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `items[].address.postalCode`                    | string          | An alphanumeric string included in a postal address to facilitate mail sorting, such as post code, postcode, or ZIP code.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `items[].address.houseNumber`                   | string          | House number of the returned place, if available.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `items[].scoring`                               | object          | Score of the result. A higher score indicates a closer match.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `items[].scoring.queryScore`                    | number          | A score, out of 1, indicating how closely the result matches with the provided query `q` .                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `items[].scoring.fieldScore`                    | object          | A breakdown of how closely individual field of the result matched with the provided query `q`.                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `items[].position`                              | object          | Returns the location coordinates of the result.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `items[].position.lat`                          | string          | The latitude of the searched place.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `items[].position.lng`                          | string          | The longitude of the searched place.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `items[].access`                                | object          | An array returning the location coordinates of all the access points of the search result.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `items[].access.lat`                            | number          | The latitude of the access point of the search result.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `items[].access.lng`                            | number          | The longitude of the access point of the search result.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `items[].distance`                              | integer         | The distance "as the crow flies" from the search center to this result item in meters.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `items[].mapView`                               | object          | The bounding box enclosing the geometric shape (area or line) that an individual result covers. `place` typed results have no `mapView`.                                                                                                                                                                                                                                                                                                                                                                                                           |
| `items[].mapView.west`                          | string          | Longitude of the western-side of the box.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `items[].mapView.south`                         | string          | Longitude of the southern-side of the box.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `items[].mapView.east`                          | string          | Longitude of the eastern-side of the box.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `items[].mapView.north`                         | string          | Longitude of the northern-side of the box.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `items[].addressRanges`                         | object          | Address-range details returned only for `addressBlock` results when available. For a block-range query, `position` is one end of the segment; the midpoint of `addressRanges.from` and `addressRanges.to` best represents the whole block.                                                                                                                                                                                                                                                                                                         |
| `items[].addressRanges.rangeLeft`               | string          | House-number range on the left side of the street (assuming looking from the “from” end toward the “to” end), returned when available.                                                                                                                                                                                                                                                                                                                                                                                                             |
| `items[].addressRanges.rangeRight`              | string          | House-number range on the right side of the street (assuming looking from the “from” end toward the “to” end), returned when available.                                                                                                                                                                                                                                                                                                                                                                                                            |
| `items[].addressRanges.from`                    | object          | Start point of the covered street segment.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `items[].addressRanges.from.lat`                | number          | Latitude for the start point of covered street segment.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `items[].addressRanges.from.lng`                | number          | Longitude for the start point of covered street segment.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `items[].addressRanges.to`                      | object          | End point of the covered street segment.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `items[].addressRanges.to.lat`                  | number          | Latitude for the end point of covered street segment.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `items[].addressRanges.to.lng`                  | number          | Longitude for the end point of covered street segment.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `items[].categories`                            | array of object | The list of categories assigned to this place.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `items[].categories[].id`                       | string          | Identifier number for an associated category.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `items[].categories[].name`                     | string          | Name of the place category in the result item language.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `items[].categories[].primary`                  | string          | Whether or not it is a primary category. This field is visible only when the value is 'true'.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `items[].contacts`                              | array of object | Contact information like phone, email or website.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `items[].contacts[].phone`                      | array of object |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `items[].contacts[].phone[].label`              | string          | Optional label for the contact string, such as "Customer Service" or "Pharmacy Fax".                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `items[].contacts[].phone[].value`              | string          | Contact information, as specified by the contact type.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `items[].contacts[].phone[].categories`         | array of object | The list of place categories this contact refers to.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `items[].contacts[].phone[].categories[].id`    | string          | Identifier number for an associated category. For example: "900-9300-0000"                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `items[].contacts[].mobile`                     | array of object |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `items[].contacts[].mobile[].label`             | string          | Optional label for the contact string, such as "Customer Service" or "Pharmacy Fax".                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `items[].contacts[].mobile[].value`             | string          | Contact information, as specified by the contact type.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `items[].contacts[].mobile[].categories`        | array of object | The list of place categories this contact refers to.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `items[].contacts[].mobile[].categories[].id`   | string          | Identifier number for an associated category. For example: "900-9300-0000"                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `items[].contacts[].tollFree`                   | array of object |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `items[].contacts[].tollFree[].label`           | string          | Optional label for the contact string, such as "Customer Service" or "Pharmacy Fax".                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `items[].contacts[].tollFree[].value`           | string          | Contact information, as specified by the contact type.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `items[].contacts[].tollFree[].categories`      | array of object | The list of place categories this contact refers to.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `items[].contacts[].tollFree[].categories[].id` | string          | Identifier number for an associated category. For example: "900-9300-0000"                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `items[].contacts[].fax`                        | array of object |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `items[].contacts[].fax[].label`                | string          | Optional label for the contact string, such as "Customer Service" or "Pharmacy Fax".                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `items[].contacts[].fax[].value`                | string          | Contact information, as specified by the contact type.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `items[].contacts[].fax[].categories`           | array of object | The list of place categories this contact refers to.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `items[].contacts[].fax[].categories[].id`      | string          | Identifier number for an associated category. For example: "900-9300-0000"                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `items[].contacts[].www`                        | array of object |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `items[].contacts[].www[].label`                | string          | Optional label for the contact string, such as "Customer Service" or "Pharmacy Fax".                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `items[].contacts[].www[].value`                | string          | Contact information, as specified by the contact type.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `items[].contacts[].www[].categories`           | array of object | The list of place categories this contact refers to.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `items[].contacts[].www[].categories[].id`      | string          | Identifier number for an associated category. For example: "900-9300-0000"                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `items[].contacts[].email`                      | array of object |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `items[].contacts[].email[].label`              | string          | Optional label for the contact string, such as "Customer Service" or "Pharmacy Fax".                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `items[].contacts[].email[].value`              | string          | Contact information, as specified by the contact type.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `items[].contacts[].email[].categories`         | array of object | The list of place categories this contact refers to.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `items[].contacts[].email[].categories[].id`    | string          | Identifier number for an associated category. For example: "900-9300-0000"                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

## Sample Request

```bash
curl --location 'https://api.nextbillion.io/h/geocode/batch?key=<your_api_key>'
--header 'Content-Type: application/json'
--data '[...]'
```

## Sample API Response

```json
[
  {
    "items": [
      {
        "title": "The White House",
        "id": "XOGTMt5u-Y6xOJMtBGDmCQ",
        "address": {
          "label": "The White House, 1600 Pennsylvania Ave Nw, Washington, DC 20500, United States",
          "countryCode": "USA",
          "countryName": "United States",
          "stateCode": "DC",
          "state": "District of Columbia",
          "county": "District of Columbia",
          "city": "Washington",
          "street": "Pennsylvania Ave Nw",
          "postalCode": "20500-0005",
          "houseNumber": "1600"
        },
        "scoring": {
          "queryScore": 0.56,
          "fieldScore": {
            "state": 1,
            "streets": [0.67],
            "houseNumber": 0.44,
            "postalCode": 0.5
          }
        },
        "position": {
          "lat": 38.8977,
          "lng": -77.03654
        },
        "access": [
          {
            "lat": 38.89877,
            "lng": -77.0366
          },
          {
            "lat": 38.89877,
            "lng": -77.03671
          },
          {
            "lat": 38.89877,
            "lng": -77.03746
          },
          {
            "lat": 38.89677,
            "lng": -77.03363
          }
        ],
        "mapView": {
          "west": -77.03969,
          "south": 38.89525,
          "east": -77.03339,
          "north": 38.90015
        },
        "categories": [
          {
            "id": "7376002",
            "name": "important tourist attraction, building",
            "primary": true
          }
        ],
        "contacts": [
          {
            "phone": [
              {
                "value": "+1 202-456-1111"
              }
            ],
            "www": [
              {
                "value": "www.whitehouse.gov"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "items": [
      {
        "title": "Empire State Building",
        "id": "5GjOCyXMUOsLhBw6vwpo_Q",
        "address": {
          "label": "Empire State Building, 350 5Th Ave, New York, NY 10118, United States",
          "countryCode": "USA",
          "countryName": "United States",
          "stateCode": "NY",
          "state": "New York",
          "county": "New York",
          "city": "New York",
          "district": "Manhattan",
          "street": "5Th Ave",
          "postalCode": "10118-0104",
          "houseNumber": "350"
        },
        "scoring": {
          "queryScore": 0.49,
          "fieldScore": {
            "streets": [0.73],
            "houseNumber": 0.33,
            "postalCode": 0.5
          }
        },
        "position": {
          "lat": 40.74816,
          "lng": -73.985
        },
        "access": [
          {
            "lat": 40.74808,
            "lng": -73.98482
          },
          {
            "lat": 40.74812,
            "lng": -73.98479
          },
          {
            "lat": 40.74815,
            "lng": -73.98594
          }
        ],
        "mapView": {
          "west": -73.98619,
          "south": 40.74726,
          "east": -73.98381,
          "north": 40.74906
        },
        "categories": [
          {
            "id": "7376002",
            "name": "important tourist attraction, building",
            "primary": true
          }
        ],
        "contacts": [
          {
            "phone": [
              {
                "value": "+1 212-736-3100"
              }
            ],
            "www": [
              {
                "value": "www.esbnyc.com"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "items": [
      {
        "title": "Whole Foods Market",
        "id": "7K48xVnDusK1oA6Udqrxmg",
        "address": {
          "label": "Whole Foods Market, 2001 Market Street, San Francisco, CA 94114, United States",
          "countryCode": "USA",
          "countryName": "United States",
          "stateCode": "CA",
          "state": "California",
          "county": "San Francisco",
          "city": "San Francisco",
          "street": "Market Street",
          "postalCode": "94114-1316",
          "houseNumber": "2001"
        },
        "scoring": {
          "queryScore": 0.58,
          "fieldScore": {
            "streets": [1],
            "houseNumber": 1,
            "postalCode": 0.56
          }
        },
        "position": {
          "lat": 37.76837,
          "lng": -122.42713
        },
        "access": [
          {
            "lat": 37.7686,
            "lng": -122.42741
          }
        ],
        "mapView": {
          "west": -122.42827,
          "south": 37.76747,
          "east": -122.42599,
          "north": 37.76927
        },
        "categories": [
          {
            "id": "7332005",
            "name": "market, supermarkets hypermarkets",
            "primary": true
          }
        ],
        "contacts": [
          {
            "phone": [
              {
                "value": "+1 415-626-1430"
              }
            ],
            "www": [
              {
                "value": "www.wholefoodsmarket.com/"
              }
            ]
          }
        ]
      }
    ]
  }
]
```

## API Query Limits

1. A maximum of 100 Search queries can be added to a single input.
2. NextBillion.ai allows a maximum rate limit of 60 queries per minute or 1 query per second for continuous requests.  
   _Note_: We can increase the quota if needed on request. Contact [support@nextbillion.ai](mailto:support@nextbillion.ai) for more details.

## API Error Codes

| Response Code | Description                                                      | Additional Notes                                                                                                                                           |
| ------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200           | Normal success case.                                             | Normal success case                                                                                                                                        |
| 400           | Input validation failed.                                         | There is a missing or an invalid parameter or a parameter with an invalid value type is added to the request.                                              |
| 401           | APIKEY not supplied or invalid.                                  | This error occurs when the wrong API key is passed in the request or the key is missing altogether                                                         |
| 403           | APIKEY is valid but does not have access to requested resources. | You might be querying for a geographical region which is not valid for your account, or requesting a service which is not enabled for you.                 |
| 404           | Requested host/path not found.                                   | This error occurs when a malformed hostname is used.                                                                                                       |
| 422           | Could not process the request.                                   | Valid results could not be generated for the given parameters. Please modify the constraints/search query.                                                 |
| 429           | Too many requests.                                               | QPM or API request count quota reached                                                                                                                     |
| 500           | Internal Service error.                                          | There was an internal issue with NextBillion.ai services. You can reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) for an explanation. |
