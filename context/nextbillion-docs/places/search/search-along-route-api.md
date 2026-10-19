# Search Along Route API

## Introduction

The Search Along Route API is a powerful tool designed to help users find points of interest (POIs) conveniently located near a predetermined travel path. Here is how it works:

1. **Define the Route:** Begin by providing a series of location coordinates. These coordinates act as waypoints, outlining the specific trajectory the route should follow.
2. **POI Identification:** The API identifies POIs that match your search query and fall within a specified proximity to the original route, determined by the `max_detour_time` parameter.
3. **Detour Time & Distance Calculations:** The service will return the relevant information about the returned POIs - detour time and distance incurred from original route along with POI’s location, access points, opening hours etc. In case, a faster alternative route exists between two points on the original path, the API will return negative detour time values.
4. **Flexible Sorting of Results:** Users can sort the matching POIs along the route in a way that best suits their needs.

With these features, the Search Along Route API offers a versatile solution for a wide range of applications requiring efficient POI discovery along a given route. This service is particularly useful for:

- **Navigation applications:** Helping users find relevant stops without significant deviations.
- **Travel planning:** Optimizing journeys by identifying convenient POIs.
- **Logistical operations:** Streamlining routes by incorporating necessary stops.

POST

https://api.nextbillion.io/orbis/alongroute?key={your_api_key}

## Request Parameters

| Name  | Required | Format and Usage                                                                     | Description                                                                         |
| ----- | -------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: `key=API_KEY` | A key is a unique identifier that is required to authenticate a request to the API. |

## Request Body

| Field             | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `route`           | object  | An object to collect details of the route along which Points of Interest (POIs) are to be located.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `route.points`    | string  | Specify the list of location coordinates along the route. Use a pipe operator (`\|` )to separate multiple coordinates.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `q`               | string  | Specify the text query to search for desired places of interest (POIs) along the route.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `max_detour_time` | number  | Specify the maximum driving time, in seconds, required to reach a POI after starting the detour from original route. The default value is 900 seconds (~15 min) and the maximum value is 3600 seconds.                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `sort_by`         | string  | Choose a metric for sorting the searched places in the response.<br>\* `detour_time`: The results are sorted in ascending order of the total driving time needed to reach the POI from the detour starting point on the original route.<br>\* `detour_offset` : The results are sorted in ascending order of the distance between detour point on the route and the start point of the route.                                                                                                                                                                                                                                                                                  |
| `spread_config`   | string  | Specify how the results should be distributed along the route. Currently, only `auto` is supported which concentrates the results near the route's starting point.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `limit`           | integer | Specify the maximum number of places to be returned in the response. The default value is 10 and the maximum number of places that can be requested is 20.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `view`            | string  | Select the geopolitical view to be applied to the result to handle disputed territories. Following are the allowed values:<br>\* `Unified` - neutral, global representation<br>\* `AR` - Argentina<br>\* `CN` - China<br>\* `IN` - India<br>\* `PK` - Pakistan<br>\* `MA` - Morocco<br>\* `RU` - Russia<br>\* `RS` - Serbia<br>\* `TW` - Taiwan<br>\* `TR` - Turkiye<br>Please note that:<br>\* For requests originating from one of the supported regions, the default view is the region itself.<br>Example: Requests from Argentina default to `AR`, from Morocco to `MA`, and so on.<br>\* For requests originating from all other regions, the default view is `Unified`. |

## Response Schema

| Field                                                | Type            | Description                                                                                                                                                                              |
| ---------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`                                              | array of object | An array of objects returning the details of all the searched places of interests (POIs) returned. Each object refers to a single POI.                                                   |
| `items[].title`                                      | string          | The localized display name of the searched place of interest (POI).                                                                                                                      |
| `items[].id`                                         | string          | The unique identifier for the searched place of interest (POI).                                                                                                                          |
| `items[].address`                                    | object          | Returns the details of the postal address of the searched place.                                                                                                                         |
| `items[].address.label`                              | string          | Assembled address value built out of the individual address components according to the regional postal rules. It may not include all the input terms.                                   |
| `items[].address.countryCode`                        | string          | A three-letter country code.                                                                                                                                                             |
| `items[].address.countryName`                        | string          | The localised country name.                                                                                                                                                              |
| `items[].address.stateCode`                          | string          | A country specific state code or state name abbreviation. For example, in the United States it is the two letter state abbreviation: "CA" for California.                                |
| `items[].address.state`                              | string          | Name of the state or primary division of the country.                                                                                                                                    |
| `items[].address.county`                             | string          | A division of a state; typically, a primary-level administrative division of a state or equivalent.                                                                                      |
| `items[].address.suburb`                             | string          | The suburb division of the state to which the returned place belongs.                                                                                                                    |
| `items[].address.city`                               | string          | The name of the primary locality of the searched place.                                                                                                                                  |
| `items[].address.neighborhood`                       | string          | A division of city or a neighborhood within the city.                                                                                                                                    |
| `items[].address.street`                             | string          | Name of street of the searched place, if available.                                                                                                                                      |
| `items[].address.postalCode`                         | string          | The zip or postal code of the searched place.                                                                                                                                            |
| `items[].address.houseNumber`                        | string          | House number of the searched place, if available.                                                                                                                                        |
| `items[].score`                                      | number          | Returns the query matching score of the given searched place of interest (POI). A higher score indicates a closer match with the searched query.                                         |
| `items[].position`                                   | object          | Returns the location coordinates of the searched place.                                                                                                                                  |
| `items[].position.lat`                               | number          | The latitude of the searched place.                                                                                                                                                      |
| `items[].position.lng`                               | number          | The longitude of the searched place.                                                                                                                                                     |
| `items[].access`                                     | array of object | An array of objects returning the location coordinates of all the access points for the searched result.                                                                                 |
| `items[].access[].lat`                               | number          | The latitude of the access point for the searched result.                                                                                                                                |
| `items[].access[].lng`                               | number          | The longitude of the access point for the searched result.                                                                                                                               |
| `items[].mapView`                                    | object          | The bounding box enclosing the geometric shape (area or line) that an individual searched place covers. `place` type results have no `mapView`.                                          |
| `items[].mapView.west`                               | number          | Longitude of the western-side of the box.                                                                                                                                                |
| `items[].mapView.south`                              | number          | Longitude of the southern-side of the box.                                                                                                                                               |
| `items[].mapView.east`                               | number          | Longitude of the eastern-side of the box.                                                                                                                                                |
| `items[].mapView.north`                              | number          | Longitude of the northern-side of the box.                                                                                                                                               |
| `items[].distance`                                   | integer         | Returns the distance of the given searched place of interest (POI) from the point on the original route from where the detour begins.                                                    |
| `items[].categories`                                 | array of object | The list of categories assigned to the given searched place of interest (POI).                                                                                                           |
| `items[].categories[].id`                            | string          | Identifier number for the place category associated with the searched place.                                                                                                             |
| `items[].categories[].name`                          | string          | Name of the place category for the searched place.                                                                                                                                       |
| `items[].categories[].primary`                       | boolean         | Whether or not it is a primary category. This field is visible only when the value is 'true'.                                                                                            |
| `items[].openingHours`                               | object          | Returns the operating hours of the searched place, if available.                                                                                                                         |
| `items[].openingHours.timeRanges`                    | array of object | A collection of attributes with details about the opening and closing hours for each day of the week.                                                                                    |
| `items[].openingHours.timeRanges[].startTime`        | object          | Returns the opening time details of the searched place.                                                                                                                                  |
| `items[].openingHours.timeRanges[].startTime.date`   | string          | The date to which the following open time details refer to.                                                                                                                              |
| `items[].openingHours.timeRanges[].startTime.hour`   | integer         | The hour of the day when the searched place opens.                                                                                                                                       |
| `items[].openingHours.timeRanges[].startTime.minute` | integer         | The minute of the hour when the searched place opens.                                                                                                                                    |
| `items[].openingHours.timeRanges[].endTime`          | object          | Returns the closing time details of the searched place.                                                                                                                                  |
| `items[].openingHours.timeRanges[].endTime.date`     | string          | The date to which the following closing time details refer to.                                                                                                                           |
| `items[].openingHours.timeRanges[].endTime.hour`     | integer         | The hour of the day when the searched place closes.                                                                                                                                      |
| `items[].openingHours.timeRanges[].endTime.minute`   | integer         | The minute of the hour when the searched place closes.                                                                                                                                   |
| `items[].detour_time`                                | integer         | Returns the driving time, in seconds, required to reach a given searched place of interest (POI) after starting the detour from the original route.                                      |
| `items[].detour_offset`                              | integer         | Returns the distance, in meters, between start point of the original route and the point on the route from where a detour is needed to reach the given searched place of interest (POI). |

## Example

Let’s look at the following sample which requests “Gas Stations” to be found along a given route, reachable within 10 mins (600 secs).

#### Sample API Request

```bash
curl --location 'https://api.nextbillion.io/orbis/alongroute?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "route": {
        "points": "34.04932289,-118.25573833|34.04711381,-118.24976846|34.04153727,-118.2310818|34.03881998,-118.20756901"
    },
    "max_detour_time": 600,
    "q": "Gas Station"
}'
```

#### Sample API Response

```json
{
  "items": [
    {
      "title": "Sinclair",
      "id": "dpd-_V_Ma5MpRn-ajiU4JQ",
      "address": {
        "label": "500 South Alameda Street, Los Angeles, CA 90013",
        "countryCode": "USA",
        "countryName": "United States",
        "stateCode": "CA",
        "state": "California",
        "county": "Los Angeles",
        "suburb": "",
        "city": "Los Angeles",
        "neighborhood": "Downtown Los Angeles",
        "street": "South Alameda Street",
        "postalCode": "90013-1708",
        "houseNumber": "500"
      },
      "score": 6.5761957169,
      "position": {
        "lat": 34.041226,
        "lng": -118.23801
      },
      "access": [
        {
          "lat": 34.04123,
          "lng": -118.23824
        },
        {
          "lat": 34.04124,
          "lng": -118.23824
        }
      ],
      "distance": 2167,
      "mapView": {
        "west": -118.2391,
        "south": 34.04033,
        "east": -118.23692,
        "north": 34.04213
      },
      "categories": [
        {
          "id": "7311",
          "name": "Gas Station",
          "primary": true
        }
      ],
      "openingHours": {
        "timeRanges": [
          {
            "startTime": {
              "date": "2025-09-01",
              "hour": 0,
              "minute": 0
            },
            "endTime": {
              "date": "2025-09-08",
              "hour": 0,
              "minute": 0
            }
          }
        ]
      },
      "detour_time": 34,
      "detour_offset": 0
    },
    {
      "title": "76",
      "id": "G2eRjBj85KJvSRLVxEy2mw",
      "address": {
        "label": "1800 East 4th Street, Los Angeles, CA 90033",
        "countryCode": "USA",
        "countryName": "United States",
        "stateCode": "CA",
        "state": "California",
        "county": "Los Angeles",
        "suburb": "",
        "city": "Los Angeles",
        "neighborhood": "Central City East",
        "street": "East 4th Street",
        "postalCode": "90033-3807",
        "houseNumber": "1800"
      },
      "score": 6.5567531586,
      "position": {
        "lat": 34.042835,
        "lng": -118.219301
      },
      "access": [
        {
          "lat": 34.04306,
          "lng": -118.21932
        },
        {
          "lat": 34.04283,
          "lng": -118.2193
        }
      ],
      "distance": 4115,
      "mapView": {
        "west": -118.22039,
        "south": 34.04194,
        "east": -118.21822,
        "north": 34.04373
      },
      "categories": [
        {
          "id": "7311",
          "name": "Gas Station",
          "primary": true
        }
      ],
      "openingHours": {
        "timeRanges": [
          {
            "startTime": {
              "date": "2025-09-01",
              "hour": 0,
              "minute": 0
            },
            "endTime": {
              "date": "2025-09-08",
              "hour": 0,
              "minute": 0
            }
          }
        ]
      },
      "detour_time": 510,
      "detour_offset": 602
    },
    {
      "title": "Shell",
      "id": "Woni4g9fK1s4sH48JTeWYw",
      "address": {
        "label": "2005 East 4th Street, Los Angeles, CA 90033",
        "countryCode": "USA",
        "countryName": "United States",
        "stateCode": "CA",
        "state": "California",
        "county": "Los Angeles",
        "suburb": "",
        "city": "Los Angeles",
        "neighborhood": "Boyle Heights",
        "street": "East 4th Street",
        "postalCode": "90033-4321",
        "houseNumber": "2005"
      },
      "score": 6.5532622337,
      "position": {
        "lat": 34.042852,
        "lng": -118.216223
      },
      "access": [
        {
          "lat": 34.04266,
          "lng": -118.21635
        },
        {
          "lat": 34.04291,
          "lng": -118.21619
        }
      ],
      "distance": 4452,
      "mapView": {
        "west": -118.21731,
        "south": 34.04195,
        "east": -118.21514,
        "north": 34.04375
      },
      "categories": [
        {
          "id": "7311",
          "name": "Gas Station",
          "primary": true
        }
      ],
      "openingHours": {
        "timeRanges": [
          {
            "startTime": {
              "date": "2025-09-01",
              "hour": 0,
              "minute": 0
            },
            "endTime": {
              "date": "2025-09-08",
              "hour": 0,
              "minute": 0
            }
          }
        ]
      },
      "detour_time": 612,
      "detour_offset": 602
    }
  ]
}
```

## API Query Limits

Nextbillion.ai allows a maximum rate limit of 2400 queries per minute or 40 queries/second for continuous requests.

## API Error Codes

| Response code | Description                                                     | Additional notes                                                                                                                                           |
| ------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200           | Normal success case.                                            | Normal success case.                                                                                                                                       |
| 400           | Input validation failed.                                        | There is a missing or an invalid parameter or a parameter with an invalid value type is added to the request.                                              |
| 401           | APIKEY not supplied or invalid                                  | This error occurs when the wrong API key is passed in the request or the key is missing altogether                                                         |
| 403           | APIKEY is valid but does not have access to requested resources | You might be querying for a geographical region which is not valid for your account, or requesting a service which is not enabled for you.                 |
| 404           | Requested host/path not found                                   | This error occurs when a malformed hostname is used.                                                                                                       |
| 422           | Could not process the request                                   | Valid results could not be generated for the given parameters. Please modify the constraints/search query.                                                 |
| 429           | Too many requests                                               | QPM or API request count quota reached                                                                                                                     |
| 500           | Internal Service error.                                         | There was an internal issue with Nextbillion.ai services. You can reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) for an explanation. |
