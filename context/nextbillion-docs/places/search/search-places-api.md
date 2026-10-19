# Search Places APIs

## Introduction

NextBillion.ai provides two convenient methods to search for unknown places and discover new ones matching the generic queries provided. The _Discover API_ can suggest matching places based on free-form or incomplete queries provided while the _Browse API_ allows for a more structured search based on different filters like place category or a given search center. Both these endpoints help users with searching unknown places based on custom criteria or queries.

Let’s cover both these endpoints one-by-one in the following sections.

## Discover API

The Discover API allows processing a free-form text query to look for matching addresses or places and return the results in order of relevance.

GET
https://api.nextbillion.io/discover?key={your_api_key}

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

### Example

Lets create a basic discover request in San Francisco area

#### Sample API Request

```bash
curl --location 'https://api.nextbillion.io/discover?key=<your_api_key>&at=37.78182,-122.45291&q=gas&limit=5&in=countryCode:USA,MEX'
```

#### Sample API Response

```json
{
  "items": [
    {
      "title": "Rc Gas",
      "id": "vVvq8TGB9Abonb1SYADenw",
      "address": {
        "label": "Rc Gas, 376 Castro Street, San Francisco, CA 94114, United States",
        "countryCode": "USA",
        "countryName": "United States",
        "stateCode": "CA",
        "state": "California",
        "county": "San Francisco",
        "city": "San Francisco",
        "street": "Castro Street",
        "postalCode": "94114-1524",
        "houseNumber": "376"
      },
      "scoring": {
        "queryScore": 0.9
      },
      "position": {
        "lat": 37.762951,
        "lng": -122.43554
      },
      "access": [
        {
          "lat": 37.763,
          "lng": -122.43521
        }
      ],
      "distance": 2594,
      "mapView": {
        "west": -122.43668,
        "south": 37.76205,
        "east": -122.4344,
        "north": 37.76385
      },
      "categories": [
        {
          "id": "9150",
          "name": "primary resource/utility",
          "primary": true
        }
      ],
      "contacts": [
        {
          "phone": [
            {
              "value": "+1 415-552-0103"
            }
          ]
        }
      ]
    },
    {
      "title": "Gas Light",
      "id": "E6Gri5mXYQ6Tgcr8o0D_nA",
      "address": {
        "label": "Gas Light, 3640 Buchanan Street, San Francisco, CA 94123, United States",
        "countryCode": "USA",
        "countryName": "United States",
        "stateCode": "CA",
        "state": "California",
        "county": "San Francisco",
        "city": "San Francisco",
        "street": "Buchanan Street",
        "postalCode": "94123-1709",
        "houseNumber": "3640"
      },
      "scoring": {
        "queryScore": 0.89
      },
      "position": {
        "lat": 37.803788,
        "lng": -122.433195
      },
      "access": [
        {
          "lat": 37.80374,
          "lng": -122.43346
        }
      ],
      "distance": 2994,
      "mapView": {
        "west": -122.43433,
        "south": 37.80289,
        "east": -122.43206,
        "north": 37.80469
      },
      "categories": [
        {
          "id": "9150",
          "name": "primary resource/utility",
          "primary": true
        }
      ],
      "contacts": [
        {
          "phone": [
            {
              "value": "+1 415-921-6138"
            }
          ]
        }
      ]
    },
    {
      "title": "Pacific Gas & Electric Co. Station J",
      "id": "5er0jZLp6gpXkDkesLDeeg",
      "address": {
        "label": "Pacific Gas & Electric Co. Station J, 565 Commercial Street, San Francisco, CA 94111, United States",
        "countryCode": "USA",
        "countryName": "United States",
        "stateCode": "CA",
        "state": "California",
        "county": "San Francisco",
        "city": "San Francisco",
        "street": "Commercial Street",
        "postalCode": "94111-3031",
        "houseNumber": "565"
      },
      "scoring": {
        "queryScore": 0.87
      },
      "position": {
        "lat": 37.79417,
        "lng": -122.402552
      },
      "access": [
        {
          "lat": 37.79429,
          "lng": -122.40257
        }
      ],
      "distance": 4633,
      "mapView": {
        "west": -122.40369,
        "south": 37.79327,
        "east": -122.40141,
        "north": 37.79507
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
              "value": "noehill.com/sf/landmarks/sf142.asp"
            }
          ]
        }
      ]
    },
    {
      "title": "Pacific Gas & Electric General Office Building",
      "id": "QCB98u8ILncy7m5w4FxzYw",
      "address": {
        "label": "Pacific Gas & Electric General Office Building, 245 East Market Street, Daly City, CA 94014, United States",
        "countryCode": "USA",
        "countryName": "United States",
        "stateCode": "CA",
        "state": "California",
        "county": "San Mateo",
        "city": "Daly City",
        "street": "East Market Street",
        "postalCode": "94014-2921",
        "houseNumber": "245"
      },
      "scoring": {
        "queryScore": 0.84
      },
      "position": {
        "lat": 37.690043,
        "lng": -122.462709
      },
      "access": [
        {
          "lat": 37.68975,
          "lng": -122.46274
        }
      ],
      "distance": 10241,
      "mapView": {
        "west": -122.46385,
        "south": 37.68914,
        "east": -122.46157,
        "north": 37.69094
      },
      "categories": [
        {
          "id": "7376",
          "name": "important tourist attraction",
          "primary": true
        }
      ]
    },
    {
      "title": "Gas Light",
      "id": "XRGVho5J4YyexqZK7VdX1A",
      "address": {
        "label": "Gas Light, 3640 Buchanan Street, San Francisco, CA 94123, United States",
        "countryCode": "USA",
        "countryName": "United States",
        "stateCode": "CA",
        "state": "California",
        "county": "San Francisco",
        "city": "San Francisco",
        "street": "Buchanan Street",
        "postalCode": "94123-1709",
        "houseNumber": "3640"
      },
      "scoring": {
        "queryScore": 0.82
      },
      "position": {
        "lat": 37.803788,
        "lng": -122.433195
      },
      "access": [
        {
          "lat": 37.80374,
          "lng": -122.43346
        }
      ],
      "distance": 2994,
      "mapView": {
        "west": -122.43433,
        "south": 37.80289,
        "east": -122.43206,
        "north": 37.80469
      },
      "categories": [
        {
          "id": "9361015",
          "name": "shop, real estate agents",
          "primary": true
        }
      ],
      "contacts": [
        {
          "phone": [
            {
              "value": "+1 415-921-6138"
            }
          ]
        }
      ]
    }
  ]
}
```

## Browse API

The Browse API provides search results for places based on different filters, such as categories or name, ranked by distance from a given search center. The only mandatory elements exposed in the response are `id`, `scoring` and `position`. The other elements listed in the response body may or may not be returned based on the details available in the dataset.

GET

https://api.nextbillion.io/browse?key={your_api_key}

### Request Parameters

| Name         | Required | Format and Usage                                                                                                                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`        | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: `key=API_KEY`                                                 | A key is a unique identifier that is required to authenticate a request to the API.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `at`         | No       | Type: `string`<br>Format: latitude,longitude<br>Example: `at=52.5308,13.3856`                                                        | Specify the center of the search context expressed as coordinates.<br>Please note that one of "at", "in=circle" or "in=bbox" should be provided for relevant results.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `categories` | No       | Type: `string`<br>Example: `categories: schools`                                                                                     | This is a category filter consisting of a comma-separated list of categories. Places with any assigned categories that match any of the requested categories are included in the response.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `in`         | No       | Type: `string`<br>Example: `in=countryCode:CAN,MEX,USA`, `in=circle:52.53,13.38;r=10000`, `in=bbox:13.08836,52.33812,13.761,52.6755` | Search within a geographic area. This is a hard filter. Results will be returned if they are located within the specified area.<br>A geographic area can be<br>\* a country (or multiple countries), provided as comma-separated [ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) country codes<br>The country codes are to be provided in all uppercase.<br>Format: `countryCode:{countryCode}[,{countryCode}]`<br>\* a circular area, provided as latitude, longitude, and radius (an integer with meters as unit)<br>Format: `circle:{latitude},{longitude};r={radius}`<br>\* a bounding box, provided as \_west longitude\_, \_south latitude\_, \_east longitude\_, \_north latitude\_<br>Format: `bbox:{west longitude},{south latitude},{east longitude},{north latitude}`<br>Please provide one of 'at', 'in=circle' or 'in=bbox' input for a relevant result. |
| `limit`      | No       | Type: `integer`<br>Default: `10`                                                                                                     | Maximum number of results to be returned.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `lang`       | No       | Type: `string`<br>Example: `lang=en-US`                                                                                              | Select the language to be used for result rendering from a list of [IETF Supported Language Tags](https://developer.tomtom.com/search-api/documentation/product-information/supported-languages) [](https://developer.tomtom.com/geocoding-api/documentation/product-information/supported-languages)compliant language codes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `view`       | No       | Type: `string`                                                                                                                       | Select the geopolitical view to be applied to the result to handle disputed territories. Following are the allowed values:<br>\* `Unified` - neutral, global representation<br>\* `AR` - Argentina<br>\* `IL` - Israel<br>\* `IN` - India<br>\* `MA` - Morocco<br>\* `PK` - Pakistan<br>\* `RU` - Russia<br>\* `TR` - Turkey<br>\* `CN` - China<br>\* `TW` - Taiwan<br>Please note that:<br>\* For requests originating from one of the supported regions, the default view is the region itself.<br>Example: Requests from Argentina default to `AR`, from China to `CN`, and so on.<br>\* For requests originating from all other regions, the default view is `Unified`.<br>For India (`IN`), no alternate geopolitical views are supported.                                                                                                                                              |

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

### Example

Let’s browse for “market” in the San Francisco area.

#### Sample API Request

```bash
curl --location 'https://api.nextbillion.io/browse?categories=market&limit=2&in=countryCode:USA,MEX&at=37.78182,-122.45291&key=<your_api_key>'
```

#### Sample API Response

```json
{
  "items": [
    {
      "title": "Whole Foods Mkt",
      "id": "FrPIlYtjFL_GkJym9qtx0A",
      "address": {
        "label": "Whole Foods Mkt, 69 Stanyan Street, San Francisco, CA 94118, United States",
        "countryCode": "USA",
        "countryName": "United States",
        "stateCode": "CA",
        "state": "California",
        "county": "San Francisco",
        "city": "San Francisco",
        "street": "Stanyan Street",
        "postalCode": "94118",
        "houseNumber": "69"
      },
      "scoring": {
        "queryScore": 1
      },
      "position": {
        "lat": 37.780383,
        "lng": -122.456272
      },
      "access": [
        {
          "lat": 37.7801,
          "lng": -122.45596
        }
      ],
      "distance": 335,
      "mapView": {
        "west": -122.45741,
        "south": 37.77948,
        "east": -122.45513,
        "north": 37.78128
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
              "value": "+1 415-876-6740"
            }
          ]
        }
      ]
    },
    {
      "title": "Trader Joe's",
      "id": "s4WyLPIdyuC8j5BBl4znKA",
      "address": {
        "label": "Trader Joe's, 3 Masonic Avenue, San Francisco, CA 94118, United States",
        "countryCode": "USA",
        "countryName": "United States",
        "stateCode": "CA",
        "state": "California",
        "county": "San Francisco",
        "city": "San Francisco",
        "street": "Masonic Avenue",
        "postalCode": "94118",
        "houseNumber": "3"
      },
      "scoring": {
        "queryScore": 1
      },
      "position": {
        "lat": 37.783337,
        "lng": -122.44775
      },
      "access": [
        {
          "lat": 37.7834,
          "lng": -122.44724
        }
      ],
      "distance": 483,
      "mapView": {
        "west": -122.44889,
        "south": 37.78244,
        "east": -122.44661,
        "north": 37.78424
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
              "value": "+1 415-346-9964"
            }
          ],
          "www": [
            {
              "value": "www.traderjoes.com/"
            }
          ]
        }
      ]
    }
  ]
}
```

## API Query Limits

NextBillion.ai allows a maximum rate limit of 2400 queries per minute or 40 queries/second for continuous requests.

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
