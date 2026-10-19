# Autosuggestion APIs

## Introduction

NextBillion.ai provides two useful methods to help users complete their places search faster. The Autosuggest API can suggest places based on incomplete queries while the Autocomplete API helps complete the entered keystrokes while typing in a search query. Both these APIs return complete place details that qualify as valid suggestions for the given input.

Let’s cover both of them in detail in the following sections.

## Autosuggest API

NextBillion.ai Autosuggest API proposes address or place candidates based on an incomplete or misspelled query, from which the user can select the best query to submit for a full search.

The Autosuggest API provides comprehensive responses to free-form user queries by returning suggestions for:

1. unknown places from a category or chain, such as "hospitals".
2. unknown places at known locations, such as "London museums".
3. known places with known names, such as "Times Square" or "Paris".
4. known and unknown places for partial queries, such as "hosp", "London muse", "Times S" or "Par"

> **NOTE**: The response may contain experimental elements not documented here. Any undocumented element is subject to removal at any time.

GET

https://api.nextbillion.io/autosuggest?q={search_query}&key={your_api_key}

### Request Parameters

| Name    | Required | Format and Usage                                                                                                                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`   | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: `key=API_KEY`                                                 | A key is a unique identifier that is required to authenticate a request to the API.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `q`     | Yes      | Type: `string`<br>Example: `q=125, Berliner, berlin`, `q=Beacon, Boston, Hospital`                                                   | Specify the free-text search query.<br>Please note that whitespace, urls, email addresses, or other out-of-scope queries will yield no results.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `at`    | No       | Type: `string`<br>Format: latitude,longitude<br>Example: `at=52.5308,13.3856`                                                        | Specify the center of the search context expressed as coordinates.<br>Please note that one of "at", "in=circle" or "in=bbox" should be provided for relevant results.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `in`    | No       | Type: `string`<br>Example: `in=countryCode:CAN,MEX,USA`, `in=circle:52.53,13.38;r=10000`, `in=bbox:13.08836,52.33812,13.761,52.6755` | Search within a geographic area. This is a hard filter. Results will be returned if they are located within the specified area.<br>A geographic area can be<br>\* a country (or multiple countries), provided as comma-separated [ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) country codes<br>The country codes are to be provided in all uppercase.<br>Format: `countryCode:{countryCode}[,{countryCode}]`<br>\* a circular area, provided as latitude, longitude, and radius (an integer with meters as unit)<br>Format: `circle:{latitude},{longitude};r={radius}`<br>\* a bounding box, provided as \_west longitude\_, \_south latitude\_, \_east longitude\_, \_north latitude\_<br>Format: `bbox:{west longitude},{south latitude},{east longitude},{north latitude}`<br>Please provide one of 'at', 'in=circle' or 'in=bbox' input for a relevant result. |
| `limit` | No       | Type: `integer`<br>Default: `10`                                                                                                     | Maximum number of results to be returned.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `lang`  | No       | Type: `string`<br>Example: `lang=en-US`                                                                                              | Select the language to be used for result rendering from a list of [IETF Supported Language Tags](https://developer.tomtom.com/search-api/documentation/product-information/supported-languages) [](https://developer.tomtom.com/geocoding-api/documentation/product-information/supported-languages)compliant language codes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `view`  | No       | Type: `string`                                                                                                                       | Select the geopolitical view to be applied to the result to handle disputed territories. Following are the allowed values:<br>\* `Unified` - neutral, global representation<br>\* `AR` - Argentina<br>\* `IL` - Israel<br>\* `IN` - India<br>\* `MA` - Morocco<br>\* `PK` - Pakistan<br>\* `RU` - Russia<br>\* `TR` - Turkey<br>\* `CN` - China<br>\* `TW` - Taiwan<br>Please note that:<br>\* For requests originating from one of the supported regions, the default view is the region itself.<br>Example: Requests from Argentina default to `AR`, from China to `CN`, and so on.<br>\* For requests originating from all other regions, the default view is `Unified`.<br>For India (`IN`), no alternate geopolitical views are supported.                                                                                                                                              |

### Response Schema

| Field                                                | Type            | Description                                                                                                                                                     |
| ---------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`                                              | array of object | The results are presented as a JSON list of candidates in ranked order (most-likely to least-likely) based on the matched location criteria.                    |
| `items[].title`                                      | string          | The localized display name of this result item.                                                                                                                 |
| `items[].id`                                         | string          | The unique identifier for the result item.                                                                                                                      |
| `items[].address`                                    | object          | Returns the details of the postal address of the searched place.                                                                                                |
| `items[].address.label`                              | string          | Assembled address value built out of the individual address components according to the regional postal rules. It may not include all the input terms.          |
| `items[].address.countryCode`                        | string          | The alpha-3 country code as per [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) standard.                                                                |
| `items[].address.countryName`                        | string          | The localised country name.                                                                                                                                     |
| `items[].address.stateCode`                          | string          | The [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) compliant state code. For example, "CA" for California as per ISO 3166-2 standard for states in USA. |
| `items[].address.state`                              | string          | Name of the state or primary division of the country.                                                                                                           |
| `items[].address.county`                             | string          | A division of a state; typically, a primary-level administrative division of a state or equivalent.                                                             |
| `items[].address.city`                               | string          | The name of the primary locality of the searched place.                                                                                                         |
| `items[].address.neighborhood`                       | string          | A division of city or a neighborhood within the city.                                                                                                           |
| `items[].address.street`                             | string          | Name of street of the searched place, if available.                                                                                                             |
| `items[].address.postalCode`                         | string          | The zip or postal code of the searched place.                                                                                                                   |
| `items[].address.houseNumber`                        | string          | House number of the searched place, if available.                                                                                                               |
| `items[].scoring`                                    | object          | Query matching score of the searched place. A higher score indicates a closer match with the searched query.                                                    |
| `items[].scoring.queryScore`                         | number          | A score, out of 1, indicating how closely the result matches with the provided query `q` .                                                                      |
| `items[].scoring.fieldScore`                         | object          | A breakdown of how closely individual field of the result matched with the provided query `q`.                                                                  |
| `items[].position`                                   | object          | Returns the location coordinates of the searched place.                                                                                                         |
| `items[].position.lat`                               | number          | The latitude of the searched place.                                                                                                                             |
| `items[].position.lng`                               | number          | The longitude of the searched place.                                                                                                                            |
| `items[].access`                                     | array of object | An array returning the location coordinates of all the access points of the search result.                                                                      |
| `items[].access[].lat`                               | number          | The latitude of the access point of the search result.                                                                                                          |
| `items[].access[].lng`                               | number          | The longitude of the access point of the search result.                                                                                                         |
| `items[].distance`                                   | integer         | The distance "as the crow flies" from the search center to this result item in meters.                                                                          |
| `items[].mapView`                                    | object          | The bounding box enclosing the geometric shape (area or line) that an individual searched place covers. `place` type results have no `mapView`.                 |
| `items[].mapView.west`                               | number          | Longitude of the western-side of the box.                                                                                                                       |
| `items[].mapView.south`                              | number          | Longitude of the southern-side of the box.                                                                                                                      |
| `items[].mapView.east`                               | number          | Longitude of the eastern-side of the box.                                                                                                                       |
| `items[].mapView.north`                              | number          | Longitude of the northern-side of the box.                                                                                                                      |
| `items[].categories`                                 | array of object | The list of categories assigned to this place.                                                                                                                  |
| `items[].categories[].id`                            | string          | Identifier number for the place category associated with the searched place.                                                                                    |
| `items[].categories[].name`                          | string          | Name of the place category for the searched place.                                                                                                              |
| `items[].categories[].primary`                       | boolean         | Whether or not it is a primary category. This field is visible only when the value is 'true'.                                                                   |
| `items[].contacts`                                   | array of object | Contact information like phone, email or website.                                                                                                               |
| `items[].contacts[].phone`                           | array of object |                                                                                                                                                                 |
| `items[].contacts[].phone[].label`                   | string          | Optional label for the contact string, such as "Customer Service" or "Pharmacy Fax".                                                                            |
| `items[].contacts[].phone[].value`                   | string          | Contact information, as specified by the contact type.                                                                                                          |
| `items[].contacts[].phone[].categories`              | array of object | The list of place categories this contact refers to.                                                                                                            |
| `items[].contacts[].phone[].categories[].id`         | string          | Identifier number for an associated category. For example: "900-9300-0000"                                                                                      |
| `items[].contacts[].mobile`                          | array of object |                                                                                                                                                                 |
| `items[].contacts[].mobile[].label`                  | string          | Optional label for the contact string, such as "Customer Service" or "Pharmacy Fax".                                                                            |
| `items[].contacts[].mobile[].value`                  | string          | Contact information, as specified by the contact type.                                                                                                          |
| `items[].contacts[].mobile[].categories`             | array of object | The list of place categories this contact refers to.                                                                                                            |
| `items[].contacts[].mobile[].categories[].id`        | string          | Identifier number for an associated category. For example: "900-9300-0000"                                                                                      |
| `items[].contacts[].tollFree`                        | array of object |                                                                                                                                                                 |
| `items[].contacts[].tollFree[].label`                | string          | Optional label for the contact string, such as "Customer Service" or "Pharmacy Fax".                                                                            |
| `items[].contacts[].tollFree[].value`                | string          | Contact information, as specified by the contact type.                                                                                                          |
| `items[].contacts[].tollFree[].categories`           | array of object | The list of place categories this contact refers to.                                                                                                            |
| `items[].contacts[].tollFree[].categories[].id`      | string          | Identifier number for an associated category. For example: "900-9300-0000"                                                                                      |
| `items[].contacts[].fax`                             | array of object |                                                                                                                                                                 |
| `items[].contacts[].fax[].label`                     | string          | Optional label for the contact string, such as "Customer Service" or "Pharmacy Fax".                                                                            |
| `items[].contacts[].fax[].value`                     | string          | Contact information, as specified by the contact type.                                                                                                          |
| `items[].contacts[].fax[].categories`                | array of object | The list of place categories this contact refers to.                                                                                                            |
| `items[].contacts[].fax[].categories[].id`           | string          | Identifier number for an associated category. For example: "900-9300-0000"                                                                                      |
| `items[].contacts[].www`                             | array of object |                                                                                                                                                                 |
| `items[].contacts[].www[].label`                     | string          | Optional label for the contact string, such as "Customer Service" or "Pharmacy Fax".                                                                            |
| `items[].contacts[].www[].value`                     | string          | Contact information, as specified by the contact type.                                                                                                          |
| `items[].contacts[].www[].categories`                | array of object | The list of place categories this contact refers to.                                                                                                            |
| `items[].contacts[].www[].categories[].id`           | string          | Identifier number for an associated category. For example: "900-9300-0000"                                                                                      |
| `items[].contacts[].email`                           | array of object |                                                                                                                                                                 |
| `items[].contacts[].email[].label`                   | string          | Optional label for the contact string, such as "Customer Service" or "Pharmacy Fax".                                                                            |
| `items[].contacts[].email[].value`                   | string          | Contact information, as specified by the contact type.                                                                                                          |
| `items[].contacts[].email[].categories`              | array of object | The list of place categories this contact refers to.                                                                                                            |
| `items[].contacts[].email[].categories[].id`         | string          | Identifier number for an associated category. For example: "900-9300-0000"                                                                                      |
| `items[].openingHours`                               | object          | Returns the operating hours of the place, if available.                                                                                                         |
| `items[].openingHours.timeRanges`                    | array of object | A collection of attributes with details about the opening and closing hours for each day of the week.                                                           |
| `items[].openingHours.timeRanges[].startTime`        | object          | Returns the open time details.                                                                                                                                  |
| `items[].openingHours.timeRanges[].startTime.date`   | string          | The date to which the subsequent open time details belong to.                                                                                                   |
| `items[].openingHours.timeRanges[].startTime.hour`   | integer         | The hour of the day when the place opens.                                                                                                                       |
| `items[].openingHours.timeRanges[].startTime.minute` | integer         | The minute of the hour when the place opens.                                                                                                                    |
| `items[].openingHours.timeRanges[].endTime`          | object          | Returns the closing time details.                                                                                                                               |
| `items[].openingHours.timeRanges[].endTime.date`     | string          | The date to which the subsequent closing time details belong to.                                                                                                |
| `items[].openingHours.timeRanges[].endTime.hour`     | integer         | The hour of the day when the place closes.                                                                                                                      |
| `items[].openingHours.timeRanges[].endTime.minute`   | integer         | The minute of the hour when the place closes.                                                                                                                   |

### Examples

Let’s search for a mis-spelled query looking for “aqauriums” in the Boston city region.

#### Sample API Request

```bash
curl --location 'https://api.nextbillion.io/autosuggest?at=42.350133,-71.068900&key=<your_api_key>&limit=5&q=aqauriums'
```

#### Sample API Response

```json
{
  "items": [
    {
      "title": "Aquarium Station",
      "id": "47_E4Ni11pElGqRAU6PTcQ",
      "address": {
        "label": "Aquarium Station, 183 State Street, Boston, MA 02109, United States",
        "countryCode": "USA",
        "countryName": "United States",
        "stateCode": "MA",
        "state": "Massachusetts",
        "county": "Suffolk",
        "city": "Boston",
        "street": "State Street",
        "postalCode": "02109-2600",
        "houseNumber": "183"
      },
      "scoring": {
        "queryScore": 0.98
      },
      "position": {
        "lat": 42.359258,
        "lng": -71.053041
      },
      "access": [
        {
          "lat": 42.35941,
          "lng": -71.05317
        },
        {
          "lat": 42.35944,
          "lng": -71.05299
        }
      ],
      "distance": 1651,
      "mapView": {
        "west": -71.05426,
        "south": 42.35836,
        "east": -71.05182,
        "north": 42.36016
      },
      "categories": [
        {
          "id": "7380005",
          "name": "railway station, metro",
          "primary": true
        }
      ],
      "contacts": [
        {
          "www": [
            {
              "value": "www.mbta.com"
            }
          ]
        }
      ]
    },
    {
      "title": "New England Aquarium",
      "id": "Ts9B7UN1-hbVIWrSOwpr9Q",
      "address": {
        "label": "New England Aquarium, 1 Central Wharf, Boston, MA 02110, United States",
        "countryCode": "USA",
        "countryName": "United States",
        "stateCode": "MA",
        "state": "Massachusetts",
        "county": "Suffolk",
        "city": "Boston",
        "street": "Central Wharf",
        "postalCode": "02110-3309",
        "houseNumber": "1"
      },
      "scoring": {
        "queryScore": 0.95
      },
      "position": {
        "lat": 42.359171,
        "lng": -71.049536
      },
      "access": [
        {
          "lat": 42.35899,
          "lng": -71.05067
        }
      ],
      "distance": 1881,
      "mapView": {
        "west": -71.05075,
        "south": 42.35827,
        "east": -71.04832,
        "north": 42.36007
      },
      "categories": [
        {
          "id": "7317",
          "name": "museum",
          "primary": true
        }
      ],
      "contacts": [
        {
          "phone": [
            {
              "value": "+1 617-973-5200"
            }
          ]
        }
      ]
    },
    {
      "title": "New England Aquarium Corporation",
      "id": "TUkbCLOpM0rMScHtwM8LdA",
      "address": {
        "label": "New England Aquarium Corporation, Central Wharf, Boston, MA 02110, United States",
        "countryCode": "USA",
        "countryName": "United States",
        "stateCode": "MA",
        "state": "Massachusetts",
        "county": "Suffolk",
        "city": "Boston",
        "street": "Central Wharf",
        "postalCode": "02110"
      },
      "scoring": {
        "queryScore": 0.91
      },
      "position": {
        "lat": 42.359059,
        "lng": -71.050393
      },
      "access": [
        {
          "lat": 42.35897,
          "lng": -71.05037
        }
      ],
      "distance": 1816,
      "mapView": {
        "west": -71.05161,
        "south": 42.35816,
        "east": -71.04918,
        "north": 42.35996
      },
      "categories": [
        {
          "id": "9927004",
          "name": "zoos, arboreta botanical garden, aquatic zoo marine park",
          "primary": true
        }
      ],
      "contacts": [
        {
          "phone": [
            {
              "value": "+1 617-573-9352"
            }
          ],
          "www": [
            {
              "value": "www.neaq.org"
            }
          ]
        }
      ]
    },
    {
      "title": "Aquarium",
      "id": "3q7eeRuiA2diuKGM4A8HPg",
      "address": {
        "label": "Aquarium, State Street, Boston, MA 02110, United States",
        "countryCode": "USA",
        "countryName": "United States",
        "stateCode": "MA",
        "state": "Massachusetts",
        "county": "Suffolk",
        "city": "Boston",
        "street": "State Street",
        "postalCode": "02110"
      },
      "scoring": {
        "queryScore": 0.89
      },
      "position": {
        "lat": 42.359784,
        "lng": -71.051652
      },
      "access": [
        {
          "lat": 42.35965,
          "lng": -71.05163
        }
      ],
      "distance": 1777,
      "mapView": {
        "west": -71.05287,
        "south": 42.35888,
        "east": -71.05043,
        "north": 42.36068
      },
      "categories": [
        {
          "id": "9942002",
          "name": "public transport stop, bus stop",
          "primary": true
        }
      ]
    },
    {
      "title": "Aquarium World",
      "id": "VibMZDqzu3wol7_ymL3o8g",
      "address": {
        "label": "Aquarium World, 281 Mount Auburn Street, Watertown, MA 02472, United States",
        "countryCode": "USA",
        "countryName": "United States",
        "stateCode": "MA",
        "state": "Massachusetts",
        "county": "Middlesex",
        "city": "Watertown",
        "street": "Mount Auburn Street",
        "postalCode": "02472-1955",
        "houseNumber": "281"
      },
      "scoring": {
        "queryScore": 0.69
      },
      "position": {
        "lat": 42.369498,
        "lng": -71.172359
      },
      "access": [
        {
          "lat": 42.36967,
          "lng": -71.17248
        }
      ],
      "distance": 8769,
      "mapView": {
        "west": -71.17358,
        "south": 42.3686,
        "east": -71.17114,
        "north": 42.3704
      },
      "categories": [
        {
          "id": "9927004",
          "name": "zoos, arboreta botanical garden, aquatic zoo marine park",
          "primary": true
        }
      ],
      "contacts": [
        {
          "phone": [
            {
              "value": "+1 617-600-3434"
            }
          ]
        }
      ]
    }
  ]
}
```

## Autocomplete API

NextBillion.ai Autocomplete API completes valid street addresses or administrative areas using the entered keystrokes to speed-up the process of completing the address search queries.

GET

https://api.nextbillion.io/autocomplete?q={search_query}&key={your_api_key}

### Request Parameters

| Name    | Required | Format and Usage                                                                                                                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`   | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: `key=API_KEY`                                                 | A key is a unique identifier that is required to authenticate a request to the API.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `q`     | Yes      | Type: `string`<br>Example: `q=125, Berliner, berlin`, `q=Beacon, Boston, Hospital`                                                   | Specify the free-text search query.<br>Please note that whitespace, urls, email addresses, or other out-of-scope queries will yield no results.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `at`    | No       | Type: `string`<br>Format: latitude,longitude<br>Example: `at=52.5308,13.3856`                                                        | Specify the center of the search context expressed as coordinates.<br>Please note that one of "at", "in=circle" or "in=bbox" should be provided for relevant results.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `in`    | No       | Type: `string`<br>Example: `in=countryCode:CAN,MEX,USA`, `in=circle:52.53,13.38;r=10000`, `in=bbox:13.08836,52.33812,13.761,52.6755` | Search within a geographic area. This is a hard filter. Results will be returned if they are located within the specified area.<br>A geographic area can be<br>\* a country (or multiple countries), provided as comma-separated [ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) country codes<br>The country codes are to be provided in all uppercase.<br>Format: `countryCode:{countryCode}[,{countryCode}]`<br>\* a circular area, provided as latitude, longitude, and radius (an integer with meters as unit)<br>Format: `circle:{latitude},{longitude};r={radius}`<br>\* a bounding box, provided as \_west longitude\_, \_south latitude\_, \_east longitude\_, \_north latitude\_<br>Format: `bbox:{west longitude},{south latitude},{east longitude},{north latitude}`<br>Please provide one of 'at', 'in=circle' or 'in=bbox' input for a relevant result. |
| `limit` | No       | Type: `integer`<br>Default: `10`                                                                                                     | Maximum number of results to be returned.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `lang`  | No       | Type: `string`<br>Example: `lang=en-US`                                                                                              | Select the language to be used for result rendering from a list of [IETF Supported Language Tags](https://developer.tomtom.com/search-api/documentation/product-information/supported-languages) [](https://developer.tomtom.com/geocoding-api/documentation/product-information/supported-languages)compliant language codes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `view`  | No       | Type: `string`                                                                                                                       | Select the geopolitical view to be applied to the result to handle disputed territories. Following are the allowed values:<br>\* `Unified` - neutral, global representation<br>\* `AR` - Argentina<br>\* `IL` - Israel<br>\* `IN` - India<br>\* `MA` - Morocco<br>\* `PK` - Pakistan<br>\* `RU` - Russia<br>\* `TR` - Turkey<br>\* `CN` - China<br>\* `TW` - Taiwan<br>Please note that:<br>\* For requests originating from one of the supported regions, the default view is the region itself.<br>Example: Requests from Argentina default to `AR`, from China to `CN`, and so on.<br>\* For requests originating from all other regions, the default view is `Unified`.<br>For India (`IN`), no alternate geopolitical views are supported.                                                                                                                                              |

### Response Schema

| Field                                                | Type            | Description                                                                                                                                                     |
| ---------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`                                              | array of object | The results are presented as a JSON list of candidates in ranked order (most-likely to least-likely) based on the matched location criteria.                    |
| `items[].title`                                      | string          | The localized display name of this result item.                                                                                                                 |
| `items[].id`                                         | string          | The unique identifier for the result item.                                                                                                                      |
| `items[].address`                                    | object          | Returns the details of the postal address of the searched place.                                                                                                |
| `items[].address.label`                              | string          | Assembled address value built out of the individual address components according to the regional postal rules. It may not include all the input terms.          |
| `items[].address.countryCode`                        | string          | The alpha-3 country code as per [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) standard.                                                                |
| `items[].address.countryName`                        | string          | The localised country name.                                                                                                                                     |
| `items[].address.stateCode`                          | string          | The [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) compliant state code. For example, "CA" for California as per ISO 3166-2 standard for states in USA. |
| `items[].address.state`                              | string          | Name of the state or primary division of the country.                                                                                                           |
| `items[].address.county`                             | string          | A division of a state; typically, a primary-level administrative division of a state or equivalent.                                                             |
| `items[].address.city`                               | string          | The name of the primary locality of the searched place.                                                                                                         |
| `items[].address.neighborhood`                       | string          | A division of city or a neighborhood within the city.                                                                                                           |
| `items[].address.street`                             | string          | Name of street of the searched place, if available.                                                                                                             |
| `items[].address.postalCode`                         | string          | The zip or postal code of the searched place.                                                                                                                   |
| `items[].address.houseNumber`                        | string          | House number of the searched place, if available.                                                                                                               |
| `items[].scoring`                                    | object          | Query matching score of the searched place. A higher score indicates a closer match with the searched query.                                                    |
| `items[].scoring.queryScore`                         | number          | A score, out of 1, indicating how closely the result matches with the provided query `q` .                                                                      |
| `items[].scoring.fieldScore`                         | object          | A breakdown of how closely individual field of the result matched with the provided query `q`.                                                                  |
| `items[].position`                                   | object          | Returns the location coordinates of the searched place.                                                                                                         |
| `items[].position.lat`                               | number          | The latitude of the searched place.                                                                                                                             |
| `items[].position.lng`                               | number          | The longitude of the searched place.                                                                                                                            |
| `items[].access`                                     | array of object | An array returning the location coordinates of all the access points of the search result.                                                                      |
| `items[].access[].lat`                               | number          | The latitude of the access point of the search result.                                                                                                          |
| `items[].access[].lng`                               | number          | The longitude of the access point of the search result.                                                                                                         |
| `items[].distance`                                   | integer         | The distance "as the crow flies" from the search center to this result item in meters.                                                                          |
| `items[].mapView`                                    | object          | The bounding box enclosing the geometric shape (area or line) that an individual searched place covers. `place` type results have no `mapView`.                 |
| `items[].mapView.west`                               | number          | Longitude of the western-side of the box.                                                                                                                       |
| `items[].mapView.south`                              | number          | Longitude of the southern-side of the box.                                                                                                                      |
| `items[].mapView.east`                               | number          | Longitude of the eastern-side of the box.                                                                                                                       |
| `items[].mapView.north`                              | number          | Longitude of the northern-side of the box.                                                                                                                      |
| `items[].categories`                                 | array of object | The list of categories assigned to this place.                                                                                                                  |
| `items[].categories[].id`                            | string          | Identifier number for the place category associated with the searched place.                                                                                    |
| `items[].categories[].name`                          | string          | Name of the place category for the searched place.                                                                                                              |
| `items[].categories[].primary`                       | boolean         | Whether or not it is a primary category. This field is visible only when the value is 'true'.                                                                   |
| `items[].contacts`                                   | array of object | Contact information like phone, email or website.                                                                                                               |
| `items[].contacts[].phone`                           | array of object |                                                                                                                                                                 |
| `items[].contacts[].phone[].label`                   | string          | Optional label for the contact string, such as "Customer Service" or "Pharmacy Fax".                                                                            |
| `items[].contacts[].phone[].value`                   | string          | Contact information, as specified by the contact type.                                                                                                          |
| `items[].contacts[].phone[].categories`              | array of object | The list of place categories this contact refers to.                                                                                                            |
| `items[].contacts[].phone[].categories[].id`         | string          | Identifier number for an associated category. For example: "900-9300-0000"                                                                                      |
| `items[].contacts[].mobile`                          | array of object |                                                                                                                                                                 |
| `items[].contacts[].mobile[].label`                  | string          | Optional label for the contact string, such as "Customer Service" or "Pharmacy Fax".                                                                            |
| `items[].contacts[].mobile[].value`                  | string          | Contact information, as specified by the contact type.                                                                                                          |
| `items[].contacts[].mobile[].categories`             | array of object | The list of place categories this contact refers to.                                                                                                            |
| `items[].contacts[].mobile[].categories[].id`        | string          | Identifier number for an associated category. For example: "900-9300-0000"                                                                                      |
| `items[].contacts[].tollFree`                        | array of object |                                                                                                                                                                 |
| `items[].contacts[].tollFree[].label`                | string          | Optional label for the contact string, such as "Customer Service" or "Pharmacy Fax".                                                                            |
| `items[].contacts[].tollFree[].value`                | string          | Contact information, as specified by the contact type.                                                                                                          |
| `items[].contacts[].tollFree[].categories`           | array of object | The list of place categories this contact refers to.                                                                                                            |
| `items[].contacts[].tollFree[].categories[].id`      | string          | Identifier number for an associated category. For example: "900-9300-0000"                                                                                      |
| `items[].contacts[].fax`                             | array of object |                                                                                                                                                                 |
| `items[].contacts[].fax[].label`                     | string          | Optional label for the contact string, such as "Customer Service" or "Pharmacy Fax".                                                                            |
| `items[].contacts[].fax[].value`                     | string          | Contact information, as specified by the contact type.                                                                                                          |
| `items[].contacts[].fax[].categories`                | array of object | The list of place categories this contact refers to.                                                                                                            |
| `items[].contacts[].fax[].categories[].id`           | string          | Identifier number for an associated category. For example: "900-9300-0000"                                                                                      |
| `items[].contacts[].www`                             | array of object |                                                                                                                                                                 |
| `items[].contacts[].www[].label`                     | string          | Optional label for the contact string, such as "Customer Service" or "Pharmacy Fax".                                                                            |
| `items[].contacts[].www[].value`                     | string          | Contact information, as specified by the contact type.                                                                                                          |
| `items[].contacts[].www[].categories`                | array of object | The list of place categories this contact refers to.                                                                                                            |
| `items[].contacts[].www[].categories[].id`           | string          | Identifier number for an associated category. For example: "900-9300-0000"                                                                                      |
| `items[].contacts[].email`                           | array of object |                                                                                                                                                                 |
| `items[].contacts[].email[].label`                   | string          | Optional label for the contact string, such as "Customer Service" or "Pharmacy Fax".                                                                            |
| `items[].contacts[].email[].value`                   | string          | Contact information, as specified by the contact type.                                                                                                          |
| `items[].contacts[].email[].categories`              | array of object | The list of place categories this contact refers to.                                                                                                            |
| `items[].contacts[].email[].categories[].id`         | string          | Identifier number for an associated category. For example: "900-9300-0000"                                                                                      |
| `items[].openingHours`                               | object          | Returns the operating hours of the place, if available.                                                                                                         |
| `items[].openingHours.timeRanges`                    | array of object | A collection of attributes with details about the opening and closing hours for each day of the week.                                                           |
| `items[].openingHours.timeRanges[].startTime`        | object          | Returns the open time details.                                                                                                                                  |
| `items[].openingHours.timeRanges[].startTime.date`   | string          | The date to which the subsequent open time details belong to.                                                                                                   |
| `items[].openingHours.timeRanges[].startTime.hour`   | integer         | The hour of the day when the place opens.                                                                                                                       |
| `items[].openingHours.timeRanges[].startTime.minute` | integer         | The minute of the hour when the place opens.                                                                                                                    |
| `items[].openingHours.timeRanges[].endTime`          | object          | Returns the closing time details.                                                                                                                               |
| `items[].openingHours.timeRanges[].endTime.date`     | string          | The date to which the subsequent closing time details belong to.                                                                                                |
| `items[].openingHours.timeRanges[].endTime.hour`     | integer         | The hour of the day when the place closes.                                                                                                                      |
| `items[].openingHours.timeRanges[].endTime.minute`   | integer         | The minute of the hour when the place closes.                                                                                                                   |

### Examples

Let’s look for places containing `stat` word in their names in Oklahoma City region

#### Sample API Request

```bash
curl --location 'https://api.nextbillion.io/autocomplete?q=stat&at=35.476911,-97.487201&limit=5&in=countryCode:USA, MEX&key=<your_api_key>'
```

#### Sample API Response

```json
{
  "items": [
    {
      "title": "State Capitol",
      "id": "qN08rVNZIciFxFJeg3hgow",
      "address": {
        "label": "State Capitol, 2300 North Lincoln Boulevard, Oklahoma City, OK 73105, United States",
        "countryCode": "USA",
        "countryName": "United States",
        "stateCode": "OK",
        "state": "Oklahoma",
        "county": "Oklahoma",
        "city": "Oklahoma City",
        "street": "North Lincoln Boulevard",
        "postalCode": "73105-4805",
        "houseNumber": "2300"
      },
      "scoring": {
        "queryScore": 1
      },
      "position": {
        "lat": 35.491815,
        "lng": -97.503339
      },
      "access": [
        {
          "lat": 35.49114,
          "lng": -97.50331
        },
        {
          "lat": 35.49158,
          "lng": -97.50149
        }
      ],
      "distance": 2209,
      "mapView": {
        "west": -97.50521,
        "south": 35.49029,
        "east": -97.50147,
        "north": 35.49334
      },
      "categories": [
        {
          "id": "7376",
          "name": "important tourist attraction",
          "primary": true
        }
      ],
      "contacts": [
        {
          "www": [
            {
              "value": "www.okhouse.gov/Information/CapitolTours.aspx"
            }
          ]
        }
      ]
    },
    {
      "title": "United States Postal Service",
      "id": "wFfRtLgHYeJfAoKawwoNKw",
      "address": {
        "label": "United States Postal Service, 701 North Kelley Avenue, Oklahoma City, OK 73117, United States",
        "countryCode": "USA",
        "countryName": "United States",
        "stateCode": "OK",
        "state": "Oklahoma",
        "county": "Oklahoma",
        "city": "Oklahoma City",
        "street": "North Kelley Avenue",
        "postalCode": "73117-1400",
        "houseNumber": "701"
      },
      "scoring": {
        "queryScore": 0.99
      },
      "position": {
        "lat": 35.473932,
        "lng": -97.495284
      },
      "access": [
        {
          "lat": 35.47393,
          "lng": -97.49517
        }
      ],
      "distance": 803,
      "mapView": {
        "west": -97.49639,
        "south": 35.47303,
        "east": -97.49418,
        "north": 35.47483
      },
      "categories": [
        {
          "id": "7324003",
          "name": "post office, local",
          "primary": true
        }
      ],
      "contacts": [
        {
          "phone": [
            {
              "value": "+1 405-236-0534"
            }
          ],
          "www": [
            {
              "value": "www.usps.com"
            }
          ]
        }
      ]
    },
    {
      "title": "Staton Drive, Oklahoma City, OK 73111, United States",
      "id": "hDHq2NbnFEtoP5otpkeQIA",
      "address": {
        "label": "Staton Drive, Oklahoma City, OK 73111, United States",
        "countryCode": "USA",
        "countryName": "United States",
        "stateCode": "OK",
        "state": "Oklahoma",
        "county": "Oklahoma",
        "city": "Oklahoma City",
        "street": "Staton Drive",
        "postalCode": "73111"
      },
      "scoring": {
        "queryScore": 0.99
      },
      "position": {
        "lat": 35.510759,
        "lng": -97.489053
      },
      "access": [
        {
          "lat": 35.510759,
          "lng": -97.489053
        }
      ],
      "distance": 3767,
      "mapView": {
        "west": -97.48995,
        "south": 35.50959,
        "east": -97.48813,
        "north": 35.51154
      }
    },
    {
      "title": "Jeremy Henley - State Farm",
      "id": "U1yvkrTAXTeIhgXRPkagVQ",
      "address": {
        "label": "Jeremy Henley - State Farm, 114 Northwest 6th Street, Oklahoma City, OK 73102, United States",
        "countryCode": "USA",
        "countryName": "United States",
        "stateCode": "OK",
        "state": "Oklahoma",
        "county": "Oklahoma",
        "city": "Oklahoma City",
        "street": "Northwest 6th Street",
        "postalCode": "73102-6015",
        "houseNumber": "114"
      },
      "scoring": {
        "queryScore": 0.96
      },
      "position": {
        "lat": 35.473743,
        "lng": -97.515228
      },
      "access": [
        {
          "lat": 35.47399,
          "lng": -97.51512
        },
        {
          "lat": 35.47399,
          "lng": -97.51512
        }
      ],
      "distance": 2562,
      "mapView": {
        "west": -97.51633,
        "south": 35.47284,
        "east": -97.51412,
        "north": 35.47464
      },
      "categories": [
        {
          "id": "9352007",
          "name": "insurance, company",
          "primary": true
        }
      ],
      "contacts": [
        {
          "phone": [
            {
              "value": "+1 405-605-4466"
            }
          ],
          "www": [
            {
              "value": "www.jeremyhenley.com"
            }
          ]
        }
      ]
    },
    {
      "title": "Statesboro, GA, United States",
      "id": "a60FRgx3mffb2MWJWEcFUg",
      "address": {
        "label": "Statesboro, GA, United States",
        "countryCode": "USA",
        "countryName": "United States",
        "stateCode": "GA",
        "state": "Georgia",
        "county": "Bulloch",
        "city": "Statesboro"
      },
      "scoring": {
        "queryScore": 0.95
      },
      "position": {
        "lat": 32.44877,
        "lng": -81.777753
      },
      "access": [
        {
          "lat": 32.44877,
          "lng": -81.777753
        }
      ],
      "distance": 1485645,
      "mapView": {
        "west": -81.97639,
        "south": 32.26011,
        "east": -81.52527,
        "north": 32.65335
      }
    }
  ]
}
```

## API Query Limits

Nextbillion.ai allows a maximum rate limit of 2400 queries per minute or 40 queries/second for continuous requests.

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
