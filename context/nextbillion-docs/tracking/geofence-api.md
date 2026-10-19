# Geofence API

## API Overview

NextBillion.ai's Geofence API is a robust solution that enables users to establish and control custom geographical boundaries, commonly referred to as geofences, on a digital map. With this API, businesses can define areas of interest and use them for meeting various business needs. Businesses involved in providing location-based services, fleet management, asset tracking services, or logistics services can use the Geofence API to improve their operations, enhance customer experiences, and increase efficiency.

With NextBillions's Geofence API, businesses can easily create, modify and delete geofences of three types - circle, custom polygon, or isochrone based geofences on a map. Let’s take a look at the Geofence API’s methods and their properties.

## Create a Geofence

POST

https://api.nextbillion.io/geofence?key={your_api_key}

Use this method to create a new geofence through a POST request containing the necessary parameters in the request body. The parameters typically include information such as the type of geofence, its name, tags, and the geographical coordinates defining its boundary. Users can create circular, custom polygon or isochrone based geofences. Once the request is processed successfully, the geofence is created and can be used for a variety of location-based services such as geotargeting, asset tracking, and more

### Request Parameter

| Name  | Required | Format and Usage                                                                   | Description                                                                         |
| ----- | -------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: key=API_KEY | A key is a unique identifier that is required to authenticate a request to the API. |

### Request Body

| Field                         | Type                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ----------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `custom_id`                   | string                   | Set an unique ID for the new geofence. If not provided, an ID will be automatically generated in UUID format. A valid `custom_id` can contain letters, numbers, "-", & "\_" only. Please note that the ID of a geofence can not be changed once it is created.                                                                                                                                                                                |
| `type`                        | string                   | Specify the type of the geofence that is being created.                                                                                                                                                                                                                                                                                                                                                                                       |
| `name`                        | string                   | Name of the geofence. Use this field to assign a meaningful, custom name to the geofence being created.                                                                                                                                                                                                                                                                                                                                       |
| `tags`                        | array of string          | An array of strings to associate multiple tags to the geofence. `tags` can be used to search or filter geofences (using `Get Geofence List` method). Create valid `tags` using a string consisting of alphanumeric characters (A-Z, a-z, 0-9) along with the underscore ('\_') and hyphen ('-') symbols.                                                                                                                                      |
| `meta_data`                   | object                   | Metadata of the geofence. Use this field to define custom attributes that provide more context and information about the geofence being created like country, group ID etc. The data being added should be in valid JSON object format (i.e. `key` and `value` pairs). Max size allowed for the object is 65kb.                                                                                                                               |
| `circle`                      | object                   | Provide the details to create a circular geofence. Please note that this object is mandatory when `type` is `circle`. When the `type` is not `circle`, the properties of this object will be ignored while creating the geofence.                                                                                                                                                                                                             |
| `circle.center`               | object                   | Coordinate of the location which will act as the center of a circular geofence.                                                                                                                                                                                                                                                                                                                                                               |
| `circle.center.lat`           | number                   | Latitude of the `center` location.                                                                                                                                                                                                                                                                                                                                                                                                            |
| `circle.center.lon`           | number                   | Longitude of the `center` location.                                                                                                                                                                                                                                                                                                                                                                                                           |
| `circle.radius`               | number                   | Radius of the circular geofence, in meters. Maximum value allowed is 50000 meters.                                                                                                                                                                                                                                                                                                                                                            |
| `polygon`                     | object                   | Provide the details to create a custom polygon type of geofence. Please note that this object is mandatory when `type` is `polygon`. When the `type` is not `polygon`, the properties of this object will be ignored while creating the geofence. Self-intersecting polygons or polygons containing other polygons are invalid and will be removed while processing the request. Area of the polygon should be less than 2000 km<sup>2</sup>. |
| `polygon.geojson`             | object                   | An object to collect geoJSON details of the geofence. The contents of this object follow the [geoJSON standard](https://datatracker.ietf.org/doc/html/rfc7946).                                                                                                                                                                                                                                                                               |
| `polygon.geojson.type`        | string                   | Type of the geoJSON geometry. Should always be `Polygon`.                                                                                                                                                                                                                                                                                                                                                                                     |
| `polygon.geojson.coordinates` | array of array of number | An array of coordinates in the [longitude, latitude] format, representing the geofence boundary.                                                                                                                                                                                                                                                                                                                                              |
| `isochrone`                   | object                   | Provide the details to create an isochrone based geofence. Use this object when `type` is `isochrone`. When the `type` is not `isochrone`, the properties of this object will be ignored while creating the geofence.                                                                                                                                                                                                                         |
| `isochrone.coordinates`       | string                   | Coordinates of the location, in [latitude,longitude] format, which would act as the starting point for identifying the isochrone polygon or the boundary of reachable area. This parameter is mandatory when `type` is `isochrone`.                                                                                                                                                                                                           |
| `isochrone.denoise`           | number                   | A floating point value from 0.0 to 1.0 that can be used to remove smaller contours. A value of 1.0 will only return the largest contour for a given value. A value of 0.5 drops any contours that are less than half the area of the largest contour in the set of contours for that same value.                                                                                                                                              |
| `isochrone.mode`              | string                   | Set which driving mode the service should use to determine the isochrone line. For example, if you use `car`, the API will return an isochrone polygon that a car can cover within the specified time or after driving the specified distance. Using `truck` will return an isochrone that a truck can reach after taking into account appropriate truck routing restrictions.                                                                |
| `isochrone.contours_meter`    | integer                  | The distance, in meters, for which an isochrone polygon needs to be determined. When provided, the API would create a geofence representing the area that can be reached after driving the given number of meters starting from the point specified in `coordinates`. The maximum distance that can be specified is 60000 meters (60km). At least one of `contours_meter` or `contours_minute` is mandatory when `type` is `isochrone`.       |
| `isochrone.contours_minute`   | integer                  | The duration, in minutes, for which an isochrone polygon needs to be determined. When provided, the API would create a geofence representing the area that can be reached after driving for the given number of minutes starting from the point specified in `coordinates`. The maximum duration that can be specified is 40 minutes. At least one of `contours_meter` or `contours_minute` is mandatory when `type` is `isochrone`.          |
| `isochrone.departure_time`    | integer                  | A UNIX epoch timestamp in seconds format that can be used to set the departure time. The isochrone boundary will be determined based on the typical traffic conditions at the given time. If no input is provided for this parameter then the traffic conditions at the time of making the request are considered                                                                                                                             |

### Response Schema

| Field     | Type   | Description                                                                                                                                                                                                                                  |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`  | string | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information. |
| `data`    | object | A data object containing the ID of the geofence created.                                                                                                                                                                                     |
| `data.id` | string | Unique ID of the geofence created. It will be the same as `custom_id`, if provided. Else it will be an auto generated UUID. Please note this ID cannot be updated.                                                                           |

### Example 1-Create a _circle_ Geofence

Let’s create a `circle` type geofence around a hotel’s location. In the request we:

- set a location coordinate as the `center` of the circular geofence.
- define the `radius` of a circular geofence
- set the `type` of the geofence as `circle` .
- add meaningful `tags`, `meta_data` and `name`

#### Request

```bash
curl --location --request POST 'https://api.nextbillion.io/geofence?key=<your_api_key>'
      --header 'Content-Type: application/json'
      --data-raw '{
      "circle": {
          "center": {
            "lat":34.052799,
            "lon":-118.255235
          },
          "radius": 5000
        },
        "meta_data": {"building":"yes",
                      "building_name":"The Westin Bonaventure Hotel & Suites, Los Angeles"},
        "name": "The Westin Hotel staff transportation",
        "tags": [
          "Hotel-staff",
          "Free_transportation_service"
      ],
        "type": "circle"
      }'
```

#### Response

```json
{
  "status": "Ok",
  "data": {
    "id": "1287cd61-fc73-48d2-a82f-6bb4eb0d6f69"
  }
}
```

### Example 2-Create an _isochrone_ Geofence

Let’s create an `isochrone` type geofence around a hotel’s location. In the request we:

- set location `coordinates` which would act as the starting point to determine the isochrone.
- set `contours_minute` to determine the driving time and consequently the isochrone boundaries.
- add a `departure_time` to set the typical traffic conditions for which isochrone needs to be configured.
- set the `type` of the geofence as `isochrone`.
- add meaningful `tags`, `meta_data` and `name`

#### Request

```bash
curl --location --request POST 'https://api.nextbillion.io/geofence?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "isochrone": {
      "coordinates":"34.0453,-118.2666",
  "departure_time": 1691407800,
  "mode": "car",
  "denoise": 0.8,
  "contours_minute": 30
  },
  "meta_data": {
    "purpose":"isochrone_example_geofence",
      "area": "Los Angeles"
    },
  "type": "isochrone",
  "tags": [
    "delivery",
    "vehicle"
  ],
  "name": "The Ritz Carlton, Los Angeles isochrone"
}'
```

#### Request

```json
{
  "status": "Ok",
  "data": {
    "id": "409f7e0e-4cef-461c-84e1-b3715a5610d1"
  }
}
```

### Example 3-Create a _polygon_ Geofence

Let’s create an `polygon` type geofence around a hotel’s location. In the request we:

- provide `geojson` details of the polygon that we want to convert into a geofence.
- set the `type` of the geofence as `polygon`.
- add meaningful `tags`, `meta_data` and `name`

#### Request

```bash
curl --location --request POST 'https://api.nextbillion.io/geofence?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "polygon":{
     "geojson":{
         "type":"Polygon",
         "coordinates":[
             [
                 [
                    -118.268312,
                    34.046253
                 ],
                 [
                    -118.269707,
                    34.045097
                 ],
                 [
                    -118.270963,
                    34.042996
                 ],
                 [
                    -118.266940,
                    34.042149
                 ],
                 [
                    -118.264289,
                    34.044904
                 ],
                 [
                    -118.264661,
                    34.046638
                 ],
                 [
                    -118.266777,
                    34.047255
                 ],
                 [
                    -118.268312,
                    34.046253
                 ]
             ]
         ]
     }
  },
  "meta_data": {
    "purpose":"plolygon_example_geofence",
      "area": "Los Angeles"
    },
  "type": "polygon",
  "tags": [
    "delivery",
    "vehicle"
  ],
  "name": "The Ritz Carlton, Los Angeles polygon"
}'
```

#### Response

```json
{
  "status": "Ok",

  "data": {
    "id": "24760549-e83d-4ba2-82f3-3a3f3459799d"
  }
}
```

## Batch Create Geofences

POST

https://api.nextbillion.io/geofence/batch?key={your_api_key}

Use this method to create geofences in bulk by sending a POST request containing an array with details of each geofence to be created in the request body. This method is helpful in easily creating up to 100 geofences with only a single request. Users can also provide custom IDs for the geofences or else they can rely on the service to create auto-generated IDs. The service will respond with the IDs of the newly created geofences.

### Request Parameter

| Name  | Required | Format and Usage                                                                   | Description                                                                         |
| ----- | -------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: key=API_KEY | A key is a unique identifier that is required to authenticate a request to the API. |

### Request Body

| Field                                     | Type                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ----------------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `geofences`                               | array of object          | An array of objects to collect the details of the multiple geofences that need to be created.                                                                                                                                                                                                                                                                                                                                                 |
| `geofences[].custom_id`                   | string                   | Set an unique ID for the new geofence. If not provided, an ID will be automatically generated in UUID format. A valid `custom_id` can contain letters, numbers, "-", & "\_" only. Please note that the ID of a geofence can not be changed once it is created.                                                                                                                                                                                |
| `geofences[].type`                        | string                   | Specify the type of the geofence that is being created.                                                                                                                                                                                                                                                                                                                                                                                       |
| `geofences[].name`                        | string                   | Name of the geofence. Use this field to assign a meaningful, custom name to the geofence being created.                                                                                                                                                                                                                                                                                                                                       |
| `geofences[].tags`                        | array of string          | An array of strings to associate multiple tags to the geofence. `tags` can be used to search or filter geofences (using `Get Geofence List` method). Create valid `tags` using a string consisting of alphanumeric characters (A-Z, a-z, 0-9) along with the underscore ('\_') and hyphen ('-') symbols.                                                                                                                                      |
| `geofences[].meta_data`                   | object                   | Metadata of the geofence. Use this field to define custom attributes that provide more context and information about the geofence being created like country, group ID etc. The data being added should be in valid JSON object format (i.e. `key` and `value` pairs). Max size allowed for the object is 65kb.                                                                                                                               |
| `geofences[].circle`                      | object                   | Provide the details to create a circular geofence. Please note that this object is mandatory when `type` is `circle`. When the `type` is not `circle`, the properties of this object will be ignored while creating the geofence.                                                                                                                                                                                                             |
| `geofences[].circle.center`               | object                   | Coordinate of the location which will act as the center of a circular geofence.                                                                                                                                                                                                                                                                                                                                                               |
| `geofences[].circle.center.lat`           | number                   | Latitude of the `center` location.                                                                                                                                                                                                                                                                                                                                                                                                            |
| `geofences[].circle.center.lon`           | number                   | Longitude of the `center` location.                                                                                                                                                                                                                                                                                                                                                                                                           |
| `geofences[].circle.radius`               | number                   | Radius of the circular geofence, in meters. Maximum value allowed is 50000 meters.                                                                                                                                                                                                                                                                                                                                                            |
| `geofences[].polygon`                     | object                   | Provide the details to create a custom polygon type of geofence. Please note that this object is mandatory when `type` is `polygon`. When the `type` is not `polygon`, the properties of this object will be ignored while creating the geofence. Self-intersecting polygons or polygons containing other polygons are invalid and will be removed while processing the request. Area of the polygon should be less than 2000 km<sup>2</sup>. |
| `geofences[].polygon.geojson`             | object                   | An object to collect geoJSON details of the geofence. The contents of this object follow the [geoJSON standard](https://datatracker.ietf.org/doc/html/rfc7946).                                                                                                                                                                                                                                                                               |
| `geofences[].polygon.geojson.type`        | string                   | Type of the geoJSON geometry. Should always be `Polygon`.                                                                                                                                                                                                                                                                                                                                                                                     |
| `geofences[].polygon.geojson.coordinates` | array of array of number | An array of coordinates in the [longitude, latitude] format, representing the geofence boundary.                                                                                                                                                                                                                                                                                                                                              |
| `geofences[].isochrone`                   | object                   | Provide the details to create an isochrone based geofence. Use this object when `type` is `isochrone`. When the `type` is not `isochrone`, the properties of this object will be ignored while creating the geofence.                                                                                                                                                                                                                         |
| `geofences[].isochrone.coordinates`       | string                   | Coordinates of the location, in [latitude,longitude] format, which would act as the starting point for identifying the isochrone polygon or the boundary of reachable area. This parameter is mandatory when `type` is `isochrone`.                                                                                                                                                                                                           |
| `geofences[].isochrone.denoise`           | number                   | A floating point value from 0.0 to 1.0 that can be used to remove smaller contours. A value of 1.0 will only return the largest contour for a given value. A value of 0.5 drops any contours that are less than half the area of the largest contour in the set of contours for that same value.                                                                                                                                              |
| `geofences[].isochrone.mode`              | string                   | Set which driving mode the service should use to determine the isochrone line. For example, if you use `car`, the API will return an isochrone polygon that a car can cover within the specified time or after driving the specified distance. Using `truck` will return an isochrone that a truck can reach after taking into account appropriate truck routing restrictions.                                                                |
| `geofences[].isochrone.contours_meter`    | integer                  | The distance, in meters, for which an isochrone polygon needs to be determined. When provided, the API would create a geofence representing the area that can be reached after driving the given number of meters starting from the point specified in `coordinates`. The maximum distance that can be specified is 60000 meters (60km). At least one of `contours_meter` or `contours_minute` is mandatory when `type` is `isochrone`.       |
| `geofences[].isochrone.contours_minute`   | integer                  | The duration, in minutes, for which an isochrone polygon needs to be determined. When provided, the API would create a geofence representing the area that can be reached after driving for the given number of minutes starting from the point specified in `coordinates`. The maximum duration that can be specified is 40 minutes. At least one of `contours_meter` or `contours_minute` is mandatory when `type` is `isochrone`.          |
| `geofences[].isochrone.departure_time`    | integer                  | A UNIX epoch timestamp in seconds format that can be used to set the departure time. The isochrone boundary will be determined based on the typical traffic conditions at the given time. If no input is provided for this parameter then the traffic conditions at the time of making the request are considered                                                                                                                             |

### Response Schema

| Field      | Type            | Description                                                                                                                                                                                                                                  |
| ---------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`   | string          | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information. |
| `data`     | object          | A data object containing the IDs of the geofences created.                                                                                                                                                                                   |
| `data.ids` | array of string | -                                                                                                                                                                                                                                            |

### Example-Batch Create Geofence

Let’s create a request for creating one geofences of each type using the following parameters:

### Request

```bash
curl --location 'https://api.nextbillion.io/geofence/batch?key=<your_api_key>'
--header 'Content-Type: application/json; charset=utf-8'
--data '{
  "geofences": [
    {
      "custom_id": "test_batch_geofence_1",
      "isochrone": {
        "contours_meter": 25000,
        "denoise": 0.8,
        "mode": "car",
        "coordinates": "34.05067078,-118.24781414"
      },
      "tags": [
        "test_tag_1",
        "test_tag_2"
      ],
      "type": "isochrone",
      "name": "Los_Angeles_Downtown_isochrone"
    },
    {
      "custom_id": "test_batch_geofence_2",
      "tags": [
        "test_tag_2",
        "test_tag_3"
      ],
      "circle": {
        "center": {
          "lon": -118.24781414,
          "lat": 34.05067078
        },
        "radius": 150
      },
      "type": "circle",
      "name": "Los_Angeles_Downtown_circle"
    },
    {
      "custom_id": "test_batch_geofence_3",
      "polygon": {
        "geojson": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -118.25192611,
                34.05493859
              ],
              [
                -118.25672277,
                34.05083373
              ],
              [
                -118.25688055,
                34.04518596
              ],
              [
                -118.2533329,
                34.04268422
              ],
              [
                -118.24779707,
                34.04266453
              ],
              [
                -118.24525487,
                34.04565692
              ],
              [
                -118.24363926,
                34.04929884
              ],
              [
                -118.25192611,
                34.05493859
              ]
            ]
          ]
        }
      },
      "tags": [
        "test_tag_1",
        "test_tag_2"
      ],
      "type": "polygon",
      "name": "Los_Angeles_Downtown_polygon"
    }
  ]
}'
```

#### Response

```json
{
  "status": "Ok",

  "data": {
    "ids": [
      "test_batch_geofence_1",

      "test_batch_geofence_2",

      "test_batch_geofence_3"
    ]
  }
}
```

## Get a Geofence

GET

https://api.nextbillion.io/geofence/{id}?key={your_api_key}

Use this method to find an existing geofence using its ID through a GET request containing the ID of the geofence as a path parameter. Once the request is processed successfully, the API will return the details of the geofence, which typically include information such as the type of geofence, its name, tags, and the geographical coordinates defining its boundary. This method can be useful for retrieving information about a geofence that was previously created and is needed for further processing or analysis.

### Request Parameter

| Name  | Required | Format and Usage                                                                   | Description                                                                                                        |
| ----- | -------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `id`  | Yes      | Type: `string`                                                                     | ID of the geofence to be fetched. This is the ID that was generated/provided at the time of creating the geofence. |
| `key` | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: key=API_KEY | A key is a unique identifier that is required to authenticate a request to the API.                                |

### Response Schema

| Field                               | Type                     | Description                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                            | string                   | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information.                                                                                                                                 |
| `data`                              | object                   | -                                                                                                                                                                                                                                                                                                                                                                            |
| `data.geofence`                     | object                   | An object with details of the geofence.                                                                                                                                                                                                                                                                                                                                      |
| `data.geofence.id`                  | string                   | ID of the geofence provided/generated at the time of creating the geofence.                                                                                                                                                                                                                                                                                                  |
| `data.geofence.name`                | string                   | Name of the geofence added at the time of creating or updating it.                                                                                                                                                                                                                                                                                                           |
| `data.geofence.type`                | string                   | Type of the geofence.                                                                                                                                                                                                                                                                                                                                                        |
| `data.geofence.geojson`             | object                   | An object with geoJSON details of the geofence. The contents of this object follow the [geoJSON standard](https://datatracker.ietf.org/doc/html/rfc7946).                                                                                                                                                                                                                    |
| `data.geofence.geojson.type`        | string                   | Type of the geoJSON geometry. Will always be `Polygon`.                                                                                                                                                                                                                                                                                                                      |
| `data.geofence.geojson.coordinates` | array of array of number | An array of coordinates in the [longitude, latitude] format, representing the geofence boundary.                                                                                                                                                                                                                                                                             |
| `data.geofence.circle_center`       | object                   | -                                                                                                                                                                                                                                                                                                                                                                            |
| `data.geofence.circle_center.lat`   | number                   | Latitude of the location.                                                                                                                                                                                                                                                                                                                                                    |
| `data.geofence.circle_center.lon`   | number                   | Longitude of the location.                                                                                                                                                                                                                                                                                                                                                   |
| `data.geofence.circle_radius`       | number                   | When the `type` of the geofence is `circle`, this property returns the radius of the geofence in meters (m).                                                                                                                                                                                                                                                                 |
| `data.geofence.ic_contours_meter`   | integer                  | For a geofence based on isochrone contour determined using a specific driving distance, this property returns the duration value, in meters. The value would be the same as that provided for the `contours_meter` parameter at the time of creating or updating the geofence.                                                                                               |
| `data.geofence.ic_contours_minute`  | integer                  | For a geofence based on isochrone contour determined using a specific driving duration, this property returns the duration value, in minutes. The value would be the same as the value provided for the `contours_minute` parameter at the time of creating or updating the geofence.                                                                                        |
| `data.geofence.ic_coordinates`      | string                   | For a geofence based on isochrone contour, this property returns the coordinates of the location, in [latitude,longitude] format, which was used as the starting point to identify the geofence boundary. The value would be the same as that provided for the `coordinates` parameter at the time of creating or updating the geofence.                                     |
| `data.geofence.ic_departure_time`   | integer                  | For a geofence based on isochrone contour, this property returns the departure time, as a UNIX epoch timestamp in seconds, which was used to determine the geofence boundary after taking into account the traffic conditions at the time. The value would be the same as that provided for the `departure_time` parameter at the time of creating or updating the geofence. |
| `data.geofence.ic_mode`             | number                   | For a geofence based on isochrone contour, this property returns the driving mode used to determine the geofence boundary. The value would be the same as that provided for the `mode` parameter at the time of creating or updating the geofence.                                                                                                                           |
| `data.geofence.ic_denoise`          | number                   | For a geofence based on isochrone contour, this property returns the denoise value which would be the same as that provided for the `denoise` parameter at the time of creating or updating the geofence.                                                                                                                                                                    |
| `data.geofence.tags`                | array of string          | An array of strings representing the `tags` associated with the geofence added at the time of creating or updating it.                                                                                                                                                                                                                                                       |
| `data.geofence.created_at`          | integer                  | Time at which the geofence was created, expressed as a UNIX timestamp in seconds.                                                                                                                                                                                                                                                                                            |
| `data.geofence.updated_at`          | integer                  | Time at which the geofence was last updated, expressed as a UNIX timestamp in seconds.                                                                                                                                                                                                                                                                                       |
| `data.geofence.meta_data`           | object                   | Metadata of the geofence added at the time of creating or updating it.                                                                                                                                                                                                                                                                                                       |

### Example-Get a Geofence

Let’s retrieve a previously created geofence using its ID.

#### Request

```bash
curl --location --request GET 'https://api.nextbillion.io/geofence/0d469774-0c7e-411d-93d0-f1a5a1f3be16?key=<your_api_key>'
```

#### Response

```json
{
  "status": "Ok",
  "data": {
    "geofence": {
      "id": "0d469774-0c7e-411d-93d0-f1a5a1f3be16",
      "name": "SF-loc1",
      "type": "polygon",
      "geojson": {
        "type": "Polygon",
        "coordinates": [
          [
            [-122.428554017, 37.787002428],
            [-122.428065855, 37.787013027],
            [-122.428151685, 37.787383979],
            [-122.428755182, 37.787275873],
            [-122.428554017, 37.787002428]
          ]
        ]
      },
      "tags": ["source"],
      "created_at": 1684310763,
      "updated_at": 1684310763,
      "meta_data": {
        "country": "USA,San Francisco"
      }
    }
  }
}
```

## Get Multiple Geofences

GET

https://api.nextbillion.io/geofence/batch?key={your_api_key}

Use this method to search and retrieve several geofences using their IDs by sending a GET request containing the list of geofence IDs to be retrieved as a request parameter. This method can be helpful in quickly looking for multiple geofences in a single go for reference or comparison. Once a request is submitted successfully, the service would return all the matching geofences in the response along with their details.

### Request Parameter

| Name  | Required | Format and Usage                                                                   | Description                                                                         |
| ----- | -------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `ids` | Yes      | Type: `string`<br>Format: ID_1,ID_2,ID_3,....                                      | Comma(`,`) separated list of IDs of the geofences to be searched.                   |
| `key` | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: key=API_KEY | A key is a unique identifier that is required to authenticate a request to the API. |

### Response Schema

| Field                             | Type                     | Description                                                                                                                                                                                                                                                                                                                                                                  |
| --------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                          | string                   | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information.                                                                                                                                 |
| `data`                            | object                   | -                                                                                                                                                                                                                                                                                                                                                                            |
| `data.list`                       | array of object          | An array of objects containing the details of the geofences returned matching the IDs provided. Each object represents one geofence.                                                                                                                                                                                                                                         |
| `data.list[].id`                  | string                   | ID of the geofence provided/generated at the time of creating the geofence.                                                                                                                                                                                                                                                                                                  |
| `data.list[].name`                | string                   | Name of the geofence added at the time of creating or updating it.                                                                                                                                                                                                                                                                                                           |
| `data.list[].type`                | string                   | Type of the geofence.                                                                                                                                                                                                                                                                                                                                                        |
| `data.list[].geojson`             | object                   | An object with geoJSON details of the geofence. The contents of this object follow the [geoJSON standard](https://datatracker.ietf.org/doc/html/rfc7946).                                                                                                                                                                                                                    |
| `data.list[].geojson.type`        | string                   | Type of the geoJSON geometry. Will always be `Polygon`.                                                                                                                                                                                                                                                                                                                      |
| `data.list[].geojson.coordinates` | array of array of number | An array of coordinates in the [longitude, latitude] format, representing the geofence boundary.                                                                                                                                                                                                                                                                             |
| `data.list[].circle_center`       | object                   | -                                                                                                                                                                                                                                                                                                                                                                            |
| `data.list[].circle_center.lat`   | number                   | Latitude of the location.                                                                                                                                                                                                                                                                                                                                                    |
| `data.list[].circle_center.lon`   | number                   | Longitude of the location.                                                                                                                                                                                                                                                                                                                                                   |
| `data.list[].circle_radius`       | number                   | When the `type` of the geofence is `circle`, this property returns the radius of the geofence in meters (m).                                                                                                                                                                                                                                                                 |
| `data.list[].ic_contours_meter`   | integer                  | For a geofence based on isochrone contour determined using a specific driving distance, this property returns the duration value, in meters. The value would be the same as that provided for the `contours_meter` parameter at the time of creating or updating the geofence.                                                                                               |
| `data.list[].ic_contours_minute`  | integer                  | For a geofence based on isochrone contour determined using a specific driving duration, this property returns the duration value, in minutes. The value would be the same as the value provided for the `contours_minute` parameter at the time of creating or updating the geofence.                                                                                        |
| `data.list[].ic_coordinates`      | string                   | For a geofence based on isochrone contour, this property returns the coordinates of the location, in [latitude,longitude] format, which was used as the starting point to identify the geofence boundary. The value would be the same as that provided for the `coordinates` parameter at the time of creating or updating the geofence.                                     |
| `data.list[].ic_departure_time`   | integer                  | For a geofence based on isochrone contour, this property returns the departure time, as a UNIX epoch timestamp in seconds, which was used to determine the geofence boundary after taking into account the traffic conditions at the time. The value would be the same as that provided for the `departure_time` parameter at the time of creating or updating the geofence. |
| `data.list[].ic_mode`             | number                   | For a geofence based on isochrone contour, this property returns the driving mode used to determine the geofence boundary. The value would be the same as that provided for the `mode` parameter at the time of creating or updating the geofence.                                                                                                                           |
| `data.list[].ic_denoise`          | number                   | For a geofence based on isochrone contour, this property returns the denoise value which would be the same as that provided for the `denoise` parameter at the time of creating or updating the geofence.                                                                                                                                                                    |
| `data.list[].tags`                | array of string          | An array of strings representing the `tags` associated with the geofence added at the time of creating or updating it.                                                                                                                                                                                                                                                       |
| `data.list[].created_at`          | integer                  | Time at which the geofence was created, expressed as a UNIX timestamp in seconds.                                                                                                                                                                                                                                                                                            |
| `data.list[].updated_at`          | integer                  | Time at which the geofence was last updated, expressed as a UNIX timestamp in seconds.                                                                                                                                                                                                                                                                                       |
| `data.list[].meta_data`           | object                   | Metadata of the geofence added at the time of creating or updating it.                                                                                                                                                                                                                                                                                                       |

### Example-Get Multiple Geofences

Let’s create a request for searching the geofences created in the _Batch Create Geofences_ example:

#### Request

```bash
curl --location 'https://api.nextbillion.io/geofence/batch?key=<your_api_key>&ids=test_batch_geofence_1,test_batch_geofence_2,test_batch_geofence_3' \

--header 'Content-Type: application/json; charset=utf-8'
```

#### Response

```json
{
  "status": "Ok",
  "data": {
    "list": [
      {
        "id": "test_batch_geofence_1",
        "name": "Los_Angeles_Downtown_isochrone",
        "type": "isochrone",
        "geojson": {
          "type": "Polygon",
          "coordinates": [
            [
              [-118.222814, 34.242702],
              [-118.222952, 34.240809],
              [-118.223961, 34.239817],
              [-118.224397, 34.238253],
              [-118.221742, 34.241599],
              [-118.220809, 34.241671],
              [-118.222587, 34.241898],
              [-118.222814, 34.242702]
            ]
          ]
        },
        "ic_contours_meter": 25000,
        "ic_coordinates": "34.05067078,-118.24781414",
        "ic_mode": "car",
        "ic_denoise": 0.800000011920929,
        "tags": ["test_tag_1", "test_tag_2"],
        "created_at": 1698081817,
        "updated_at": 1698081823,
        "meta_data": {}
      },
      {
        "id": "test_batch_geofence_2",
        "name": "Los_Angeles_Downtown_circle",
        "type": "circle",
        "geojson": {
          "type": "Polygon",
          "coordinates": [
            [
              [-118.246189267, 34.050687265],
              [-118.246190253, 34.050620881],
              [-118.246195151, 34.050554617],
              [-118.246203949, 34.050488633],
              [-118.246216627, 34.050423087],
              [-118.246233153, 34.050358139],
              [-118.246224349, 34.050950809],
              [-118.246209758, 34.05088554],
              [-118.246199031, 34.050819754],
              [-118.246192195, 34.050753609],
              [-118.246189267, 34.050687265]
            ]
          ]
        },
        "circle_center": {
          "lon": -118.24781414,
          "lat": 34.05067078
        },
        "circle_radius": 150,
        "tags": ["test_tag_2", "test_tag_3"],
        "created_at": 1698081817,
        "updated_at": 1698081817,
        "meta_data": {}
      },
      {
        "id": "test_batch_geofence_3",
        "name": "Los_Angeles_Downtown_polygon",
        "type": "polygon",
        "geojson": {
          "type": "Polygon",
          "coordinates": [
            [
              [-118.25192611, 34.05493859],
              [-118.25672277, 34.05083373],
              [-118.25688055, 34.04518596],
              [-118.2533329, 34.04268422],
              [-118.24779707, 34.04266453],
              [-118.24525487, 34.04565692],
              [-118.24363926, 34.04929884],
              [-118.25192611, 34.05493859]
            ]
          ]
        },
        "tags": ["test_tag_1", "test_tag_2"],
        "created_at": 1698081817,
        "updated_at": 1698081817,
        "meta_data": {}
      }
    ]
  }
}
```

## Get Geofence List

GET

https://api.nextbillion.io/geofence/list?key={your_api_key}

Use this method to retrieve multiple geofences using `tags` as filter by sending a GET request containing the tag(s) as a request parameter. The API returns a list of geofences that are mapped to the specified tag(s), along with their details such as the type of geofence, name, tags, and geographical coordinates defining their boundary. This method can be useful for retrieving information about multiple geofences that are related to a specific use case or tag, making it easier to manage and organize location-based services.

### Request Parameter

| Name   | Required | Format and Usage                                                                                             | Description                                                                                                                                                                                                                                                                   |
| ------ | -------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tags` | No       | Type: `string`<br>Format: value_1,value_2,...<br>Example: tags=tags_1,O69Am2Y4KL8q5Y5JuD-Fy-tdtEpkTRQo_ZYIK7 | Comma (`,`) separated list of `tags` which will be used to filter the geofences. Please note only the geofences which have all the `tags` added to this parameter will be included in the result. This parameter can accept a string with a maximum length of 256 characters. |
| `key`  | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: key=API_KEY                           | A key is a unique identifier that is required to authenticate a request to the API.                                                                                                                                                                                           |
| `pn`   | No       | Type: `integer`<br>Default: 1<br>Example: pn=5                                                               | Denotes page number. Use this along with the `ps` parameter to implement pagination for your searched results. This parameter does not have a maximum limit but would return an empty response in case a higher value is provided when the result-set itself is smaller.      |
| `ps`   | No       | Type: `integer`<br>Default: 1<br>Example: ps=25                                                              | Denotes number of search results per page. Use this along with the `pn` parameter to implement pagination for your searched results.                                                                                                                                          |

### Response Schema

| Field                             | Type                     | Description                                                                                                                                                                                                                                                                                                                                                                  |
| --------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                          | string                   | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information.                                                                                                                                 |
| `data`                            | object                   | -                                                                                                                                                                                                                                                                                                                                                                            |
| `data.list`                       | array of object          | -                                                                                                                                                                                                                                                                                                                                                                            |
| `data.list[].id`                  | string                   | ID of the geofence provided/generated at the time of creating the geofence.                                                                                                                                                                                                                                                                                                  |
| `data.list[].name`                | string                   | Name of the geofence added at the time of creating or updating it.                                                                                                                                                                                                                                                                                                           |
| `data.list[].type`                | string                   | Type of the geofence.                                                                                                                                                                                                                                                                                                                                                        |
| `data.list[].geojson`             | object                   | An object with geoJSON details of the geofence. The contents of this object follow the [geoJSON standard](https://datatracker.ietf.org/doc/html/rfc7946).                                                                                                                                                                                                                    |
| `data.list[].geojson.type`        | string                   | Type of the geoJSON geometry. Will always be `Polygon`.                                                                                                                                                                                                                                                                                                                      |
| `data.list[].geojson.coordinates` | array of array of number | An array of coordinates in the [longitude, latitude] format, representing the geofence boundary.                                                                                                                                                                                                                                                                             |
| `data.list[].circle_center`       | object                   | -                                                                                                                                                                                                                                                                                                                                                                            |
| `data.list[].circle_center.lat`   | number                   | Latitude of the location.                                                                                                                                                                                                                                                                                                                                                    |
| `data.list[].circle_center.lon`   | number                   | Longitude of the location.                                                                                                                                                                                                                                                                                                                                                   |
| `data.list[].circle_radius`       | number                   | When the `type` of the geofence is `circle`, this property returns the radius of the geofence in meters (m).                                                                                                                                                                                                                                                                 |
| `data.list[].ic_contours_meter`   | integer                  | For a geofence based on isochrone contour determined using a specific driving distance, this property returns the duration value, in meters. The value would be the same as that provided for the `contours_meter` parameter at the time of creating or updating the geofence.                                                                                               |
| `data.list[].ic_contours_minute`  | integer                  | For a geofence based on isochrone contour determined using a specific driving duration, this property returns the duration value, in minutes. The value would be the same as the value provided for the `contours_minute` parameter at the time of creating or updating the geofence.                                                                                        |
| `data.list[].ic_coordinates`      | string                   | For a geofence based on isochrone contour, this property returns the coordinates of the location, in [latitude,longitude] format, which was used as the starting point to identify the geofence boundary. The value would be the same as that provided for the `coordinates` parameter at the time of creating or updating the geofence.                                     |
| `data.list[].ic_departure_time`   | integer                  | For a geofence based on isochrone contour, this property returns the departure time, as a UNIX epoch timestamp in seconds, which was used to determine the geofence boundary after taking into account the traffic conditions at the time. The value would be the same as that provided for the `departure_time` parameter at the time of creating or updating the geofence. |
| `data.list[].ic_mode`             | number                   | For a geofence based on isochrone contour, this property returns the driving mode used to determine the geofence boundary. The value would be the same as that provided for the `mode` parameter at the time of creating or updating the geofence.                                                                                                                           |
| `data.list[].ic_denoise`          | number                   | For a geofence based on isochrone contour, this property returns the denoise value which would be the same as that provided for the `denoise` parameter at the time of creating or updating the geofence.                                                                                                                                                                    |
| `data.list[].tags`                | array of string          | An array of strings representing the `tags` associated with the geofence added at the time of creating or updating it.                                                                                                                                                                                                                                                       |
| `data.list[].created_at`          | integer                  | Time at which the geofence was created, expressed as a UNIX timestamp in seconds.                                                                                                                                                                                                                                                                                            |
| `data.list[].updated_at`          | integer                  | Time at which the geofence was last updated, expressed as a UNIX timestamp in seconds.                                                                                                                                                                                                                                                                                       |
| `data.list[].meta_data`           | object                   | Metadata of the geofence added at the time of creating or updating it.                                                                                                                                                                                                                                                                                                       |
| `data.page`                       | object                   | An object with pagination details of the search results. Use this object to implement pagination in your application.                                                                                                                                                                                                                                                        |
| `data.page.total`                 | integer                  | An integer value indicating the total number of items available in the data set. This parameter can be used to calculate the total number of pages available.                                                                                                                                                                                                                |
| `data.page.page`                  | integer                  | An integer value indicating the current page number (starting at 0).                                                                                                                                                                                                                                                                                                         |
| `data.page.size`                  | integer                  | An integer value indicating the maximum number of items retrieved per `page`.                                                                                                                                                                                                                                                                                                |
| `data.page.hasmore`               | boolean                  | A boolean value indicating whether there are more items available beyond the current page.                                                                                                                                                                                                                                                                                   |

### Example-Get Geofence List

Let’s create a request for retrieving a list of geofences with following filters:

- couple of `tags` to retrieve specific geofences.
- implement pagination by limiting `ps` to 2 and retrieving results on the first page only.

### Request

```bash
curl --location --request GET 'https://api.nextbillion.io/geofence/list?key=<your_api_key>&tags=Los_Angeles_Hotels&ps=2&pn=1'
```

### Response

```json
{
  "status": "Ok",
  "data": {
    "list": [
      {
        "id": "1287cd61-fc73-48d2-a82f-6bb4eb0d6f69",
        "name": "Sheraton Grand Los Angeles",
        "type": "circle",
        "geojson": {
          "type": "Polygon",
          "coordinates": [
            [
              [-118.226140484, 34.048200454],
              [-118.22616052, 34.046872766],
              [-118.226258792, 34.045547496],
              [-118.226435061, 34.044227836],
              [-118.226688898, 34.042916964],
              [-118.227019689, 34.041618039],
              [-118.227426632, 34.040334189],
              [-118.227908745, 34.039068507],
              [-118.228464862, 34.03782404],
              [-118.229093642, 34.036603786],
              [-118.229793567, 34.035410683],
              [-118.230562949, 34.034247605],
              [-118.22765298, 34.056038776],
              [-118.227209086, 34.054763424],
              [-118.226840923, 34.053471478],
              [-118.226549376, 34.052166051],
              [-118.226335143, 34.050850289],
              [-118.226198738, 34.04952736],
              [-118.226140484, 34.048200454]
            ]
          ]
        },
        "circle_center": {
          "lon": -118.258637,
          "lat": 34.047872
        },
        "circle_radius": 3000,
        "tags": [
          "Hotel-Staff",
          "Free_transportation_service",
          "Los_Angeles_Hotels",
          "Sheraton_Hotel"
        ],
        "created_at": 1686259599,
        "updated_at": 1687759531,
        "meta_data": {
          "building": "yes",
          "amenity": "hotel",
          "building_name": "Sheraton Grand Los Angeles"
        }
      },
      {
        "id": "2a8f3db4-0398-4e18-9b52-c3a3efef834b",
        "name": "The Westin Hotel staff transportation",
        "type": "circle",
        "geojson": {
          "type": "Polygon",
          "coordinates": [
            [
              [-118.201070649, 34.053340222],
              [-118.201104691, 34.051127403],
              [-118.201269133, 34.04891864],
              [-118.201563568, 34.046719253],
              [-118.201987277, 34.044534539],
              [-118.202539229, 34.042369761],
              [-118.203218086, 34.040230132],
              [-118.205438003, 34.070552815],
              [-118.20445179, 34.068497637],
              [-118.203587988, 34.066404656],
              [-118.20284867, 34.064278916],
              [-118.202235608, 34.062125542],
              [-118.201750271, 34.059949723],
              [-118.201393818, 34.057756702],
              [-118.201167099, 34.055551764],
              [-118.201070649, 34.053340222]
            ]
          ]
        },
        "circle_center": {
          "lon": -118.255235,
          "lat": 34.052799
        },
        "circle_radius": 5000,
        "tags": [
          "Hotel-Staff",
          "Free_transportation_service",
          "Los_Angeles_Hotels",
          "Westin_Hotel"
        ],
        "created_at": 1686816833,
        "updated_at": 1687759582,
        "meta_data": {
          "building": "yes",
          "building_name": "The Westin Bonaventure Hotel & Suites, Los Angeles"
        }
      }
    ],
    "page": {
      "total": 356,
      "page": 1,
      "size": 2,
      "hasmore": true
    }
  }
}
```

## Update a Geofence

PUT

https://api.nextbillion.io/geofence/{id}?key={your_api_key}

Use this method to update an existing geofence by sending a PUT request containing the ID of the geofence as a path parameter and its properties to be updated in the request body. The updated details may include information such as the type of geofence, its name, tags, and the geographical coordinates defining its boundary. Once the request is processed successfully, the geofence is updated with the new information and can be used for location-based services with the updated details. It's important to note that updating a geofence may have implications for any services or applications that rely on it, so it should be done with care.

### Request Parameter

| Name  | Required | Format and Usage                                                                   | Description                                                                                                        |
| ----- | -------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `id`  | Yes      | Type: `string`                                                                     | ID of the geofence to be updated. This is the ID that was generated/provided at the time of creating the geofence. |
| `key` | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: key=API_KEY | A key is a unique identifier that is required to authenticate a request to the API.                                |

### Request Body

| Field                       | Type                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `type`                      | string                   | Use this parameter to update the `type` of a geofence. Please note that you will need to provide required details for creating a geofence of the new `type`. Check other parameters of this method to know more.                                                                                                                                                                                                                                                                                                         |
| `name`                      | string                   | Use this parameter to update the `name` of a geofence. Users can assign meaningful custom names to their geofences.                                                                                                                                                                                                                                                                                                                                                                                                      |
| `tags`                      | array of string          | Use this parameter to add/modify one or multiple `tags` of a geofence. `tags` can be used to search or filter geofences (using `Get Geofence List` method). Valid values for updating `tags` consist of alphanumeric characters (A-Z, a-z, 0-9) along with the underscore ('\_') and hyphen ('-') symbols.                                                                                                                                                                                                               |
| `meta_data`                 | object                   | Updated the `meta_data` associated with a geofence. Use this field to define custom attributes that provide more context and information about the geofence being updated like country, group ID etc. The data being added should be in valid JSON object format (i.e. `key` and `value` pairs). Max size allowed for the object is 65kb.                                                                                                                                                                                |
| `circle`                    | object                   | Use this object to update details of a circular geofence. Please note that this object is mandatory only when `type` is `circle`. When the `type` is not `circle`, the properties of this object will be ignored while creating the geofence.                                                                                                                                                                                                                                                                            |
| `circle.center`             | object                   | Use this parameter to update the coordinate of the location which will act as the center of a circular geofence.                                                                                                                                                                                                                                                                                                                                                                                                         |
| `circle.center.lat`         | number                   | Latitude of the `center` location.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `circle.center.lon`         | number                   | Longitude of the `center` location.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `circle.radius`             | number                   | Use this parameter to update the radius of the circular geofence, in meters. Maximum value allowed is 50000 meters.                                                                                                                                                                                                                                                                                                                                                                                                      |
| `polygon`                   | object                   | Use this object to update details of a custom polygon geofence. Please note that this object is mandatory only when `type` is `polygon`. When the `type` is not `polygon`, the properties of this object will be ignored while creating the geofence. Self-intersecting polygons or polygons containing other polygons are invalid and will be removed while processing the request. Area of the polygon should be less than 2000 km<sup>2</sup>.                                                                        |
| `polygon.geojson`           | object                   | An object to collect geoJSON details of the `polygon` geofence. The contents of this object follow the [geoJSON standard](https://datatracker.ietf.org/doc/html/rfc7946).                                                                                                                                                                                                                                                                                                                                                |
| `polygon.geojson.type`      | string                   | Type of the geoJSON geometry. Should always be `Polygon`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `polygon.geojson.geometry`  | array of array of number | An array of coordinates in the [longitude, latitude] format, representing the geofence boundary.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `isochrone`                 | object                   | Use this object to update details of an isochrone based geofence. Please note that this object is mandatory only when `type` is `isochrone`. When the `type` is not `isochrone`, the properties of this object will be ignored while creating the geofence.                                                                                                                                                                                                                                                              |
| `isochrone.coordinates`     | string                   | Use this parameter to update the coordinates of the location, in [latitude,longitude] format, which would act as the starting point for identifying the isochrone polygon or the boundary of reachable area.                                                                                                                                                                                                                                                                                                             |
| `isochrone.denoise`         | number                   | A floating point value from 0.0 to 1.0 that can be used to remove smaller contours. A value of 1.0 will only return the largest contour for a given value. A value of 0.5 drops any contours that are less than half the area of the largest contour in the set of contours for that same value. Use this parameter to update the denoise value of the isochrone geofence.                                                                                                                                               |
| `isochrone.mode`            | string                   | Use this parameter to update the driving mode that the service should use to determine the isochrone line. For example, if you use `car`, the API will return an isochrone polygon that a car can cover within the specified time or after driving the specified distance. Using `truck` will return an isochrone that a truck can reach after taking into account appropriate truck routing restrictions.                                                                                                               |
| `isochrone.contours_meter`  | integer                  | Use this parameter to update the distance, in meters, for which an isochrone polygon needs to be determined. When provided, the API would create a geofence representing the area that can be reached after driving the given number of meters starting from the point specified in `coordinates`. The maximum distance that can be specified is 60000 meters (60km). At least one of `contours_meter` or `contours_minute` is mandatory when `type` is `isochrone`.                                                     |
| `isochrone.contours_minute` | integer                  | Use this parameter to update the duration, in minutes, for which an isochrone polygon needs to be determined. When provided, the API would create a geofence representing the area that can be reached after driving for the given number of minutes starting from the point specified in `coordinates`. The maximum duration that can be specified is 40 minutes. At least one of `contours_meter` or `contours_minute` is mandatory when `type` is `isochrone`.                                                        |
| `isochrone.departure_time`  | integer                  | Use this parameter to update the `departure_time`, expressed as UNIX epoch timestamp in seconds. The isochrone boundary will be determined based on the typical traffic conditions at the given time. If no input is provided for this parameter then, the traffic conditions at the time of making the request are considered by default. Please note that because of this behavior the geofence boundaries may change even if the `departure_time` was not specifically provided at the time of updating the geofence. |

### Response Schema

| Field     | Type   | Description                                                                                                                                                                                                                                  |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message` | string | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                             |
| `status`  | string | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information. |

### Example-Update a Geofence

Let’s update the details of an existing geofence. We will

- change the `center` of a circular geofence
- modify the `radius` of a circular geofence
- update the `name` of a geofence

#### Request

```bash
curl --location --request PUT 'https://api.nextbillion.io/geofence/1287cd61-fc73-48d2-a82f-6bb4eb0d6f69?key=<your_api_key>'
--header 'Content-Type: application/json'
--data-raw '{
  "circle": {
    "center": {
      "lat":34.047872,
      "lon":-118.258637
    },
    "radius": 3000
  },
  "meta_data": {"building":"yes",
                "amenity":"hotel",
                "building_name":"Sheraton Grand Los Angeles"},
  "name": "Sheraton Grand Los Angeles",
  "tags": [
    "Hotel-Staff",
    "Free_transportation_service"
],
  "type": "circle"
}'
```

#### Response

```json
{
  "status": "Ok"
}
```

## Geofence Contains

GET

https://api.nextbillion.io/geofence/contain?key={your_api_key}

Use this method to determine if a specific point is contained in one or more geofences by sending a GET request containing the geofence IDs and the location coordinates as request parameters. After successful processing of the request, the API will return a list of geofences along with a boolean parameter to denote if the provided location coordinate(s) lie within the geofence or not. Please note that the product of the number of geofences and the number locations provided in input determines the matrix size. The maximum matrix size allowed per request is 5000. This method can be useful for location-based services that require checking whether a user's current position is within a specific geofenced area or not, such as delivery services, fleet management, and ride-hailing apps.

### Request Parameter

| Name        | Required | Format and Usage                                                                                                                                         | Description                                                                                                                                                                                                                       |
| ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `geofences` | No       | Type: `string`<br>Format: geofenceID_1,geofenceID_2,....<br>Example: geofences=80d1fa55-6287-4da0-93ac-2fc162d0a228,70d1fa55-1287-4da0-93ac-2fc162d0a228 | A `,` separated list geofence IDs against which the `locations` will be searched. If not provided, then the 'locations' will be searched against all your existing geofences. Maximum length of the string can be 256 characters. |
| `locations` | Yes      | Type: `string`<br>Example: 13.2580588,77.9108366\|13.2580588,77.9108366`                                                                                 | Pipe (\|) separated coordinates, in [latitude,longitude] format, of the locations to be searched against the geofences.                                                                                                           |
| `verbose`   | No       | Type: `string`<br>Default: false<br>Example: verbose=true                                                                                                | When `true`, an array with detailed information of geofences is returned. When `false`, an array containing only the IDs of the geofences is returned.                                                                            |
| `key`       | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: key=API_KEY                                                                       | A key is a unique identifier that is required to authenticate a request to the API.                                                                                                                                               |

### Response Schema

| Field                                                    | Type                     | Description                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                                                 | string                   | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information.                                                                                                                                 |
| `data`                                                   | object                   | -                                                                                                                                                                                                                                                                                                                                                                            |
| `data.result_list`                                       | array of object          | An array of objects containing each of the geofences provided in the `geofences` input. If `geofences` in not provided then the array will return all the geofences associated with the `key`                                                                                                                                                                                |
| `data.result_list[].geofence_id`                         | string                   | ID of the geofence provided/generated at the time of creating the geofence.                                                                                                                                                                                                                                                                                                  |
| `data.result_list[].geofence_detail`                     | object                   | An object with details of the geofence.                                                                                                                                                                                                                                                                                                                                      |
| `data.result_list[].geofence_detail.id`                  | string                   | ID of the geofence provided/generated at the time of creating the geofence.                                                                                                                                                                                                                                                                                                  |
| `data.result_list[].geofence_detail.name`                | string                   | Name of the geofence added at the time of creating or updating it.                                                                                                                                                                                                                                                                                                           |
| `data.result_list[].geofence_detail.type`                | string                   | Type of the geofence.                                                                                                                                                                                                                                                                                                                                                        |
| `data.result_list[].geofence_detail.geojson`             | object                   | An object with geoJSON details of the geofence. The contents of this object follow the [geoJSON standard](https://datatracker.ietf.org/doc/html/rfc7946).                                                                                                                                                                                                                    |
| `data.result_list[].geofence_detail.geojson.type`        | string                   | Type of the geoJSON geometry. Will always be `Polygon`.                                                                                                                                                                                                                                                                                                                      |
| `data.result_list[].geofence_detail.geojson.coordinates` | array of array of number | An array of coordinates in the [longitude, latitude] format, representing the geofence boundary.                                                                                                                                                                                                                                                                             |
| `data.result_list[].geofence_detail.circle_center`       | object                   | -                                                                                                                                                                                                                                                                                                                                                                            |
| `data.result_list[].geofence_detail.circle_center.lat`   | number                   | Latitude of the location.                                                                                                                                                                                                                                                                                                                                                    |
| `data.result_list[].geofence_detail.circle_center.lon`   | number                   | Longitude of the location.                                                                                                                                                                                                                                                                                                                                                   |
| `data.result_list[].geofence_detail.circle_radius`       | number                   | When the `type` of the geofence is `circle`, this property returns the radius of the geofence in meters (m).                                                                                                                                                                                                                                                                 |
| `data.result_list[].geofence_detail.ic_contours_meter`   | integer                  | For a geofence based on isochrone contour determined using a specific driving distance, this property returns the duration value, in meters. The value would be the same as that provided for the `contours_meter` parameter at the time of creating or updating the geofence.                                                                                               |
| `data.result_list[].geofence_detail.ic_contours_minute`  | integer                  | For a geofence based on isochrone contour determined using a specific driving duration, this property returns the duration value, in minutes. The value would be the same as the value provided for the `contours_minute` parameter at the time of creating or updating the geofence.                                                                                        |
| `data.result_list[].geofence_detail.ic_coordinates`      | string                   | For a geofence based on isochrone contour, this property returns the coordinates of the location, in [latitude,longitude] format, which was used as the starting point to identify the geofence boundary. The value would be the same as that provided for the `coordinates` parameter at the time of creating or updating the geofence.                                     |
| `data.result_list[].geofence_detail.ic_departure_time`   | integer                  | For a geofence based on isochrone contour, this property returns the departure time, as a UNIX epoch timestamp in seconds, which was used to determine the geofence boundary after taking into account the traffic conditions at the time. The value would be the same as that provided for the `departure_time` parameter at the time of creating or updating the geofence. |
| `data.result_list[].geofence_detail.ic_mode`             | number                   | For a geofence based on isochrone contour, this property returns the driving mode used to determine the geofence boundary. The value would be the same as that provided for the `mode` parameter at the time of creating or updating the geofence.                                                                                                                           |
| `data.result_list[].geofence_detail.ic_denoise`          | number                   | For a geofence based on isochrone contour, this property returns the denoise value which would be the same as that provided for the `denoise` parameter at the time of creating or updating the geofence.                                                                                                                                                                    |
| `data.result_list[].geofence_detail.tags`                | array of string          | An array of strings representing the `tags` associated with the geofence added at the time of creating or updating it.                                                                                                                                                                                                                                                       |
| `data.result_list[].geofence_detail.created_at`          | integer                  | Time at which the geofence was created, expressed as a UNIX timestamp in seconds.                                                                                                                                                                                                                                                                                            |
| `data.result_list[].geofence_detail.updated_at`          | integer                  | Time at which the geofence was last updated, expressed as a UNIX timestamp in seconds.                                                                                                                                                                                                                                                                                       |
| `data.result_list[].geofence_detail.meta_data`           | object                   | Metadata of the geofence added at the time of creating or updating it.                                                                                                                                                                                                                                                                                                       |
| `data.result_list[].result`                              | array of object          | An array of objects with results of the contains check for each of the coordinate points in `locations` against the geofence represented by `geofence_id`.                                                                                                                                                                                                                   |
| `data.result_list[].result[].contain`                    | boolean                  | `true` when a coordinate point in `locations` is contained by this geofence.                                                                                                                                                                                                                                                                                                 |
| `data.result_list[].result[].location_index`             | integer                  | Index of the coordinate point in the input `locations`.                                                                                                                                                                                                                                                                                                                      |

### Example-Geofence Contains

Let’s create a request to check if some `locations` belong to a given set of `geofences`.

#### Request

```bash
curl --location --request GET 'https://api.nextbillion.io//geofence/contain?key=<your_api_key>&geofences=07fe7b57-1255-42ae-99af-44e4e3d2468a,088f8823-9ef0-4029-8ff0-6cddaac25e42&locations=13.25805884388484,77.91083661048299|13.25805884388484,77.91083661048299|17.446580,78.394902&verbose=false'
```

#### Response

```json
{
  "status": "Ok",
  "data": {
    "result_list": [
      {
        "geofence_id": "07fe7b57-1255-42ae-99af-44e4e3d2468a",
        "result": [
          {
            "contain": false,
            "location_index": 0
          },
          {
            "contain": false,
            "location_index": 1
          },
          {
            "contain": true,
            "location_index": 2
          }
        ]
      },
      {
        "geofence_id": "088f8823-9ef0-4029-8ff0-6cddaac25e42",
        "result": [
          {
            "contain": false,
            "location_index": 0
          },
          {
            "contain": false,
            "location_index": 1
          },
          {
            "contain": false,
            "location_index": 2
          }
        ]
      }
    ]
  }
}
```

## Delete a Geofence

DELETE

https://api.nextbillion.io/geofence/{id}?key={your_api_key}

Use this method to delete an existing geofence by sending a DELETE request containing the ID of the geofence as a path parameter. It's important to note that deleting a geofence may have implications for any services or applications that rely on it, so it should be done with care.

### Request Parameter

| Name  | Required | Format and Usage                                                                   | Description                                                                                                        |
| ----- | -------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `id`  | Yes      | Type: `string`                                                                     | ID of the geofence to be deleted. This is the ID that was generated/provided at the time of creating the geofence. |
| `key` | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: key=API_KEY | A key is a unique identifier that is required to authenticate a request to the API.                                |

### Response Schema

| Field     | Type   | Description                                                                                                                                                                                                                                  |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message` | string | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                             |
| `status`  | string | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information. |

### Example-Delete a Geofence

Following is a sample request to delete a previously created geofence using its ID

#### Request

```bash
curl --location --request DELETE 'https://api.nextbillion.io/geofence/0c3fdb5b-ef38-4e84-abfe-bfebd29ac1a1?key=<your_api_key>'
```

#### Response

```json
{
  "status": "ok"
}
```

## Batch Delete Geofence

DELETE

https://api.nextbillion.io/geofence/batch?key={your_api_key}

Use this method to delete geofences in bulk using their IDs by sending a DELETE request containing the array of geofence IDs to be deleted in the request body. This method can be useful for managing and organizing geofences in bulk. It's important to note that deleting a geofences may have implications for any services or applications that rely on it, so it should be done with care.

### Request Parameter

| Name  | Required | Format and Usage                                                                   | Description                                                                         |
| ----- | -------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: key=API_KEY | A key is a unique identifier that is required to authenticate a request to the API. |

### Request Body

| Field | Type            | Description                                                                                                                                  |
| ----- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `ids` | array of string | An array IDs of the geofence to be deleted. These are the IDs that were generated/provided at the time of creating the respective geofences. |

### Response Schema

| Field     | Type   | Description                                                                                                                                                                                                                                  |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message` | string | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                             |
| `status`  | string | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information. |

### Example-Batch Delete Geofence

Following is an example of deleting multiple geofences with a single request.

#### Request

```bash
curl --location --request DELETE 'https://api.nextbillion.io/geofence/batch?key=<your_api_key>'
--header 'Content-Type: application/json'
--data-raw '{
    "ids":["0031d8a1-c4da-4b54-9bb8-ddee765e605f",
"11af6ddd-c69e-4235-967d-0e68002f58aa"
]
}'
```

#### Response

```json
{
  "status": "ok"
}
```

## Namespaces

Namespaces help users to create multiple keys under one parent organization. This feature allows users to share the capabilities of Geofence API with multiple consumers (customers, teams, departments etc) while ensuring isolation of underlying data - a key belonging to a namespace can access the data belonging to that namespace only. However, using namespaces is **not** mandatory to access the capabilities of Geofence services.

### Create a namespaced key

Once a request for creating a new namespace key is successfully submitted, the service responds with a unique key for the namespace along with an expiration date for the key. The newly created keys are available for use in 15 minutes after they have been created.

Please note that once the namespace keys are created, users can manage them through the APIs & Services > Credentials section of their [NextBillion Console](https://console.nextbillion.ai).

POST

https://namespaces.nextbillion.io/namespaced-apikeys?namespace={namespace}&key={your_api_key}

#### Request Parameter

| Name        | Required | Format and Usage                               | Description                                                                                                                                                                                                                                                                                                             |
| ----------- | -------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `namespace` | Yes      | Type: `string`<br>Example: namespace=test_name | Specify a name for the `namespace`. If the namespace specified is unique then a new namespace along with a new key is created. Whereas if the specified `namespace` is not unique, a new key will be created in the existing `namespace`. Please note that a `namespace` cannot be created using another namespace key. |
| `key`       | Yes      | Type: `string`                                 | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai).                                                                |

#### Response Schema

| Field               | Type    | Description                                                                                                      |
| ------------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| `status`            | integer | Returns the API response code.                                                                                   |
| `result`            | object  | An object to return the details about the namespace key created.                                                 |
| `result.apikey`     | string  | Returns the unique `key` created for the specified namespace.                                                    |
| `result.namespace`  | string  | Returns the name of the `namespace` for which the key is created.                                                |
| `result.expires_at` | integer | Returns the time, expressed as UNIX epoch timestamp in seconds, when the namespace key will expire.              |
| `result.sub_id`     | string  | An internal subscription ID.                                                                                     |
| `result.created_at` | integer | Returns the time, expressed as UNIX epoch timestamp in seconds, when the namespace key was created.              |
| `message`           | string  | Returns the error message in case of any error. If there is no error, then this field is absent in the response. |
| `error`             | string  | Returns the error type in case of any error. If there is no error, then this field is absent in the response.    |

#### Sample API Request

Let’s create a new namespace called _sample_namespace_.

```bash
curl --location --request POST 'https://namespaces.nextbillion.io/namespaced-apikeys?key=<your_api_key>&namespace=sample_namespace'
```

#### Sample API Response

```json
{
  "status": 200,
  "result": {
    "apikey": "d8a89ced8e723dg6a857df20e0d91207",
    "namespace": "sample_namespace",
    "expired_at": 1735656412,
    "sub_id": 692,
    "created_at": 1732008505
  }
}
```

### Delete a namespace key

Users can also delete an existing namespace key using the HTTP DELETE method to the endpoint listed below. Users need to provide the key to be deleted and the namespace to which it belongs to . Please note that a namespace key can’t be used to delete another namespace key. The deleted key will be unavailable for use after 15 minutes once they have been deleted.

Please note that once the namespace keys are created, users can manage them through the APIs & Services > Credentials section of their [NextBillion Console](https://console.nextbillion.ai).

DELETE

https://namespaces.nextbillion.io/namespaced-apikeys?key={your_api_key}&namespace={namespace_name}&key_to_delete={key_to_delete}

#### Request Parameter

| Name            | Required | Format and Usage                                                                   | Description                                                                                                                                                                                                                                                                                                                                       |
| --------------- | -------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`           | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: key=API_KEY | A key is a unique identifier that is required to authenticate a request to the API. Please note for the delete namespace key operation another namespace key cannot be used. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |
| `namespace`     | Yes      | Type: `string`                                                                     | Specify the name of the `namespace` to which the \`key_to_delete\` belongs. Please note that a namespace key cannot be deleted using another namespace key.                                                                                                                                                                                       |
| `key_to_delete` | Yes      | Type: `string`                                                                     | Specify the key to be deleted.                                                                                                                                                                                                                                                                                                                    |

#### Response Schema

| Field    | Type    | Description                                                                                                                                                                                                          |
| -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status` | integer | A string indicating the state of the response. A successful delete operation ins indicated by an HTTP code of`200`. See the [API Error Codes](#api-error-codes) section below for possible values in case of errors. |
| `msg`    | string  | Its value is `OK` in case of a successful delete operation. Indicative error messages are returned otherwise, for different errors.                                                                                  |

#### Sample API Request

Let’s delete a key represented by _<namespace_key>_, belonging to a namespace called _sample_namespace_.

```bash
curl --location --request DELETE 'https://namespaces.nextbillion.io/namespaced-apikeys?key=<your_api_key>&namespace=sample_namespace&key_to_delete=<namespace_key>'
```

#### Sample API Response

```json
{
  "status": 200,
  "msg": "OK"
}
```

## API Query Limits

- When creating geofences, please ensure the right input parameters are used depending on the value of `type`.
- The maximum number of characters in the `meta_data` object should be such that the overall size of the object is not more than 65Kb.
- When creating a `circle` type of geofence, the `radius` of the circle should not be more than 50000 m (50 km).
- When creating an `isochrone` type of geofence:
  - The drive duration i.e. the value of `contours_minute` can be set to a maximum of 40 minutes and the maximum drive distance i.e. the value of `contours_meter` is 60000 meters.
  - It is recommended to provide only one of `contours_meter` and `contours_minute`. If both `contours_meter` and `contours_minute` are provided, `contours_meter` will be ignored. An error would be returned if none of them are provided.

- When creating a `polygon` type of geofence:
  - an open polygon (when the first and the last coordinates are not equal) or a self-intersecting polygon or a polygon containing other polygons should not be provided as input. If provided, then such polygons would be ignored while processing the request.
  - Please ensure that the area of the desired polygon is less than 1,000,000 km2.

- A maximum of 100 geofences can be created using the _Batch Create Geofences_ method.
- When implementing pagination on the results of Get Geofence List, page size i.e. `ps` can be set to a maximum of 100 items per page.
- For `string` type parameters like `tags`, `geofences`, `locations` etc the maximum length of input values should not be more than 256 characters.
- For _Geofence Contains_ method, please note the product of the number of geofences and the number locations provided in input determines the matrix size. The maximum matrix size allowed per request is 5000.
- NextBillion.ai allows a maximum rate limit of 6000 queries per minute or 100 queries/second for continuous requests.
  _Note_: We can increase the quota if needed, on request. Contact [support@nextbillion.ai](mailto:support@nextbillion.ai) for more details.

## API Error Codes

| Response Code | Description                                                      | Additional Notes                                                                                                                                           |
| ------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200           | Normal success case.                                             | Normal success case.                                                                                                                                       |
| 400           | Input validation failed.                                         | There is a missing or an invalid parameter or a parameter with an invalid value type is added to the request.                                              |
| 401           | APIKEY not supplied or invalid.                                  | This error occurs when the wrong API key is passed in the request or the key is missing altogether                                                         |
| 403           | APIKEY is valid but does not have access to requested resources. | You might be querying for a geographical region which is not valid for your account or requesting a service which is not enabled for you.                  |
| 404           | Requested host/path not found.                                   | This error occurs when a malformed hostname is used.                                                                                                       |
| 422           | Could not process the request.                                   | Valid geofence could not be generated for the given combination of parameters. Please check the error message for more details.                            |
| 429           | Too many requests.                                               | QPM reached or API request count quota reached.                                                                                                            |
| 500           | Internal Service error.                                          | There was an internal issue with NextBillion.ai services. You can reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) for an explanation. |
